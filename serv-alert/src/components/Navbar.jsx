import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 1.75v2.5M12 19.75v2.5M4.75 4.75l1.75 1.75M17.5 17.5l1.75 1.75M1.75 12h2.5M19.75 12h2.5M4.75 19.25l1.75-1.75M17.5 6.5l1.75-1.75" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.3 14.2A8.55 8.55 0 0 1 9.8 3.7a.55.55 0 0 0-.77-.66A9.5 9.5 0 1 0 20.96 14.97a.55.55 0 0 0-.66-.77Z" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
    </svg>
  )
}

function Navbar({ theme, onToggleTheme }) {
  const nextThemeLabel = theme === 'dark' ? 'claro' : 'oscuro'
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = [
    { to: '/', label: 'Inicio', end: true },
    { to: '/reportes', label: 'Reportes' },
    { to: '/calendario', label: 'Calendario' },
  ]

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 760) {
        setMenuOpen(false)
      }
    }

    closeMenuOnDesktop()
    window.addEventListener('resize', closeMenuOnDesktop)

    return () => window.removeEventListener('resize', closeMenuOnDesktop)
  }, [])

  return (
    <header className="top-nav">
      <NavLink to="/" className="brand">
        <span className="brand-title">SERV-ALERT</span>
      </NavLink>

      <div className="nav-cluster">
        <button
          type="button"
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="mobile-main-nav"
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
        >
          <MenuIcon open={menuOpen} />
        </button>

        <nav
          id="mobile-main-nav"
          className={`desktop-links ${menuOpen ? 'mobile-open' : ''}`}
          aria-label="Secciones principales"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={`theme-toggle theme-toggle-${theme}`}
          onClick={onToggleTheme}
          aria-label={`Cambiar a modo ${nextThemeLabel}`}
          title={`Cambiar a modo ${nextThemeLabel}`}
        >
          <span className="theme-toggle-thumb" aria-hidden="true" />
          <span className="theme-icon theme-icon-sun" aria-hidden="true">
            <SunIcon />
          </span>
          <span className="theme-icon theme-icon-moon" aria-hidden="true">
            <MoonIcon />
          </span>
        </button>
      </div>
    </header>
  )
}

export default Navbar
