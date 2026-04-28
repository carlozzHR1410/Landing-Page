import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="app-frame">
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
