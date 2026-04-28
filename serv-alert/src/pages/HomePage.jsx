import { Link } from 'react-router-dom'
import AlertBadge from '../features/validation/AlertBadge'
import { useReports } from '../features/reports/useReports'

function HomePage() {
  const { reports } = useReports()
  const alertCount = reports.filter((report) => report.status === 'alert').length

  return (
    <section className="page">
      <div className="card hero-card">
        <h1>Reporta cortes de energia y agua en minutos</h1>
        <p>Serv-Alert conecta a vecinos de la zona oriental para activar alertas comunitarias.</p>
        <div className="row-inline">
          <AlertBadge count={alertCount} />
          <Link className="btn btn-primary" to="/report">
            Crear reporte
          </Link>
        </div>
      </div>
      <div className="grid-two">
        <article className="card metric">
          <h2>{reports.length}</h2>
          <p>Reportes activos</p>
        </article>
        <article className="card metric">
          <h2>{reports.filter((report) => report.status === 'alert').length}</h2>
          <p>Alertas escaladas</p>
        </article>
      </div>
    </section>
  )
}

export default HomePage
