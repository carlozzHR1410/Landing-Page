import { useReports } from '../features/reports/useReports'

function DashboardPage() {
  const { reports } = useReports()
  const byDepartment = reports.reduce((acc, report) => {
    acc[report.department] = (acc[report.department] || 0) + 1
    return acc
  }, {})

  return (
    <section className="page">
      <h1>Dashboard de negocio</h1>
      <p>Vista de historial para monitorear continuidad operativa por zona.</p>
      <div className="grid-two">
        {Object.entries(byDepartment).map(([department, count]) => (
          <article key={department} className="card">
            <h3>{department}</h3>
            <p>{count} incidencias del periodo</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardPage
