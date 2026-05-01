import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ReportsProvider } from '../context/ReportsContext'
import CookieBanner from './CookieBanner'
import Footer from './Footer'
import Navbar from './Navbar'

const THEME_STORAGE_KEY = 'serv-alert-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function Layout({ variant = 'landing' }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const shell = (
    <div className={`app-frame app-frame-${variant}`}>
      <div className={`app-shell app-shell-${variant}`}>
        <Navbar
          variant={variant}
          theme={theme}
          onToggleTheme={() =>
            setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
          }
        />
        <main className={`page-container page-container-${variant}`}>
          <Outlet />
        </main>
        {variant === 'landing' ? <Footer /> : null}
        <CookieBanner />
      </div>
    </div>
  )

  if (variant === 'app') {
    return <ReportsProvider>{shell}</ReportsProvider>
  }

  return shell
}

export default Layout
