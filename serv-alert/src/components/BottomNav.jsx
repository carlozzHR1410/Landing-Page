import { NavLink } from 'react-router-dom'

function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/map">Mapa</NavLink>
      <NavLink to="/report">Reportar</NavLink>
      <NavLink to="/feed">Feed</NavLink>
    </nav>
  )
}

export default BottomNav
