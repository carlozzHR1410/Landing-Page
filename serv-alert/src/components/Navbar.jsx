import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="top-nav">
      <NavLink to="/" className="brand">
        <span className="brand-title">SERV-ALERT</span>
      </NavLink>
    </header>
  )
}

export default Navbar
