import { Link } from 'react-router-dom'
import { useState } from 'react'
import AlertBadge from '../features/validation/AlertBadge'
import { useReports } from '../features/reports/useReports'

function HomePage() {
  const { reports } = useReports()
  const [renderTimestamp] = useState(() => Date.now())
  const alertCount = reports.filter((report) => report.status === 'alert').length

  return (
    <section className="page">
      <div className="home-grid">
        <div className="card hero-card sa-hero">
          <p className="sa-kicker">Monitoreo Comunitario de Servicios Básicos en Oriente</p>
          <h1>No mas cortes de agua o luz sin aviso</h1>
          <p>
            Reporta en 3 pasos sin registro y activa alertas comunitarias para San Miguel,
            Usulutan, Morazan y La Union.
          </p>
          <div className="row-inline cta-row">
            <AlertBadge count={alertCount} />
            <Link className="btn btn-primary" to="/report">
              Reportar falla (3 pasos)
            </Link>
            <Link className="btn btn-ghost" to="/map">
              Ver mapa de cortes
            </Link>
          </div>
        </div>

        <section className="card home-status">
          <div className="row-between">
            <h2>Estado Zona Oriental</h2>
            <small>
              Actualizado:{' '}
              {new Date(renderTimestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </small>
          </div>
          <div className="status-grid">
            <div className="status-cell status-ok">
              <span>Morazan</span>
            </div>
            <div className={`status-cell ${alertCount > 0 ? 'status-alert' : 'status-ok'}`}>
              <span>San Miguel</span>
            </div>
            <div className="status-cell status-ok">
              <span>Usulutan</span>
            </div>
            <div className={`status-cell ${alertCount > 1 ? 'status-alert' : 'status-ok'}`}>
              <span>La Union</span>
            </div>
          </div>
        </section>
      </div>

      <section className="card home-feed">
        <div className="row-between">
          <h2>Reportes Recientes</h2>
          <Link to="/feed" className="link-strong">
            Ver todos
          </Link>
        </div>
        <div className="reports-table">
          <div className="reports-head">
            <span>Servicio</span>
            <span>Ubicación</span>
            <span>Tiempo de falla</span>
          </div>
          {reports.slice(0, 3).map((report) => (
            <div className="reports-row" key={report.id}>
              <span>{report.service_type === 'energia' ? 'Electricidad' : 'Agua'}</span>
              <span>
                {report.municipality}, {report.department}
              </span>
              <span>
                {Math.max(
                  1,
                  Math.floor(
                    (renderTimestamp - new Date(report.created_at).getTime()) / (1000 * 60),
                  ),
                )}{' '}
                minutos
              </span>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default HomePage
