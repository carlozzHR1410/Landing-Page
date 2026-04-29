import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useReports } from '../context/ReportsContext'
import { easternDepartments, getDistrictsByDepartment } from '../data/easternLocations'
import {
  formatElapsedTime,
  isActiveIssue,
  isIssueReport,
  sortReportsByCreatedDesc,
  supportedServices,
} from '../utils/reportUtils'

const defaultDepartment = easternDepartments[0]
const defaultDistrict = getDistrictsByDepartment(defaultDepartment)[0]

const modalCopy = {
  issue: {
    title: 'Nuevo reporte de falla',
    descriptionLabel: 'Descripcion del problema',
    descriptionPlaceholder: 'Explica brevemente lo que ocurre en la zona.',
    actionLabel: 'Registrar falla',
  },
  restore: {
    title: 'Registrar restablecimiento',
    descriptionLabel: 'Descripcion del restablecimiento',
    descriptionPlaceholder: 'Explica como se normalizo el servicio.',
    actionLabel: 'Registrar restablecimiento',
  },
}

function getBlankForm() {
  return {
    reportId: '',
    service: supportedServices[0],
    department: defaultDepartment,
    district: defaultDistrict,
    name: '',
    description: '',
  }
}

function getRestoreForm(issue) {
  return {
    reportId: issue ? String(issue.id) : '',
    service: issue?.service || supportedServices[0],
    department: issue?.department || defaultDepartment,
    district: issue?.district || defaultDistrict,
    name: '',
    description: 'Servicio restablecido y funcionando nuevamente.',
  }
}

function HomePage() {
  const { reports, notice, setNotice, createIssueReport, createRestoreReport } = useReports()
  const [activeModal, setActiveModal] = useState(null)
  const [reportMode, setReportMode] = useState('issue')
  const [formData, setFormData] = useState(getBlankForm)
  const [selectedReport, setSelectedReport] = useState(null)

  const activeIssues = sortReportsByCreatedDesc(reports.filter(isActiveIssue))
  const latestIssues = sortReportsByCreatedDesc(reports.filter(isIssueReport)).slice(0, 3)

  const openModal = (mode) => {
    if (mode === 'restore' && activeIssues.length === 0) {
      setNotice('Primero debe existir al menos un reporte pendiente para marcarlo como restablecido.')
      return
    }

    const selectedIssue = mode === 'restore' ? activeIssues[0] : null
    setReportMode(mode)
    setFormData(mode === 'restore' ? getRestoreForm(selectedIssue) : getBlankForm())
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

    if (name === 'department') {
      const nextDistrict = getDistrictsByDepartment(value)[0] || ''
      setFormData((current) => ({
        ...current,
        department: value,
        district: nextDistrict,
      }))
      return
    }

    if (name === 'reportId') {
      const selectedIssue = activeIssues.find((report) => String(report.id) === value)

      setFormData((current) => ({
        ...current,
        reportId: value,
        service: selectedIssue?.service || current.service,
        department: selectedIssue?.department || current.department,
        district: selectedIssue?.district || current.district,
      }))
      return
    }

    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setNotice('')

    const payload =
      reportMode === 'issue'
        ? {
            service: formData.service,
            department: formData.department,
            district: formData.district,
            name: formData.name.trim(),
            description: formData.description.trim(),
          }
        : {
            reportId: Number(formData.reportId),
            name: formData.name.trim(),
            description: formData.description.trim(),
          }

    const result =
      reportMode === 'issue'
        ? await createIssueReport(payload)
        : await createRestoreReport(payload)

    if (!result.ok) {
      setNotice(result.message || 'No se pudo completar la operacion.')
      return
    }

    setActiveModal('success')
  }

  const content = modalCopy[reportMode]
  const districtOptions = getDistrictsByDepartment(formData.department)

  return (
    <section className="page home-page">
      <div className="serv-alert-screen">
        {notice && <p className="serv-alert-notice">{notice}</p>}

        <div className="serv-alert-hero">
          <h1>
            Monitoreo comunitario de
            <br />
            servicios basicos en Oriente
          </h1>
          <p className="serv-alert-hero-copy">
            Registra fallas por departamento y distrito, consulta el historial completo y sigue los
            restablecimientos desde un mismo panel.
          </p>

          <div className="serv-alert-hero-actions">
            <button
              type="button"
              className="btn btn-soft serv-alert-action"
              onClick={() => openModal('issue')}
            >
              + Reportar una falla
            </button>

            <button
              type="button"
              className="btn btn-secondary serv-alert-action"
              onClick={() => openModal('restore')}
            >
              + Reportar restablecimiento
            </button>
          </div>
        </div>

        <section className="serv-alert-section">
          <div className="serv-alert-section-head">
            <div>
              <h2>Reportes recientes</h2>
              <p>En la portada se muestran solo los tres mas recientes.</p>
            </div>
            <Link className="btn btn-soft serv-alert-link-btn" to="/reportes">
              Ver mas
            </Link>
          </div>

          <div className="serv-alert-table">
            <div className="serv-alert-row serv-alert-row-header">
              <span>Servicio</span>
              <span>Ubicacion</span>
              <span>Tiempo de falla</span>
            </div>

            {latestIssues.length === 0 ? (
              <div className="serv-alert-empty">
                <p>No hay reportes disponibles por ahora.</p>
              </div>
            ) : (
              latestIssues.map((report) => (
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
              ))
            )}
          </div>
        </section>
      </div>

      {activeModal && (
        <div className="serv-alert-overlay" role="presentation">
          {activeModal === 'form' ? (
            <div className={`serv-alert-modal ${reportMode === 'restore' ? 'serv-alert-modal-compact' : ''}`}>
              <h3>{content.title}</h3>

              <form className="serv-alert-form" onSubmit={handleSubmit}>
                {reportMode === 'restore' ? (
                  <>
                    <label>
                      <span>Reporte registrado</span>
                      <select name="reportId" value={formData.reportId} onChange={handleChange}>
                        {activeIssues.map((report) => (
                          <option key={report.id} value={report.id}>
                            {report.service} - {report.location}
                          </option>
                        ))}
                      </select>
                    </label>

                    <p className="serv-alert-selected-report">
                      {formData.service} - {formData.district}, {formData.department}
                    </p>
                  </>
                ) : (
                  <>
                    <label>
                      <span>Tipo de servicio</span>
                      <select name="service" value={formData.service} onChange={handleChange}>
                        {supportedServices.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Departamento</span>
                      <select name="department" value={formData.department} onChange={handleChange}>
                        {easternDepartments.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span>Distrito</span>
                      <select name="district" value={formData.district} onChange={handleChange}>
                        {districtOptions.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
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
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={content.descriptionPlaceholder}
                    rows={reportMode === 'restore' ? 4 : 5}
                    required
                  />
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
                  <strong>Departamento:</strong> {selectedReport.department}
                </p>
                <p>
                  <strong>Distrito:</strong> {selectedReport.district}
                </p>
                <p>
                  <strong>Ubicacion:</strong> {selectedReport.location}
                </p>
                <p>
                  <strong>Tiempo transcurrido:</strong> {formatElapsedTime(selectedReport.createdAt)}
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
              <h3>Reporte registrado</h3>
              <div className="serv-alert-check" aria-hidden="true">
                &#10003;
              </div>
              <p>La informacion quedo actualizada correctamente.</p>
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
