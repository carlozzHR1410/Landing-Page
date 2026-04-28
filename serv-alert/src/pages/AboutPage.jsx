import AuthCard from '../components/AuthCard'

function AboutPage() {
  return (
    <section className="page">
      <div className="page-head">
        <h1>Acceso y registro</h1>
        <p>
          El sistema usa cuentas de cliente y administrador para reservar, consultar y gestionar la
          agenda.
        </p>
      </div>

      <AuthCard />

      <article className="sheet">
        <h2>Funciones cubiertas por la plantilla</h2>
        <div className="feature-list">
          <p>Registro e inicio de sesion para clientes y administrador.</p>
          <p>Reserva de citas por fecha, hora y tipo de servicio.</p>
          <p>Calendario interactivo con espacios ocupados y libres.</p>
          <p>Panel de gestion para editar, completar o cancelar citas.</p>
        </div>
      </article>
    </section>
  )
}

export default AboutPage
