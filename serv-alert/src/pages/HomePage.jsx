import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function createSeedReport(id, service, location, minutesAgo, reportType = 'issue') {
  return {
    id,
    service,
    location,
    name: 'Reporte comunitario',
    description: 'Reporte inicial de monitoreo comunitario.',
    reportType,
    createdAt: new Date(Date.now() - minutesAgo * 60 * 1000).toISOString(),
  }
}

const initialReports = [
  createSeedReport(1, 'Electricidad', 'Colonia Esmeralda, San Miguel', 20),
  createSeedReport(2, 'Electricidad', 'Colonia Esmeralda, San Miguel', 25),
  createSeedReport(3, 'Agua', 'Colonia Esmeralda, San Miguel', 10),
]

const blankForm = {
  reportId: '',
  service: 'Electricidad',
  location: '',
  name: '',
  description: '',
}

const modalCopy = {
  issue: {
    title: 'Nuevo Reporte de falla',
    descriptionLabel: 'Descripcion del problema',
    descriptionPlaceholder: 'Breve descripcion del problema',
    actionLabel: 'Reportar',
  },
  restore: {
    title: 'Reporte de reestablecido',
    descriptionLabel: 'Descripcion de la situacion',
    descriptionPlaceholder: 'Breve descripcion de la situacion',
    actionLabel: 'Reportar',
  },
}

function normalizeReport(report) {
  return {
    id: report.id,
    service: report.service,
    location: report.location,
    name: report.name || report.full_name || 'No disponible',
    description: report.description || 'Sin descripcion',
    reportType: report.reportType || report.report_type || 'issue',
    createdAt: report.createdAt || report.created_at || new Date().toISOString(),
  }
}

function formatElapsedTime(createdAt) {
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

function HomePage() {
  const [activeModal, setActiveModal] = useState(null)
  const [reportMode, setReportMode] = useState('issue')
  const [reports, setReports] = useState(initialReports)
  const [formData, setFormData] = useState(blankForm)
  const [notice, setNotice] = useState('')
  const [selectedReport, setSelectedReport] = useState(null)
  const issueReports = reports.filter((report) => report.reportType !== 'restore')

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch(`${API_URL}/reports`)

        if (!response.ok) {
          throw new Error('No se pudieron cargar los reportes')
        }

        const data = await response.json()

        if (Array.isArray(data.reports) && data.reports.length > 0) {
          setReports(data.reports.map(normalizeReport))
        }
      } catch (error) {
        setNotice('Mostrando reportes locales mientras conectas MySQL.')
      }
    }

    loadReports()
  }, [])

  const openModal = (mode) => {
    if (mode === 'restore' && issueReports.length === 0) {
      setNotice('Primero debe existir al menos un reporte activo para poder reestablecerlo.')
      return
    }

    const selectedIssue = mode === 'restore' ? issueReports[0] : null

    setReportMode(mode)
    setFormData({
      ...blankForm,
      reportId: selectedIssue ? String(selectedIssue.id) : '',
      service: selectedIssue?.service || 'Electricidad',
      location: selectedIssue?.location || '',
      description: mode === 'restore' ? 'Ya esta solucionado.' : '',
    })
    setActiveModal('form')
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedReport(null)
  }

  const openDetails = (report) => {
    setSelectedReport(report)
    setActiveModal('details')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'reportId') {
      const selectedIssue = issueReports.find((report) => String(report.id) === value)

      setFormData((current) => ({
        ...current,
        reportId: value,
        service: selectedIssue?.service || current.service,
        location: selectedIssue?.location || current.location,
        description: 'Ya esta solucionado.',
      }))
      return
    }

    if (reportMode === 'restore' && ['service', 'location', 'description'].includes(name)) {
      return
    }

    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setNotice('')

    const payload = {
      reportId: formData.reportId || null,
      reportType: reportMode,
      service: formData.service,
      location: formData.location.trim(),
      name: formData.name.trim(),
      description: formData.description.trim(),
    }

    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'No se pudo guardar el reporte')
      }

      const responseData = await response.json()

      setReports((current) => {
        if (reportMode === 'restore') {
          return current.filter((report) => String(report.id) !== formData.reportId)
        }

        const savedReport = normalizeReport(responseData.report)
        return [savedReport, ...current].slice(0, 8)
      })
      setActiveModal('success')
    } catch (error) {
      if (reportMode === 'restore') {
        setNotice('No se pudo borrar el reporte en MySQL. Intenta otra vez.')
        return
      }

      setReports((current) => {
        const localReport = normalizeReport({
          id: Date.now(),
          service: payload.service,
          location: payload.location,
          reportType: payload.reportType,
          createdAt: new Date().toISOString(),
        })

        return [localReport, ...current].slice(0, 8)
      })
      setNotice('No se guardo en MySQL. Revisa la conexion del backend y la clave de la base.')
      setActiveModal('success')
    }
  }

  const content = modalCopy[reportMode]

  return (
    <section className="page home-page">
      <div className="serv-alert-screen">
        {notice && <p className="serv-alert-notice">{notice}</p>}

        <div className="serv-alert-hero">
          <h1>
            Monitoreo Comunitario de
            <br />
            Servicios Basicos en Oriente
          </h1>

          <button
            type="button"
            className="btn btn-soft serv-alert-action"
            onClick={() => openModal('issue')}
          >
            + Reportar una falla
          </button>
        </div>

        <section className="serv-alert-section">
          <h2>Reportes Recientes</h2>

          <div className="serv-alert-table">
            <div className="serv-alert-row serv-alert-row-header">
              <span>Servicio</span>
              <span>Ubicacion</span>
              <span>Tiempo de falla</span>
            </div>

            {issueReports.map((report) => (
              <button
                type="button"
                className="serv-alert-row serv-alert-row-button"
                key={report.id}
                onClick={() => openDetails(report)}
              >
                <span data-label="Servicio">{report.service}</span>
                <span data-label="Ubicacion">{report.location}</span>
                <span data-label="Tiempo de falla">{formatElapsedTime(report.createdAt)}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="serv-alert-footer-action">
          <button
            type="button"
            className="btn btn-soft serv-alert-action"
            onClick={() => openModal('restore')}
          >
            + Reportar servicio reestablecido
          </button>
        </div>
      </div>

      {activeModal && (
        <div className="serv-alert-overlay" role="presentation">
          {activeModal === 'form' ? (
            <div className="serv-alert-modal">
              <h3>{content.title}</h3>

              <form className="serv-alert-form" onSubmit={handleSubmit}>
                {reportMode === 'restore' ? (
                  <>
                    <label>
                      <span>Reporte registrado</span>
                      <select name="reportId" value={formData.reportId} onChange={handleChange}>
                        {issueReports.map((report) => (
                          <option key={report.id} value={report.id}>
                            {report.service} - {report.location}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Tipo de servicio</span>
                      <input type="text" name="service" value={formData.service} readOnly />
                    </label>

                    <label>
                      <span>Ubicacion</span>
                      <input type="text" name="location" value={formData.location} readOnly />
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      <span>Tipo de servicio</span>
                      <select name="service" value={formData.service} onChange={handleChange}>
                        <option>Electricidad</option>
                        <option>Agua</option>
                      </select>
                    </label>

                    <label>
                      <span>Ubicacion</span>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Escribe la ubicacion exacta"
                        required
                      />
                    </label>
                  </>
                )}

                <label>
                  <span>Nombre</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    required
                  />
                </label>

                <label>
                  <span>{content.descriptionLabel}</span>
                  {reportMode === 'restore' ? (
                    <textarea name="description" value={formData.description} rows="5" readOnly />
                  ) : (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={content.descriptionPlaceholder}
                      rows="5"
                      required
                    />
                  )}
                </label>

                <div className="serv-alert-form-actions">
                  <button type="button" className="btn btn-danger" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    {content.actionLabel}
                  </button>
                </div>
              </form>
            </div>
          ) : activeModal === 'details' && selectedReport ? (
            <div className="serv-alert-modal serv-alert-modal-details">
              <h3>Detalle del reporte</h3>

              <div className="serv-alert-detail-list">
                <p>
                  <strong>Servicio:</strong> {selectedReport.service}
                </p>
                <p>
                  <strong>Ubicacion:</strong> {selectedReport.location}
                </p>
                <p>
                  <strong>Tiempo de falla:</strong> {formatElapsedTime(selectedReport.createdAt)}
                </p>
                <p>
                  <strong>Nombre:</strong> {selectedReport.name}
                </p>
                <p>
                  <strong>Descripcion:</strong> {selectedReport.description}
                </p>
              </div>

              <button type="button" className="btn btn-danger serv-alert-close" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          ) : (
            <div className="serv-alert-modal serv-alert-modal-success">
              <h3>Reporte realizado</h3>
              <div className="serv-alert-check" aria-hidden="true">
                &#10003;
              </div>
              <p>Su reporte ha sido realizado exitosamente.</p>
              <button type="button" className="btn btn-danger serv-alert-close" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default HomePage
