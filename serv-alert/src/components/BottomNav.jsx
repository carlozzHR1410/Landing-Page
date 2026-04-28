import { NavLink } from 'react-router-dom'

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/agenda">Agenda</NavLink>
      <NavLink to="/reservar">Reservar</NavLink>
      <NavLink to="/panel">Panel</NavLink>
    </nav>
  )
}

export default BottomNav
