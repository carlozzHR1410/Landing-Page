import { useMemo, useState } from 'react'

const initialReports = [
  {
    id: 1,
    service: 'Electricidad',
    location: 'Colonia Esmeralda, San Miguel',
    time: '20 minutos',
  },
  {
    id: 2,
    service: 'Electricidad',
    location: 'Colonia Esmeralda, San Miguel',
    time: '25 minutos',
  },
  {
    id: 3,
    service: 'Agua',
    location: 'Colonia Esmeralda, San Miguel',
    time: '10 minutos',
  },
]

const blankForm = {
  service: 'Electricidad',
  location: 'San Miguel Centro, San Miguel',
  name: '',
  email: '',
  dui: '',
  description: '',
}

function HomePage() {
  const [activeModal, setActiveModal] = useState(null)
  const [reportMode, setReportMode] = useState('issue')
  const [reports, setReports] = useState(initialReports)
  const [formData, setFormData] = useState(blankForm)

  const modalCopy = useMemo(
    () => ({
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
    }),
    [],
  )

  const openModal = (mode) => {
    setReportMode(mode)
    setFormData(blankForm)
    setActiveModal('form')
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (reportMode === 'issue') {
      setReports((current) => [
        {
          id: Date.now(),
          service: formData.service,
          location: formData.location,
          time: 'Hace un momento',
        },
        ...current.slice(0, 2),
      ])
    }

    setActiveModal('success')
  }

  const content = modalCopy[reportMode]

  return (
    <section className="page home-page">
      <div className="serv-alert-screen">
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

            {reports.map((report) => (
              <div className="serv-alert-row" key={report.id}>
                <span data-label="Servicio">{report.service}</span>
                <span data-label="Ubicacion">{report.location}</span>
                <span data-label="Tiempo de falla">{report.time}</span>
              </div>
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
                <label>
                  <span>Tipo de servicio</span>
                  <select name="service" value={formData.service} onChange={handleChange}>
                    <option>Electricidad</option>
                    <option>Agua</option>
                    <option>Internet</option>
                  </select>
                </label>

                <label>
                  <span>Ubicacion</span>
                  <select name="location" value={formData.location} onChange={handleChange}>
                    <option>San Miguel Centro, San Miguel</option>
                    <option>Colonia Esmeralda, San Miguel</option>
                    <option>Ciudad Pacifica, San Miguel</option>
                  </select>
                </label>

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
                  <span>Correo</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </label>

                <label>
                  <span>DUI</span>
                  <input
                    type="text"
                    name="dui"
                    value={formData.dui}
                    onChange={handleChange}
                    placeholder="00000000-0"
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
                    rows="5"
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
