import { useState } from 'react'
import { Link } from 'react-router-dom'

const COOKIE_CONSENT_KEY = 'serv-alert-cookie-consent'

function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const savedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY)
    return !savedConsent
  })

  if (!visible) {
    return null
  }

  const acceptCookies = () => {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted-2026-04-30')
    setVisible(false)
  }

  return (
    <aside className="cookie-banner" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-banner-copy">
        <strong>Usamos cookies y almacenamiento local para recordar el tema visual y tu consentimiento.</strong>
        <p>
          La experiencia demo de SERV-ALERT usa preferencias tecnicas del navegador. Puedes revisar
          el detalle en nuestras politicas.
        </p>
      </div>

      <div className="cookie-banner-actions">
        <Link className="btn btn-secondary" to="/politicas#cookies">
          Ver politicas
        </Link>
        <button type="button" className="btn btn-soft" onClick={acceptCookies}>
          Aceptar
        </button>
      </div>
    </aside>
  )
}

export default CookieBanner
