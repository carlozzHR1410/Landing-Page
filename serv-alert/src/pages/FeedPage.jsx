import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ReportCard from '../features/reports/ReportCard'
import { useReports } from '../features/reports/useReports'
import { useDebounce } from '../hooks/useDebounce'

function FeedPage() {
  const { reports, reportsLoading, reportsError, confirmReport, hasConfirmed } = useReports()
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const debouncedDepartment = useDebounce(departmentFilter, 200)

  const filtered = useMemo(
    () =>
      reports.filter(
        (report) =>
          (!debouncedDepartment || report.department === debouncedDepartment) &&
          (!serviceFilter || report.service_type === serviceFilter),
      ),
    [reports, debouncedDepartment, serviceFilter],
  )

  return (
    <section className="page">
      <h1>Feed comunitario</h1>
      <div className="card filters">
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="">Todos los departamentos</option>
          <option value="San Miguel">San Miguel</option>
          <option value="Usulután">Usulután</option>
          <option value="Morazán">Morazán</option>
          <option value="La Unión">La Unión</option>
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
          <option value="">Todos los servicios</option>
          <option value="energia">Energía</option>
          <option value="agua">Agua</option>
        </select>
      </div>
      {reportsLoading && <p>Cargando reportes...</p>}
      {reportsError && <p>{reportsError}</p>}
      {!reportsLoading && !reportsError && filtered.length === 0 && (
        <p>No hay resultados para los filtros seleccionados.</p>
      )}
      <div className="stack">
        {filtered.map((report) => (
          <div key={report.id} className="feed-item">
            <ReportCard
              report={report}
              onConfirm={confirmReport}
              disabledConfirm={hasConfirmed(report.id)}
            />
            <Link to={`/feed/${report.id}`} className="link-strong">
              Ver detalle del reporte
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeedPage
