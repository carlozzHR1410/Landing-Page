import Badge from '../../components/Badge'
import Button from '../../components/Button'
import ProgressBar from '../../components/ProgressBar'
import ServiceIcon from '../../components/ServiceIcon'

const statusTone = {
  pending: 'warning',
  alert: 'danger',
  resolved: 'success',
}

function ReportCard({ report, onConfirm, disabledConfirm }) {
  const atLimit = report.confirmations_count >= 5

  return (
    <article className={`card report-card report-${report.status}`}>
      <div className="row-between">
        <div className="row-inline">
          <ServiceIcon type={report.service_type} />
          <div className="report-main">
            <strong>{report.tag}</strong>
            <small>
              {report.municipality}, {report.department}
            </small>
          </div>
        </div>
        <Badge tone={statusTone[report.status]}>{report.status}</Badge>
      </div>
      <p>{report.description}</p>
      <ProgressBar value={report.confirmations_count} />
      <div className="row-actions report-actions">
        <Button
          variant="secondary"
          disabled={atLimit || disabledConfirm}
          onClick={() => onConfirm(report.id)}
        >
          {atLimit ? 'Alerta activada' : disabledConfirm ? 'Ya confirmaste' : 'Confirmar (+1)'}
        </Button>
        <Button variant="ghost">Compartir</Button>
      </div>
    </article>
  )
}

export default ReportCard
