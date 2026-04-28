import HeatMap from '../features/map/HeatMap'
import { useMap } from '../features/map/useMap'

function MapPage() {
  const { departments, mapLoading, mapError } = useMap()

  return (
    <section className="page">
      <h1>Mapa de calor por departamento</h1>
      {mapLoading && <p>Cargando estado de departamentos...</p>}
      {mapError && <p>{mapError}</p>}
      {!mapLoading && !mapError && (
        <>
          <HeatMap departments={departments} />
          <div className="grid-two">
            {departments.map((department) => (
              <article key={department.id} className="card">
                <h3>{department.name}</h3>
                <p>{department.active_reports} reportes activos</p>
                <small>Estado: {department.status}</small>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default MapPage
