import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import HomePage from './pages/HomePage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="calendario" element={<CalendarPage />} />
          <Route path="agenda" element={<Navigate to="/calendario" replace />} />
          <Route path="reservar" element={<Navigate to="/" replace />} />
          <Route path="panel" element={<Navigate to="/reportes" replace />} />
          <Route path="acceso" element={<Navigate to="/reportes" replace />} />
          <Route path="map" element={<Navigate to="/calendario" replace />} />
          <Route path="report" element={<Navigate to="/reportes" replace />} />
          <Route path="feed" element={<Navigate to="/reportes" replace />} />
          <Route path="feed/:id" element={<Navigate to="/reportes" replace />} />
          <Route path="dashboard" element={<Navigate to="/reportes" replace />} />
          <Route path="about" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
