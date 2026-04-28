import DeptLayer from './DeptLayer'

const positions = {
  'San Miguel': { x: 90, y: 110 },
  'Usulután': { x: 165, y: 120 },
  Morazán: { x: 120, y: 55 },
  'La Unión': { x: 250, y: 85 },
}

function HeatMap({ departments }) {
  return (
    <div className="card">
      <svg viewBox="0 0 320 180" className="heatmap" role="img" aria-label="Mapa de calor">
        <rect x="8" y="10" width="304" height="160" fill="#f1f3f5" rx="16" />
        {departments.map((department) => (
          <DeptLayer key={department.id} department={department} {...positions[department.name]} />
        ))}
      </svg>
    </div>
  )
}

export default HeatMap
