import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise'
import demoReports from '../src/data/demoReports.js'

const app = express()
const port = Number(process.env.PORT || 3000)

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'serv_alert',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

app.use(cors())
app.use(express.json())

function splitLocation(location) {
  const parts = String(location || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  if (parts.length >= 2) {
    return {
      district: parts[0],
      department: parts.slice(1).join(', '),
    }
  }

  const fallback = parts[0] || 'Sin distrito'

  return {
    district: fallback,
    department: fallback,
  }
}

function buildLocationLabel(department, district) {
  return [district, department].filter(Boolean).join(', ')
}

function mapReport(row) {
  return {
    id: row.id,
    reportType: row.reportType,
    status: row.status,
    relatedReportId: row.relatedReportId,
    service: row.service,
    department: row.department,
    district: row.district,
    location: row.location,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
  }
}

const selectReportColumns = `
  SELECT
    id,
    report_type AS reportType,
    status,
    related_report_id AS relatedReportId,
    service,
    department,
    district,
    location,
    full_name AS name,
    description,
    created_at AS createdAt
  FROM reports
`

async function ensureReportsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      report_type ENUM('issue', 'restore') NOT NULL,
      status ENUM('active', 'restored') NOT NULL DEFAULT 'active',
      related_report_id BIGINT UNSIGNED NULL,
      service VARCHAR(80) NOT NULL,
      department VARCHAR(120) NOT NULL,
      district VARCHAR(120) NOT NULL,
      location VARCHAR(255) NOT NULL,
      full_name VARCHAR(140) NOT NULL,
      email VARCHAR(190) NOT NULL DEFAULT '',
      dui VARCHAR(20) NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_reports_created_at (created_at),
      KEY idx_reports_type (report_type),
      KEY idx_reports_status (status),
      KEY idx_reports_related_report_id (related_report_id)
    )
  `)
}

async function getTableColumns() {
  const [rows] = await pool.query('SHOW COLUMNS FROM reports')
  return new Set(rows.map((row) => row.Field))
}

async function addMissingColumns(columns) {
  const updates = []

  if (!columns.has('status')) {
    updates.push(
      "ADD COLUMN status ENUM('active', 'restored') NOT NULL DEFAULT 'active' AFTER report_type",
    )
  }

  if (!columns.has('related_report_id')) {
    updates.push('ADD COLUMN related_report_id BIGINT UNSIGNED NULL AFTER status')
  }

  if (!columns.has('department')) {
    updates.push("ADD COLUMN department VARCHAR(120) NOT NULL DEFAULT '' AFTER service")
  }

  if (!columns.has('district')) {
    updates.push("ADD COLUMN district VARCHAR(120) NOT NULL DEFAULT '' AFTER department")
  }

  if (updates.length) {
    await pool.query(`ALTER TABLE reports ${updates.join(', ')}`)
  }
}

async function backfillDerivedFields() {
  await pool.query(`
    UPDATE reports
    SET status = 'restored'
    WHERE report_type = 'restore'
      AND status <> 'restored'
  `)

  await pool.query(`
    UPDATE reports
    SET status = 'active'
    WHERE report_type = 'issue'
      AND (status IS NULL OR status = '')
  `)

  const [rows] = await pool.query(`
    SELECT id, location, department, district
    FROM reports
    WHERE department = '' OR district = '' OR department IS NULL OR district IS NULL
  `)

  for (const row of rows) {
    const { department, district } = splitLocation(row.location)
    const normalizedLocation = buildLocationLabel(department, district)

    await pool.execute(
      `
        UPDATE reports
        SET department = ?, district = ?, location = ?
        WHERE id = ?
      `,
      [department, district, normalizedLocation, row.id],
    )
  }
}

async function ensureIndexes() {
  const [rows] = await pool.query('SHOW INDEX FROM reports')
  const indexes = new Set(rows.map((row) => row.Key_name))

  if (!indexes.has('idx_reports_created_at')) {
    await pool.query('CREATE INDEX idx_reports_created_at ON reports (created_at)')
  }

  if (!indexes.has('idx_reports_type')) {
    await pool.query('CREATE INDEX idx_reports_type ON reports (report_type)')
  }

  if (!indexes.has('idx_reports_status')) {
    await pool.query('CREATE INDEX idx_reports_status ON reports (status)')
  }

  if (!indexes.has('idx_reports_related_report_id')) {
    await pool.query('CREATE INDEX idx_reports_related_report_id ON reports (related_report_id)')
  }
}

async function ensureForeignKey() {
  const [rows] = await pool.query(`
    SELECT CONSTRAINT_NAME AS constraintName
    FROM information_schema.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'reports'
      AND CONSTRAINT_NAME = 'fk_reports_related_report'
  `)

  if (!rows.length) {
    try {
      await pool.query(`
        ALTER TABLE reports
        ADD CONSTRAINT fk_reports_related_report
          FOREIGN KEY (related_report_id) REFERENCES reports (id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
      `)
    } catch (error) {
      console.warn(`No se pudo crear la llave foranea de reports: ${error.message}`)
    }
  }
}

async function ensureReportsSchema() {
  await ensureReportsTable()
  const columns = await getTableColumns()
  await addMissingColumns(columns)
  await backfillDerivedFields()
  await ensureIndexes()
  await ensureForeignKey()
}

async function seedDemoReportsIfNeeded() {
  const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM reports')
  const total = Number(countRows[0]?.total || 0)

  const [demoRows] = await pool.query(
    'SELECT COUNT(*) AS total FROM reports WHERE id BETWEEN 101 AND 299',
  )
  const demoCount = Number(demoRows[0]?.total || 0)

  if (total >= 15 || demoCount >= 15) {
    return
  }

  for (const report of demoReports) {
    await pool.execute(
      `
        INSERT IGNORE INTO reports (
          id,
          report_type,
          status,
          related_report_id,
          service,
          department,
          district,
          location,
          full_name,
          email,
          dui,
          description,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, ?)
      `,
      [
        report.id,
        report.reportType,
        report.status,
        report.relatedReportId,
        report.service,
        report.department,
        report.district,
        report.location,
        report.name,
        report.description,
        new Date(report.createdAt),
      ],
    )
  }
}

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true })
  } catch {
    response.status(500).json({ ok: false, message: 'No se pudo conectar a MySQL.' })
  }
})

app.get('/api/reports', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `
        ${selectReportColumns}
        ORDER BY created_at DESC, id DESC
        LIMIT 100
      `,
    )

    response.json({ reports: rows.map(mapReport) })
  } catch (error) {
    response.status(500).json({
      message: 'No se pudieron leer los reportes desde MySQL.',
      detail: error.message,
    })
  }
})

app.post('/api/reports', async (request, response) => {
  const { reportId, reportType, service, department, district, name, description } = request.body || {}

  if (!['issue', 'restore'].includes(reportType)) {
    return response.status(400).json({ message: 'Tipo de reporte invalido.' })
  }

  if (!String(name || '').trim() || !String(description || '').trim()) {
    return response.status(400).json({ message: 'Nombre y descripcion son obligatorios.' })
  }

  if (reportType === 'restore') {
    if (!Number(reportId)) {
      return response.status(400).json({ message: 'Debes seleccionar un reporte valido.' })
    }

    let connection

    try {
      connection = await pool.getConnection()
      await connection.beginTransaction()

      const [issueRows] = await connection.query(
        `
          ${selectReportColumns}
          WHERE id = ? AND report_type = 'issue'
          LIMIT 1
          FOR UPDATE
        `,
        [Number(reportId)],
      )

      if (!issueRows.length) {
        await connection.rollback()
        return response.status(404).json({ message: 'El reporte base no existe.' })
      }

      const issue = mapReport(issueRows[0])

      if (issue.status === 'restored') {
        await connection.rollback()
        return response.status(409).json({ message: 'Ese reporte ya fue marcado como restablecido.' })
      }

      await connection.execute(`UPDATE reports SET status = 'restored' WHERE id = ? LIMIT 1`, [
        issue.id,
      ])

      const [insertResult] = await connection.execute(
        `
          INSERT INTO reports (
            report_type,
            status,
            related_report_id,
            service,
            department,
            district,
            location,
            full_name,
            email,
            dui,
            description
          )
          VALUES ('restore', 'restored', ?, ?, ?, ?, ?, ?, '', '', ?)
        `,
        [
          issue.id,
          issue.service,
          issue.department,
          issue.district,
          issue.location,
          String(name).trim(),
          String(description).trim(),
        ],
      )

      const [restoreRows] = await connection.query(
        `
          ${selectReportColumns}
          WHERE id = ?
          LIMIT 1
        `,
        [insertResult.insertId],
      )

      await connection.commit()

      return response.status(201).json({
        report: mapReport(restoreRows[0]),
        updatedIssue: { ...issue, status: 'restored' },
      })
    } catch (error) {
      if (connection) {
        await connection.rollback()
      }
      return response.status(500).json({
        message: 'No se pudo guardar el restablecimiento en MySQL.',
        detail: error.message,
      })
    } finally {
      if (connection) {
        connection.release()
      }
    }
  }

  if (![service, department, district].every((value) => String(value || '').trim())) {
    return response.status(400).json({ message: 'Servicio, departamento y distrito son obligatorios.' })
  }

  try {
    const location = buildLocationLabel(String(department).trim(), String(district).trim())

    const [result] = await pool.execute(
      `
        INSERT INTO reports (
          report_type,
          status,
          related_report_id,
          service,
          department,
          district,
          location,
          full_name,
          email,
          dui,
          description
        )
        VALUES ('issue', 'active', NULL, ?, ?, ?, ?, ?, '', '', ?)
      `,
      [
        String(service).trim(),
        String(department).trim(),
        String(district).trim(),
        location,
        String(name).trim(),
        String(description).trim(),
      ],
    )

    const [rows] = await pool.query(
      `
        ${selectReportColumns}
        WHERE id = ?
        LIMIT 1
      `,
      [result.insertId],
    )

    response.status(201).json({ report: mapReport(rows[0]) })
  } catch (error) {
    response.status(500).json({
      message: 'No se pudo guardar el reporte en MySQL.',
      detail: error.message,
    })
  }
})

async function startServer() {
  try {
    await ensureReportsSchema()
    await seedDemoReportsIfNeeded()

    app.listen(port, () => {
      console.log(`SERV-ALERT API escuchando en http://localhost:${port}`)
    })
  } catch (error) {
    console.error(`No se pudo iniciar SERV-ALERT API: ${error.message}`)
    process.exit(1)
  }
}

startServer()
