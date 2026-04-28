import { useState } from 'react'
import AppointmentForm from '../components/AppointmentForm'
import AuthCard from '../components/AuthCard'
import { useStore } from '../store/useStore'

function ReportPage() {
  const currentUserId = useStore((state) => state.currentUserId)
  const users = useStore((state) => state.users)
  const services = useStore((state) => state.services)
  const branches = useStore((state) => state.branches)
  const bookAppointment = useStore((state) => state.bookAppointment)

  const [lastAppointment, setLastAppointment] = useState(null)

  const currentUser = users.find((user) => user.id === currentUserId) || null

  const handleBooking = async (values) => {
    const result = await bookAppointment(values)
    if (result.ok) {
      setLastAppointment(result.appointment)
    }
    return result
  }

  if (!currentUser) {
    return (
      <section className="page">
        <div className="page-head">
          <h1>Reserva de citas</h1>
          <p>Debes iniciar sesion o registrarte para reservar tu espacio.</p>
        </div>
        <AuthCard />
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Nueva reserva</h1>
        <p>Selecciona servicio, fecha y hora para bloquear el espacio en tiempo real.</p>
      </div>

      <AppointmentForm submitLabel="Reservar" onSubmit={handleBooking} />

      {lastAppointment && (
        <article className="sheet success-sheet">
          <h2>Reserva confirmada</h2>
          <p>
            {services.find((service) => service.id === lastAppointment.serviceId)?.name} en{' '}
            {branches.find((branch) => branch.id === lastAppointment.branchId)?.name}
          </p>
          <small>
            Fecha {lastAppointment.date} a las {lastAppointment.time}
          </small>
        </article>
      )}
    </section>
  )
}

export default ReportPage
