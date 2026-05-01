import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

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

function Navbar({ variant = 'landing', theme, onToggleTheme }) {
  const nextThemeLabel = theme === 'dark' ? 'claro' : 'oscuro'
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const location = useLocation()
  const isLandingVariant = variant === 'landing'
  const isHomePage = location.pathname === '/'
  const useScrollSections = isLandingVariant && isHomePage
  const isDemoApp = location.pathname.startsWith('/app-demo')
  const landingBaseHref = isHomePage ? '' : '/'
  const appBasePath = isDemoApp ? '/app-demo' : '/app'

  const sectionLinks = isLandingVariant
    ? [
        { id: 'nosotros', href: `${landingBaseHref}#nosotros`, label: 'Nosotros' },
        { id: 'solucion', href: `${landingBaseHref}#solucion`, label: 'Solucion' },
        { id: 'cobertura', href: `${landingBaseHref}#cobertura`, label: 'Cobertura' },
      ]
    : []

  const pageLinks = isLandingVariant
    ? [
        { to: '/app-demo/reportes', label: 'App-demo' },
        { to: '/politicas', label: 'Politicas' },
      ]
    : [
        { to: `${appBasePath}/reportes`, label: 'Reportes' },
        { to: `${appBasePath}/calendario`, label: 'Calendario' },
        { to: '/politicas', label: 'Politicas' },
      ]

  const brandTarget = isLandingVariant ? '/' : `${appBasePath}/reportes`
  const shortcutLabel = isLandingVariant ? 'Inicio' : 'Volver al sitio'
  const shortcutHref = isHomePage ? '#top' : '/#top'
  const brandSubtitle = isLandingVariant
    ? 'Monitoreo para servicios esenciales'
    : isDemoApp
      ? 'App demo operativa'
      : 'Panel operativo'

  useEffect(() => {
    const closeMenuOnDesktop = () => {
      if (window.innerWidth > 820) {
        setMenuOpen(false)
      }
    }

    closeMenuOnDesktop()
    window.addEventListener('resize', closeMenuOnDesktop)

    return () => window.removeEventListener('resize', closeMenuOnDesktop)
  }, [])

  useEffect(() => {
    if (!useScrollSections) {
      return
    }

    const sectionIds = ['top', 'nosotros', 'solucion', 'cobertura']

    const updateActiveSection = () => {
      const offset = window.scrollY + 160
      let currentId = 'top'

      sectionIds.forEach((sectionId) => {
        const element = document.getElementById(sectionId)

        if (element && offset >= element.offsetTop) {
          currentId = sectionId
        }
      })

      setActiveSection(currentId)
    }

    const frameId = window.requestAnimationFrame(updateActiveSection)
    window.addEventListener('scroll', updateActiveSection, { passive: true })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [useScrollSections])

  return (
    <header className={`top-nav top-nav-${variant}`}>
      <div className="top-nav-main">
        <NavLink to={brandTarget} className="brand" aria-label="Ir al inicio de ServAlert">
          <span className="brand-mark">SA</span>
          <span className="brand-copy">
            <span className="brand-title">SERV-ALERT</span>
            <span className="brand-subtitle">{brandSubtitle}</span>
          </span>
        </NavLink>

        {isLandingVariant ? (
          <a
            href={shortcutHref}
            className={`home-shortcut ${isHomePage && activeSection === 'top' ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {shortcutLabel}
          </a>
        ) : (
          <NavLink to="/" className="home-shortcut" onClick={() => setMenuOpen(false)}>
            {shortcutLabel}
          </NavLink>
        )}
      </div>

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
          {sectionLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={useScrollSections && activeSection === item.id ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}

          {pageLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
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
