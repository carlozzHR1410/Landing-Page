import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ReportsProvider } from '../context/ReportsContext'
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

function Layout() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  return (
    <ReportsProvider>
      <div className="app-frame">
        <div className="app-shell">
          <Navbar
            theme={theme}
            onToggleTheme={() =>
              setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
            }
          />
          <main className="page-container">
            <Outlet />
          </main>
        </div>
      </div>
    </ReportsProvider>
  )
}

export default Layout
