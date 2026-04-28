import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MapPage from './pages/MapPage.jsx'
import ReportPage from './pages/ReportPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="agenda" element={<MapPage />} />
          <Route path="reservar" element={<ReportPage />} />
          <Route path="panel" element={<DashboardPage />} />
          <Route path="acceso" element={<AboutPage />} />
          <Route path="map" element={<Navigate to="/agenda" replace />} />
          <Route path="report" element={<Navigate to="/reservar" replace />} />
          <Route path="feed" element={<Navigate to="/agenda" replace />} />
          <Route path="feed/:id" element={<Navigate to="/panel" replace />} />
          <Route path="dashboard" element={<Navigate to="/panel" replace />} />
          <Route path="about" element={<Navigate to="/acceso" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
