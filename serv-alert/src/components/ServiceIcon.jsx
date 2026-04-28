const labels = {
  energia: 'E',
  agua: 'A',
}

function ServiceIcon({ type }) {
  return <span className={`service-icon ${type}`}>{labels[type] || '?'}</span>
}

export default ServiceIcon
