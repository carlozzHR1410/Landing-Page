import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppointmentForm from '../components/AppointmentForm'
import { useStore } from '../store/useStore'
import { formatDateTime, sortAppointments } from '../utils/date'

function DashboardPage() {
  const appointments = useStore((state) => state.appointments)
  const services = useStore((state) => state.services)
  const branches = useStore((state) => state.branches)
  const currentUserId = useStore((state) => state.currentUserId)
  const users = useStore((state) => state.users)
  const updateAppointment = useStore((state) => state.updateAppointment)
  const cancelAppointment = useStore((state) => state.cancelAppointment)

  const [editingId, setEditingId] = useState(null)

  const currentUser = users.find((user) => user.id === currentUserId) || null

  if (!currentUser) {
    return (
      <section className="page">
        <div className="empty-state">
          <h1>Necesitas una sesion activa</h1>
          <p>Accede con tu cuenta para ver tus citas o gestionar el panel administrativo.</p>
          <Link className="btn btn-soft" to="/acceso">
            Ir a acceso
          </Link>
        </div>
      </section>
    )
  }

  const isAdmin = currentUser.role === 'admin'
  const serviceMap = Object.fromEntries(services.map((service) => [service.id, service]))
  const branchMap = Object.fromEntries(branches.map((branch) => [branch.id, branch]))
  const visibleAppointments = sortAppointments(
    isAdmin
      ? appointments
      : appointments.filter((appointment) => appointment.clientId === currentUser.id),
  )
  const editingAppointment =
    visibleAppointments.find((appointment) => appointment.id === editingId) || null

  const pendingCount = visibleAppointments.filter(
    (appointment) => appointment.status === 'pendiente',
  ).length
  const completedCount = visibleAppointments.filter(
    (appointment) => appointment.status === 'completada',
  ).length

  const handleUpdate = async (values) => {
    const result = await updateAppointment(editingId, values)
    if (result.ok) {
      setEditingId(null)
    }
    return result
  }

  return (
    <section className="page dashboard-layout">
      <div className="page-head">
        <h1>{isAdmin ? 'Panel administrativo' : 'Mis citas'}</h1>
        <p>
          {isAdmin
            ? 'Gestiona citas, estados y reprogramaciones desde un solo lugar.'
            : 'Consulta, reprograma o cancela tus reservas activas.'}
        </p>
      </div>

      <div className="summary-grid">
        <article className="summary-card">
          <strong>{visibleAppointments.length}</strong>
          <span>Total visible</span>
        </article>
        <article className="summary-card">
          <strong>{pendingCount}</strong>
          <span>Pendientes</span>
        </article>
        <article className="summary-card">
          <strong>{completedCount}</strong>
          <span>Completadas</span>
        </article>
      </div>

      {editingAppointment && (
        <AppointmentForm
          key={editingAppointment.id}
          initialValues={editingAppointment}
          editingId={editingAppointment.id}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
          submitLabel="Guardar cambios"
          allowStatus={isAdmin}
        />
      )}

      <div className="appointment-list">
        {visibleAppointments.length === 0 ? (
          <div className="empty-state">
            <p>No hay citas registradas para mostrar.</p>
          </div>
        ) : (
          visibleAppointments.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <div className="appointment-meta">
                <h3>{serviceMap[appointment.serviceId]?.name || 'Servicio'}</h3>
                <span className={`status-pill status-${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <p>
                {appointment.clientName} - {branchMap[appointment.branchId]?.name}
              </p>
              <small>{formatDateTime(appointment.date, appointment.time)}</small>
              <small>{appointment.notes}</small>
              <div className="sheet-actions">
                <button type="button" className="btn btn-soft" onClick={() => setEditingId(appointment.id)}>
                  Editar
                </button>
                {appointment.status !== 'cancelada' && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => cancelAppointment(appointment.id)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default DashboardPage
