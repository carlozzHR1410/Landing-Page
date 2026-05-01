import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import HomePage from './pages/HomePage.jsx'
import PoliciesPage from './pages/PoliciesPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout variant="landing" />}>
          <Route index element={<HomePage />} />
          <Route path="politicas" element={<PoliciesPage />} />
          <Route path="about" element={<Navigate to="/#nosotros" replace />} />
          <Route path="reservar" element={<Navigate to="/#top" replace />} />
          <Route path="cookies" element={<Navigate to="/politicas#cookies" replace />} />
        </Route>

        <Route path="app-demo" element={<Layout variant="app" />}>
          <Route index element={<Navigate to="/app-demo/reportes" replace />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="agenda" element={<Navigate to="/app-demo/calendario" replace />} />
          <Route path="*" element={<Navigate to="/app-demo/reportes" replace />} />
        </Route>

        <Route path="app" element={<Layout variant="app" />}>
          <Route index element={<Navigate to="/app/reportes" replace />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="agenda" element={<Navigate to="/app/calendario" replace />} />
          <Route path="*" element={<Navigate to="/app/reportes" replace />} />
        </Route>

        <Route path="reportes" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="calendario" element={<Navigate to="/app-demo/calendario" replace />} />
        <Route path="agenda" element={<Navigate to="/app-demo/calendario" replace />} />
        <Route path="panel" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="acceso" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="map" element={<Navigate to="/app-demo/calendario" replace />} />
        <Route path="report" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="feed" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="feed/:id" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="dashboard" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="demo" element={<Navigate to="/app-demo/reportes" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
