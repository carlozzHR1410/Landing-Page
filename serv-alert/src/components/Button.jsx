function Button({ children, variant = 'primary', full = false, className = '', ...props }) {
  return (
    <button
      className={`btn btn-${variant} ${full ? 'btn-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
