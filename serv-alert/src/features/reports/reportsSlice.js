import {
  confirmReportById,
  createReport,
  getReportById,
  getReports,
} from '../../services/reportsService'

export const createReportsSlice = (set, get) => ({
  reports: [],
  selectedReport: null,
  reportsLoading: false,
  reportsError: null,
  submitStatus: 'idle',
  loadReports: async () => {
    set({ reportsLoading: true, reportsError: null })
    try {
      const data = await getReports()
      set({ reports: data, reportsLoading: false })
    } catch {
      set({
        reportsLoading: false,
        reportsError: 'No se pudo cargar el feed de reportes.',
      })
    }
  },
  loadReportById: async (id) => {
    set({ reportsLoading: true, reportsError: null })
    try {
      const data = await getReportById(id)
      set({ selectedReport: data, reportsLoading: false })
    } catch {
      set({
        reportsLoading: false,
        reportsError: 'No se pudo abrir el detalle del reporte.',
      })
    }
  },
  submitReport: async (payload) => {
    set({ submitStatus: 'loading', reportsError: null })
    try {
      const created = await createReport(payload)
      set((state) => ({
        reports: [created, ...state.reports],
        submitStatus: 'success',
      }))
      return { ok: true, report: created }
    } catch {
      set({
        submitStatus: 'error',
        reportsError: 'No se pudo enviar el reporte en este momento.',
      })
      return { ok: false }
    }
  },
  confirmReport: async ({ reportId, neighborToken }) => {
    get().markConfirmation(neighborToken, reportId)
    const updated = await confirmReportById({ report_id: reportId, neighbor_token: neighborToken })
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === reportId ? { ...report, ...updated } : report,
      ),
      selectedReport:
        state.selectedReport?.id === reportId
          ? { ...state.selectedReport, ...updated }
          : state.selectedReport,
    }))
  },
})
