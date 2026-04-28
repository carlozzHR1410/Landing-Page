import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { getTodayKey } from '../utils/date'
import Button from './Button'

const makeInitialState = (initialValues) => ({
  serviceId: initialValues?.serviceId || '',
  branchId: initialValues?.branchId || '',
  date: initialValues?.date || getTodayKey(),
  time: initialValues?.time || '',
  notes: initialValues?.notes || '',
  status: initialValues?.status || 'pendiente',
})

function AppointmentForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar cita',
  editingId = null,
  allowStatus = false,
}) {
  const services = useStore((state) => state.services)
  const branches = useStore((state) => state.branches)
  const timeSlots = useStore((state) => state.timeSlots)
  const appointments = useStore((state) => state.appointments)

  const [form, setForm] = useState(makeInitialState(initialValues))
  const [message, setMessage] = useState('')

  useEffect(() => {
    setForm(makeInitialState(initialValues))
    setMessage('')
  }, [initialValues])

  const blockedSlots = appointments
    .filter(
      (appointment) =>
        appointment.date === form.date &&
        appointment.status !== 'cancelada' &&
        appointment.id !== editingId,
    )
    .map((appointment) => appointment.time)

  const handleChange = (field, value) => {
    setForm((state) => ({ ...state, [field]: value }))
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await onSubmit(form)
    setMessage(result.message)
  }

  return (
    <form className="sheet form-sheet" onSubmit={handleSubmit}>
      <div className="field-stack">
        <label>
          Tipo de servicio
          <select
            value={form.serviceId}
            onChange={(event) => handleChange('serviceId', event.target.value)}
          >
            <option value="">Selecciona un servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sucursal
          <select value={form.branchId} onChange={(event) => handleChange('branchId', event.target.value)}>
            <option value="">Selecciona una sucursal</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>

        <div className="field-row">
          <label>
            Fecha
            <input
              type="date"
              value={form.date}
              min={getTodayKey()}
              onChange={(event) => handleChange('date', event.target.value)}
            />
          </label>

          <label>
            Hora
            <select value={form.time} onChange={(event) => handleChange('time', event.target.value)}>
              <option value="">Selecciona una hora</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} disabled={blockedSlots.includes(slot)}>
                  {blockedSlots.includes(slot) ? `${slot} (ocupado)` : slot}
                </option>
              ))}
            </select>
          </label>
        </div>

        {allowStatus && (
          <label>
            Estado
            <select value={form.status} onChange={(event) => handleChange('status', event.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </label>
        )}

        <label>
          Notas
          <textarea
            rows={5}
            value={form.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            placeholder="Comentarios, sintomas o detalles del servicio"
          />
        </label>
      </div>

      {message && <p className="inline-message">{message}</p>}

      <div className="sheet-actions">
        {onCancel && (
          <Button type="button" variant="danger" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="success">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default AppointmentForm
