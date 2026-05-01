import { useState } from 'react'
import { easternDepartments, getDistrictsByDepartment } from '../data/easternLocations'
import { useReports } from '../context/ReportsContext'
import {
  formatElapsedTime,
  isActiveIssue,
  isIssueReport,
  isRestoreReport,
  supportedServices,
} from '../utils/reportUtils'

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'issues', label: 'Reportados' },
  { id: 'restores', label: 'Restablecidos' },
]

const modalCopy = {
  issue: {
    title: 'Nuevo reporte de falla',
    descriptionLabel: 'Descripcion del problema',
    descriptionPlaceholder: 'Explica brevemente lo que ocurre en la zona.',
    actionLabel: 'Registrar falla',
    successMessage: 'El reporte se registro correctamente.',
  },
  restore: {
    title: 'Registrar restablecimiento',
    descriptionLabel: 'Descripcion del restablecimiento',
    descriptionPlaceholder: 'Explica como se normalizo el servicio.',
    actionLabel: 'Registrar restablecimiento',
    successMessage: 'El restablecimiento se registro correctamente.',
  },
}

const defaultDepartment = easternDepartments[0]
const defaultDistrict = getDistrictsByDepartment(defaultDepartment)[0]

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

function ReportsPage() {
  const { reports, notice, setNotice, createIssueReport, createRestoreReport } = useReports()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [activeModal, setActiveModal] = useState(null)
  const [reportMode, setReportMode] = useState('issue')
  const [formData, setFormData] = useState(getBlankForm)

  const departmentOptions = [...new Set(reports.map((report) => report.department).filter(Boolean))].sort(
    (left, right) => left.localeCompare(right, 'es'),
  )

  const activeIssues = reports.filter(isActiveIssue)

  const districtOptions = [
    ...new Set(
      reports
        .filter((report) => selectedDepartment === 'all' || report.department === selectedDepartment)
        .map((report) => report.district)
        .filter(Boolean),
    ),
  ].sort((left, right) => left.localeCompare(right, 'es'))

  const filteredReports = reports.filter((report) => {
    if (activeFilter === 'issues') {
      if (!isIssueReport(report)) {
        return false
      }
    }

    if (activeFilter === 'restores') {
      if (!isRestoreReport(report)) {
        return false
      }
    }

    if (selectedDepartment !== 'all' && report.department !== selectedDepartment) {
      return false
    }

    if (selectedDistrict !== 'all' && report.district !== selectedDistrict) {
      return false
    }

    return true
  })

  const totalIssues = reports.filter(isIssueReport).length
  const totalRestores = reports.filter(isRestoreReport).length
  const content = modalCopy[reportMode]
  const formDistrictOptions = getDistrictsByDepartment(formData.department)

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

  return (
    <section className="page reports-page">
      <div className="page-head">
        <h1>Todos los reportes</h1>
        <p>
          Consulta fallas reportadas y servicios restablecidos en la zona oriental. Usa los botones
          de arriba para crear un nuevo reporte o registrar un restablecimiento.
        </p>
        <div className="action-row">
          <button type="button" className="btn btn-soft" onClick={() => openModal('issue')}>
            Nuevo reporte
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => openModal('restore')}>
            Registrar restablecimiento
          </button>
        </div>
      </div>

      {notice && <p className="serv-alert-notice report-notice">{notice}</p>}

      <div className="summary-grid reports-summary-grid reports-summary-grid-compact">
        <article className="summary-card">
          <strong>{reports.length}</strong>
          <span>Movimientos registrados</span>
        </article>
        <article className="summary-card">
          <strong>{totalIssues}</strong>
          <span>Fallas reportadas</span>
        </article>
        <article className="summary-card">
          <strong>{totalRestores}</strong>
          <span>Restablecimientos</span>
        </article>
      </div>

      <div className="report-filter-row" role="tablist" aria-label="Filtros de reportes">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`filter-pill ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="report-select-row">
        <label className="report-select-field">
          <span>Departamento</span>
          <select
            value={selectedDepartment}
            onChange={(event) => {
              setSelectedDepartment(event.target.value)
              setSelectedDistrict('all')
            }}
          >
            <option value="all">Todos</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>

        <label className="report-select-field">
          <span>Distrito</span>
          <select
            value={selectedDistrict}
            onChange={(event) => setSelectedDistrict(event.target.value)}
          >
            <option value="all">Todos</option>
            {districtOptions.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="reports-feed">
        {filteredReports.length === 0 ? (
          <div className="empty-state">
            <p>No hay reportes para este filtro.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <article className="report-card" key={`${report.reportType}-${report.id}`}>
              <div className="report-card-head">
                <div>
                  <h2>{report.service}</h2>
                  <p>
                    {report.district}, {report.department}
                  </p>
                </div>
                <div className="report-badge-group">
                  <span className={`report-kind report-kind-${report.reportType}`}>
                    {report.reportType === 'issue' ? 'Reportado' : 'Restablecido'}
                  </span>
                </div>
              </div>

              <p className="report-description">{report.description}</p>

              <div className="report-meta-grid">
                <p>
                  <strong>Persona:</strong> {report.name}
                </p>
                <p>
                  <strong>Ubicacion:</strong> {report.location}
                </p>
                <p>
                  <strong>Tiempo:</strong> {formatElapsedTime(report.createdAt)}
                </p>
                <p>
                  <strong>Fecha:</strong> {new Date(report.createdAt).toLocaleString('es-SV')}
                </p>
              </div>
            </article>
          ))
        )}
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
                        {formDistrictOptions.map((district) => (
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
          ) : (
            <div className="serv-alert-modal serv-alert-modal-success">
              <h3>Operacion completada</h3>
              <div className="serv-alert-check" aria-hidden="true">
                &#10003;
              </div>
              <p>{content.successMessage}</p>
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

export default ReportsPage
