import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Button from './Button'

const initialLogin = {
  email: '',
  password: '',
}

const initialRegister = {
  name: '',
  email: '',
  password: '',
}

function AuthCard() {
  const currentUserId = useStore((state) => state.currentUserId)
  const users = useStore((state) => state.users)
  const login = useStore((state) => state.login)
  const register = useStore((state) => state.register)
  const logout = useStore((state) => state.logout)

  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [registerForm, setRegisterForm] = useState(initialRegister)
  const [message, setMessage] = useState('')

  const currentUser = users.find((user) => user.id === currentUserId) || null

  const handleLogin = async (event) => {
    event.preventDefault()
    const result = await login(loginForm)
    setMessage(result.message)
    if (result.ok) {
      setLoginForm(initialLogin)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    const result = await register(registerForm)
    setMessage(result.message)
    if (result.ok) {
      setRegisterForm(initialRegister)
    }
  }

  if (currentUser) {
    return (
      <section className="sheet auth-sheet">
        <div className="sheet-header">
          <h1>Sesion activa</h1>
          <span className="status-pill">{currentUser.role === 'admin' ? 'Admin' : 'Cliente'}</span>
        </div>

        <p className="muted-copy">
          Has iniciado como <strong>{currentUser.name}</strong> con {currentUser.email}.
        </p>

        <div className="sheet-actions">
          <Link className="btn btn-soft" to={currentUser.role === 'admin' ? '/panel' : '/agenda'}>
            Ir al panel
          </Link>
          <Button type="button" variant="danger" onClick={logout}>
            Cerrar sesion
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="sheet auth-sheet">
      <div className="tabs">
        <button
          type="button"
          className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
          onClick={() => {
            setMode('login')
            setMessage('')
          }}
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
          onClick={() => {
            setMode('register')
            setMessage('')
          }}
        >
          Registrarse
        </button>
      </div>

      {mode === 'login' ? (
        <form className="field-stack" onSubmit={handleLogin}>
          <h1>Acceso al sistema</h1>
          <label>
            Correo
            <input
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((state) => ({ ...state, email: event.target.value }))
              }
              placeholder="cliente@servalert.app"
            />
          </label>
          <label>
            Contrasena
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((state) => ({ ...state, password: event.target.value }))
              }
              placeholder="Tu contrasena"
            />
          </label>
          {message && <p className="inline-message">{message}</p>}
          <Button type="submit" variant="success">
            Entrar
          </Button>
          <small className="helper-copy">
            Demo admin: <strong>admin@servalert.app</strong> / <strong>admin123</strong>
          </small>
        </form>
      ) : (
        <form className="field-stack" onSubmit={handleRegister}>
          <h1>Crear cuenta de cliente</h1>
          <label>
            Nombre
            <input
              value={registerForm.name}
              onChange={(event) =>
                setRegisterForm((state) => ({ ...state, name: event.target.value }))
              }
              placeholder="Nombre completo"
            />
          </label>
          <label>
            Correo
            <input
              type="email"
              value={registerForm.email}
              onChange={(event) =>
                setRegisterForm((state) => ({ ...state, email: event.target.value }))
              }
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label>
            Contrasena
            <input
              type="password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm((state) => ({ ...state, password: event.target.value }))
              }
              placeholder="Minimo 6 caracteres"
            />
          </label>
          {message && <p className="inline-message">{message}</p>}
          <Button type="submit" variant="success">
            Crear cuenta
          </Button>
        </form>
      )}
    </section>
  )
}

export default AuthCard
