function ServiceIcon({ type }) {
  if (type === 'energia') {
    return (
      <span className="service-icon energia" aria-label="Servicio energia">
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
        </svg>
      </span>
    )
  }

  return (
    <span className="service-icon agua" aria-label="Servicio agua">
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d="M12 2s6 7 6 11a6 6 0 1 1-12 0C6 9 12 2 12 2z" />
      </svg>
    </span>
  )
}

export default ServiceIcon
