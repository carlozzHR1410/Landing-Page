import api from './api'

const now = new Date()

const mockReports = [
  {
    id: crypto.randomUUID(),
    service_type: 'energia',
    status: 'pending',
    department: 'San Miguel',
    municipality: 'San Jorge',
    tag: 'Sin energia total',
    description: 'Apagon desde las 4:30 p.m. en colonia Las Flores.',
    confirmations_count: 3,
    created_at: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    service_type: 'agua',
    status: 'alert',
    department: 'Usulutan',
    municipality: 'Jiquilisco',
    tag: 'Sin suministro',
    description: 'No hay agua en el sector desde esta manana.',
    confirmations_count: 5,
    created_at: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
  },
]

let reportsDb = [...mockReports]

const shouldUseMock = true

const simulateDelay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 250))

export const getReports = async () => {
  if (!shouldUseMock) {
    const { data } = await api.get('/reports')
    return data
  }

  return simulateDelay([...reportsDb])
}

export const getReportById = async (id) => {
  if (!shouldUseMock) {
    const { data } = await api.get(`/reports/${id}`)
    return data
  }

  const report = reportsDb.find((item) => item.id === id) || null
  return simulateDelay(report)
}

export const createReport = async (payload) => {
  if (!shouldUseMock) {
    const { data } = await api.post('/reports', payload)
    return data
  }

  const newReport = {
    id: crypto.randomUUID(),
    service_type: payload.service_type,
    status: 'pending',
    department: payload.department,
    municipality: payload.municipality,
    tag: payload.tag || 'Reporte ciudadano',
    description: payload.description,
    confirmations_count: 1,
    created_at: new Date().toISOString(),
  }

  reportsDb = [newReport, ...reportsDb]
  return simulateDelay(newReport)
}

export const confirmReportById = async ({ report_id }) => {
  if (!shouldUseMock) {
    const { data } = await api.post(`/reports/${report_id}/confirm`)
    return data
  }

  reportsDb = reportsDb.map((report) => {
    if (report.id !== report_id) return report
    const nextCount = Math.min(report.confirmations_count + 1, 5)
    return {
      ...report,
      confirmations_count: nextCount,
      status: nextCount >= 5 ? 'alert' : report.status,
    }
  })

  const updated = reportsDb.find((report) => report.id === report_id)
  return simulateDelay(updated)
}
