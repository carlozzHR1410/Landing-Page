import ReportForm from '../features/reports/ReportForm'
import { useReports } from '../features/reports/useReports'

function ReportPage() {
  const { submitReport, submitStatus } = useReports()

  return (
    <section className="page">
      <h1>Nuevo reporte ciudadano</h1>
      <ReportForm onSubmit={submitReport} isLoading={submitStatus === 'loading'} />
      {submitStatus === 'success' && <p className="success-msg">Reporte enviado correctamente.</p>}
      {submitStatus === 'error' && (
        <p className="error-msg">No fue posible enviar tu reporte. Intenta nuevamente.</p>
      )}
    </section>
  )
}

export default ReportPage
