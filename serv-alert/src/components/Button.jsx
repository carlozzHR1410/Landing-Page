function Button({ children, variant = 'primary', full = false, ...props }) {
  return (
    <button className={`btn btn-${variant} ${full ? 'btn-full' : ''}`} {...props}>
      {children}
    </button>
  )
}

export default Button
