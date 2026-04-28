import { useStore } from '../store/useStore'

function AlertBanner() {
  const reports = useStore((state) => state.reports)
  const activeAlerts = reports.filter((report) => report.status === 'alert').length

  if (!activeAlerts) {
    return null
  }

  return (
    <aside className="alert-banner" role="status">
      {activeAlerts} alerta{activeAlerts > 1 ? 's' : ''} activa
      {activeAlerts > 1 ? 's' : ''} en la zona oriental.
    </aside>
  )
}

export default AlertBanner
