import { Outlet } from 'react-router-dom'
import AlertBanner from './AlertBanner'
import BottomNav from './BottomNav'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <AlertBanner />
      <main className="page-container">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout
