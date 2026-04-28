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
    <article className="card report-card">
      <div className="row-between">
        <div className="row-inline">
          <ServiceIcon type={report.service_type} />
          <strong>{report.tag}</strong>
        </div>
        <Badge tone={statusTone[report.status]}>{report.status}</Badge>
      </div>
      <p>{report.description}</p>
      <small>
        {report.department} · {report.municipality}
      </small>
      <ProgressBar value={report.confirmations_count} />
      <Button
        variant="secondary"
        disabled={atLimit || disabledConfirm}
        onClick={() => onConfirm(report.id)}
      >
        {atLimit ? 'Alerta activada' : disabledConfirm ? 'Ya confirmaste' : 'Confirmar reporte'}
      </Button>
    </article>
  )
}

export default ReportCard
