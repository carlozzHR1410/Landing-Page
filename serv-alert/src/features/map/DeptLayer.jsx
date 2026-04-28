function DeptLayer({ department, x, y }) {
  const colorByStatus = {
    normal: '#2f9e44',
    warning: '#f08c00',
    critical: '#e03131',
  }

  return (
    <g>
      <circle cx={x} cy={y} r="28" fill={colorByStatus[department.status]} opacity="0.86" />
      <text x={x} y={y + 5} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
        {department.code}
      </text>
    </g>
  )
}

export default DeptLayer
