import { useEffect } from 'react'
import { useStore } from '../../store/useStore'

export const useReports = () => {
  const reports = useStore((state) => state.reports)
  const reportsLoading = useStore((state) => state.reportsLoading)
  const reportsError = useStore((state) => state.reportsError)
  const submitStatus = useStore((state) => state.submitStatus)
  const loadReports = useStore((state) => state.loadReports)
  const submitReport = useStore((state) => state.submitReport)
  const confirmReport = useStore((state) => state.confirmReport)
  const hasConfirmed = useStore((state) => state.hasConfirmed)
  const persistConfirmedReport = useStore((state) => state.persistConfirmedReport)
  const neighborToken = useStore((state) => state.neighborToken)

  useEffect(() => {
    if (reports.length === 0) {
      loadReports()
    }
  }, [loadReports, reports.length])

  const confirmWithToken = async (reportId) => {
    if (hasConfirmed(neighborToken, reportId)) return
    await confirmReport({ reportId, neighborToken })
    persistConfirmedReport(neighborToken, reportId)
  }

  return {
    reports,
    reportsLoading,
    reportsError,
    submitStatus,
    submitReport,
    confirmReport: confirmWithToken,
    hasConfirmed: (reportId) => hasConfirmed(neighborToken, reportId),
  }
}
