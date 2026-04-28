import Badge from '../../components/Badge'

function AlertBadge({ count }) {
  if (!count) return <Badge>Sin alertas activas</Badge>
  return <Badge tone="danger">Alertas activas: {count}</Badge>
}

export default AlertBadge
