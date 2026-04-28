import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="top-nav">
      <NavLink to="/" className="brand">
        Serv-Alert
      </NavLink>
      <nav className="desktop-links">
        <NavLink to="/map">Mapa</NavLink>
        <NavLink to="/feed">Feed</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/about">Acerca</NavLink>
      </nav>
    </header>
  )
}

export default Navbar
