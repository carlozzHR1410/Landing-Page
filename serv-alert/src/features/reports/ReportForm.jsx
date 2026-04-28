import { useState } from 'react'
import Button from '../../components/Button'

const departments = ['San Miguel', 'Usulután', 'Morazán', 'La Unión']

const initialForm = {
  service_type: '',
  department: '',
  municipality: '',
  tag: '',
  description: '',
}

function ReportForm({ onSubmit, isLoading }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const next = () => setStep((prev) => Math.min(prev + 1, 3))
  const prev = () => setStep((prev) => Math.max(prev - 1, 1))

  const canContinue =
    (step === 1 && form.service_type) ||
    (step === 2 && form.department && form.municipality.trim()) ||
    (step === 3 && form.description.trim().length >= 15)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canContinue || isLoading) return
    const result = await onSubmit(form)
    if (result?.ok) {
      setForm(initialForm)
      setStep(1)
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <p className="step-indicator">Paso {step} de 3</p>

      {step === 1 && (
        <div className="field-group">
          <label>Tipo de servicio</label>
          <div className="grid-two">
            <button
              className={`picker ${form.service_type === 'energia' ? 'active' : ''}`}
              type="button"
              onClick={() => update('service_type', 'energia')}
            >
              Energia
            </button>
            <button
              className={`picker ${form.service_type === 'agua' ? 'active' : ''}`}
              type="button"
              onClick={() => update('service_type', 'agua')}
            >
              Agua
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="field-group">
          <label>Departamento</label>
          <select value={form.department} onChange={(e) => update('department', e.target.value)}>
            <option value="">Selecciona departamento</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <label>Municipio</label>
          <input
            value={form.municipality}
            onChange={(e) => update('municipality', e.target.value)}
            placeholder="Ej. San Jorge"
          />
        </div>
      )}

      {step === 3 && (
        <div className="field-group">
          <label>Etiqueta corta</label>
          <input value={form.tag} onChange={(e) => update('tag', e.target.value)} />
          <label>Descripcion</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={4}
            placeholder="Describe rapidamente que esta pasando en tu zona."
          />
        </div>
      )}

      <div className="row-actions">
        <Button type="button" variant="ghost" onClick={prev} disabled={step === 1}>
          Volver
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={next} disabled={!canContinue}>
            Siguiente
          </Button>
        ) : (
          <Button type="submit" disabled={!canContinue || isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar reporte'}
          </Button>
        )}
      </div>
    </form>
  )
}

export default ReportForm
