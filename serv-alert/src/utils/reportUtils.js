export const supportedServices = ['Electricidad', 'Agua Potable']

export function buildLocationLabel(department, district) {
  return [district, department].filter(Boolean).join(', ')
}

export function normalizeReport(report) {
  const department = report.department || report.report_department || ''
  const district = report.district || report.report_district || ''
  const reportType = report.reportType || report.report_type || 'issue'

  return {
    id: Number(report.id),
    reportType,
    status:
      report.status ||
      report.report_status ||
      (reportType === 'restore' ? 'restored' : 'active'),
    relatedReportId:
      report.relatedReportId === null || report.relatedReportId === undefined
        ? report.related_report_id === null || report.related_report_id === undefined
          ? null
          : Number(report.related_report_id)
        : Number(report.relatedReportId),
    service: report.service || 'Servicio',
    department,
    district,
    location: report.location || buildLocationLabel(department, district),
    name: report.name || report.full_name || 'No disponible',
    description: report.description || 'Sin descripcion',
    createdAt: report.createdAt || report.created_at || new Date().toISOString(),
  }
}

export function sortReportsByCreatedDesc(reports) {
  return [...reports].sort((left, right) =>
    `${right.createdAt}-${right.id}`.localeCompare(`${left.createdAt}-${left.id}`),
  )
}

export function formatElapsedTime(createdAt) {
  const timestamp = new Date(createdAt).getTime()

  if (Number.isNaN(timestamp)) {
    return 'Hace un momento'
  }

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000))

  if (minutes < 1) {
    return 'Hace un momento'
  }

  if (minutes < 60) {
    return `${minutes} minuto${minutes === 1 ? '' : 's'}`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hora${hours === 1 ? '' : 's'}`
  }

  const days = Math.floor(hours / 24)
  return `${days} dia${days === 1 ? '' : 's'}`
}

export function isActiveIssue(report) {
  return report.reportType === 'issue' && report.status === 'active'
}

export function isSupportedService(report) {
  return supportedServices.includes(report.service)
}

export function isIssueReport(report) {
  return report.reportType === 'issue'
}

export function isRestoreReport(report) {
  return report.reportType === 'restore'
}

export function applyRestoreToReports(reports, restoreReport) {
  return sortReportsByCreatedDesc(
    reports
      .map((report) =>
        report.id === restoreReport.relatedReportId && report.reportType === 'issue'
          ? { ...report, status: 'restored' }
          : report,
      )
      .concat(restoreReport),
  )
}
