function ProgressBar({ value, max = 5 }) {
  const safeValue = Math.min(value, max)
  const progress = (safeValue / max) * 100

  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <small>
        {safeValue}/{max} confirmaciones
      </small>
    </div>
  )
}

export default ProgressBar
