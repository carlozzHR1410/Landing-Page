import { useState } from 'react'
import { useReports } from '../context/ReportsContext'
import { formatElapsedTime, isIssueReport, isRestoreReport } from '../utils/reportUtils'

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'issues', label: 'Reportados' },
  { id: 'restores', label: 'Restablecidos' },
]

function ReportsPage() {
  const { reports, notice } = useReports()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedDistrict, setSelectedDistrict] = useState('all')

  const departmentOptions = [...new Set(reports.map((report) => report.department).filter(Boolean))].sort(
    (left, right) => left.localeCompare(right, 'es'),
  )

  const districtOptions = [
    ...new Set(
      reports
        .filter((report) => selectedDepartment === 'all' || report.department === selectedDepartment)
        .map((report) => report.district)
        .filter(Boolean),
    ),
  ].sort((left, right) => left.localeCompare(right, 'es'))

  const filteredReports = reports.filter((report) => {
    if (activeFilter === 'issues') {
      if (!isIssueReport(report)) {
        return false
      }
    }

    if (activeFilter === 'restores') {
      if (!isRestoreReport(report)) {
        return false
      }
    }

    if (selectedDepartment !== 'all' && report.department !== selectedDepartment) {
      return false
    }

    if (selectedDistrict !== 'all' && report.district !== selectedDistrict) {
      return false
    }

    return true
  })

  const totalIssues = reports.filter(isIssueReport).length
  const totalRestores = reports.filter(isRestoreReport).length

  return (
    <section className="page reports-page">
      <div className="page-head">
        <h1>Todos los reportes</h1>
        <p>Consulta fallas reportadas y servicios restablecidos en la zona oriental.</p>
      </div>

      {notice && <p className="serv-alert-notice report-notice">{notice}</p>}

      <div className="summary-grid reports-summary-grid reports-summary-grid-compact">
        <article className="summary-card">
          <strong>{reports.length}</strong>
          <span>Movimientos registrados</span>
        </article>
        <article className="summary-card">
          <strong>{totalIssues}</strong>
          <span>Fallas reportadas</span>
        </article>
        <article className="summary-card">
          <strong>{totalRestores}</strong>
          <span>Restablecimientos</span>
        </article>
      </div>

      <div className="report-filter-row" role="tablist" aria-label="Filtros de reportes">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="report-select-row">
        <label className="report-select-field">
          <span>Departamento</span>
          <select
            value={selectedDepartment}
            onChange={(event) => {
              setSelectedDepartment(event.target.value)
              setSelectedDistrict('all')
            }}
          >
            <option value="all">Todos</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="report-select-field">
          <span>Distrito</span>
          <select
            value={selectedDistrict}
            onChange={(event) => setSelectedDistrict(event.target.value)}
          >
            <option value="all">Todos</option>
            {districtOptions.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="reports-feed">
        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <p>No hay reportes para este filtro.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <article className="report-card" key={`${report.reportType}-${report.id}`}>
              <div className="report-card-head">
                <div>
                  <h2>{report.service}</h2>
                  <p>
                    {report.district}, {report.department}
                  </p>
                </div>
                <div className="report-badge-group">
                  <span className={`report-kind report-kind-${report.reportType}`}>
                    {report.reportType === 'issue' ? 'Reportado' : 'Restablecido'}
                  </span>
                </div>
              </div>

              <p className="report-description">{report.description}</p>

              <div className="report-meta-grid">
                <p>
                  <strong>Persona:</strong> {report.name}
                </p>
                <p>
                  <strong>Ubicacion:</strong> {report.location}
                </p>
                <p>
                  <strong>Tiempo:</strong> {formatElapsedTime(report.createdAt)}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(report.createdAt).toLocaleString('es-SV')}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default ReportsPage
