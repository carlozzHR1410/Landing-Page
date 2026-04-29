/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import demoReports from '../data/demoReports'
import {
  applyRestoreToReports,
  buildLocationLabel,
  isSupportedService,
  normalizeReport,
  sortReportsByCreatedDesc,
  supportedServices,
} from '../utils/reportUtils'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const ReportsContext = createContext(null)

function buildLocalIssueReport(payload) {
  return normalizeReport({
    id: Date.now(),
    reportType: 'issue',
    status: 'active',
    relatedReportId: null,
    service: payload.service,
    department: payload.department,
    district: payload.district,
    location: buildLocationLabel(payload.department, payload.district),
    name: payload.name,
    description: payload.description,
    createdAt: new Date().toISOString(),
  })
}

function buildLocalRestoreReport(payload, issue) {
  return normalizeReport({
    id: Date.now(),
    reportType: 'restore',
    status: 'restored',
    relatedReportId: Number(payload.reportId),
    service: issue.service,
    department: issue.department,
    district: issue.district,
    location: issue.location,
    name: payload.name,
    description: payload.description,
    createdAt: new Date().toISOString(),
  })
}

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(
    sortReportsByCreatedDesc(demoReports.filter(isSupportedService)),
  )
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadReports = async () => {
      try {
        const response = await fetch(`${API_URL}/reports`)

        if (!response.ok) {
          throw new Error('No se pudieron cargar los reportes.')
        }

        const data = await response.json()

        if (cancelled) {
          return
        }

        if (Array.isArray(data.reports) && data.reports.length > 0) {
          setReports(
            sortReportsByCreatedDesc(data.reports.map(normalizeReport).filter(isSupportedService)),
          )
          setNotice('')
          return
        }

        setNotice('La base aun no tiene reportes. Se muestran datos de ejemplo.')
      } catch {
        if (!cancelled) {
          setNotice('Mostrando reportes locales mientras conectas MySQL.')
        }
      }
    }

    loadReports()
    const syncTimer = window.setInterval(loadReports, 15000)

    return () => {
      cancelled = true
      window.clearInterval(syncTimer)
    }
  }, [])

  const createIssueReport = async (payload) => {
    if (!supportedServices.includes(payload.service)) {
      return { ok: false, message: 'Solo se permiten reportes de agua potable y electricidad.' }
    }

    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: 'issue',
          service: payload.service,
          department: payload.department,
          district: payload.district,
          name: payload.name,
          description: payload.description,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar el reporte.')
      }

      const savedReport = normalizeReport(data.report)
      setReports((current) => sortReportsByCreatedDesc([savedReport, ...current]))
      setNotice('')
      return { ok: true, report: savedReport }
    } catch (error) {
      const localReport = buildLocalIssueReport(payload)
      setReports((current) => sortReportsByCreatedDesc([localReport, ...current]))
      setNotice('No se guardo en MySQL. Se agrego localmente para no detener el flujo.')
      return { ok: true, report: localReport, fallback: true, message: error.message }
    }
  }

  const createRestoreReport = async (payload) => {
    const issue = reports.find(
      (report) => report.id === Number(payload.reportId) && report.reportType === 'issue',
    )

    if (!issue) {
      return { ok: false, message: 'El reporte seleccionado ya no esta disponible.' }
    }

    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: Number(payload.reportId),
          reportType: 'restore',
          name: payload.name,
          description: payload.description,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar el restablecimiento.')
      }

      const savedRestore = normalizeReport(data.report)
      setReports((current) => applyRestoreToReports(current, savedRestore))
      setNotice('')
      return { ok: true, report: savedRestore }
    } catch (error) {
      const localRestore = buildLocalRestoreReport(payload, issue)
      setReports((current) => applyRestoreToReports(current, localRestore))
      setNotice('No se guardo en MySQL. El restablecimiento se reflejo localmente.')
      return { ok: true, report: localRestore, fallback: true, message: error.message }
    }
  }

  return (
    <ReportsContext.Provider
      value={{
        reports,
        notice,
        setNotice,
        createIssueReport,
        createRestoreReport,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export function useReports() {
  const context = useContext(ReportsContext)

  if (!context) {
    throw new Error('useReports debe usarse dentro de ReportsProvider')
  }

  return context
}
