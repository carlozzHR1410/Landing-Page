import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReportCard from '../features/reports/ReportCard'
import { useStore } from '../store/useStore'

function ReportDetail() {
  const { id } = useParams()
  const selectedReport = useStore((state) => state.selectedReport)
  const reportsLoading = useStore((state) => state.reportsLoading)
  const loadReportById = useStore((state) => state.loadReportById)
  const confirmReport = useStore((state) => state.confirmReport)
  const neighborToken = useStore((state) => state.neighborToken)

  useEffect(() => {
    loadReportById(id)
  }, [id, loadReportById])

  if (reportsLoading) return <p>Cargando detalle...</p>
  if (!selectedReport) return <p>Reporte no encontrado.</p>

  return (
    <section className="page">
      <h1>Detalle del reporte</h1>
      <ReportCard
        report={selectedReport}
        onConfirm={(reportId) => confirmReport({ reportId, neighborToken })}
      />
    </section>
  )
}

export default ReportDetail
