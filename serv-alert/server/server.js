import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise'

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

function mapReport(row) {
  return {
    id: row.id,
    reportType: row.reportType,
    service: row.service,
    location: row.location,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
  }
}

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true })
  } catch (error) {
    response.status(500).json({ ok: false, message: 'No se pudo conectar a MySQL.' })
  }
})

app.get('/api/reports', async (_request, response) => {
  try {
    const [rows] = await pool.query(
      `
        SELECT
          id,
          report_type AS reportType,
          service,
          location,
          full_name AS name,
          description,
          created_at AS createdAt
        FROM reports
        ORDER BY created_at DESC, id DESC
        LIMIT 20
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
  const { reportType, service, location, name, description } = request.body || {}

  if (!['issue', 'restore'].includes(reportType)) {
    return response.status(400).json({ message: 'Tipo de reporte invalido.' })
  }

  if (![service, location, name, description].every((value) => String(value || '').trim())) {
    return response.status(400).json({ message: 'Todos los campos son obligatorios.' })
  }

  try {
    const [result] = await pool.execute(
      `
        INSERT INTO reports (
          report_type,
          service,
          location,
          full_name,
          email,
          dui,
          description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        reportType,
        service.trim(),
        location.trim(),
        name.trim(),
        '',
        '',
        description.trim(),
      ],
    )

    const [rows] = await pool.query(
      `
        SELECT
          id,
          report_type AS reportType,
          service,
          location,
          full_name AS name,
          description,
          created_at AS createdAt
        FROM reports
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

app.listen(port, () => {
  console.log(`SERV-ALERT API escuchando en http://localhost:${port}`)
})
