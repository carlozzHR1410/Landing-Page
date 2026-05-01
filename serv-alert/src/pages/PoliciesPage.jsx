import './PoliciesPage.css'

const policySections = [
  {
    id: 'resumen',
    label: 'Resumen',
    title: 'Politicas de uso y tratamiento general',
    paragraphs: [
      'SERV-ALERT presenta una portada institucional y una app-demo operativa para mostrar como puede organizarse el monitoreo de incidencias de agua potable y electricidad.',
      'Estas politicas describen como se usan los datos dentro de la demo, como se almacenan ciertas preferencias del navegador y que limites aplican al entorno actual.',
    ],
  },
  {
    id: 'datos',
    label: 'Datos',
    title: 'Tratamiento de reportes y datos visibles',
    paragraphs: [
      'La portada publica utiliza reportes de muestra con fines promocionales y visuales. Esos registros sirven para explicar el producto y no deben interpretarse como operaciones reales en produccion.',
      'Dentro de la app-demo, los reportes pueden enviarse al entorno configurado por la instancia activa. Si no hay una API disponible, la experiencia usa datos locales para no romper la demostracion.',
      'Los datos visibles en la demo deben manejarse como informacion de prueba o de entorno controlado, salvo que la organizacion integre una API y una base de datos de produccion por su cuenta.',
    ],
  },
  {
    id: 'cookies',
    label: 'Cookies',
    title: 'Cookies, almacenamiento local y preferencias',
    paragraphs: [
      'SERV-ALERT usa almacenamiento local del navegador para recordar el modo claro u oscuro y para registrar la aceptacion del aviso de cookies.',
      'En la version actual no se integran cookies de publicidad ni rastreadores de terceros para perfiles comerciales. El objetivo principal del almacenamiento local es tecnico y de experiencia de uso.',
      'Si una implementacion futura agrega analitica, telemetria o herramientas externas, se recomienda actualizar esta politica y solicitar consentimiento adicional segun el entorno regulatorio aplicable.',
    ],
  },
  {
    id: 'demo',
    label: 'App-demo',
    title: 'Uso permitido de la app-demo',
    paragraphs: [
      'La app-demo existe para explorar flujos, registrar ejemplos, revisar filtros y validar la experiencia del producto antes de un despliegue formal.',
      'No se recomienda usar la app-demo como unica fuente de evidencia operativa en un entorno critico sin antes definir respaldo, autenticacion, auditoria y politicas internas de retencion.',
      'Cada organizacion debe evaluar sus propios controles de acceso, seguridad y continuidad antes de convertir la demo en una herramienta oficial de operacion.',
    ],
  },
  {
    id: 'disponibilidad',
    label: 'Disponibilidad',
    title: 'Disponibilidad, respaldo y continuidad',
    paragraphs: [
      'La experiencia publicada puede depender de variables locales, del navegador y de una API configurada por el entorno. Por eso no se garantiza continuidad absoluta en la demo.',
      'Antes de un despliegue real se recomienda definir responsables, copias de seguridad, monitoreo, manejo de errores y procedimientos claros para restauracion de servicio.',
    ],
  },
]

function PoliciesPage() {
  return (
    <section className="page policy-page">
      <div className="policy-shell">
        <header className="policy-hero">
          <span className="policy-kicker">SERV-ALERT</span>
          <h1>Politicas de privacidad, cookies y uso de la app-demo.</h1>
          <p>
            Ultima actualizacion: <strong>30 de abril de 2026</strong>. Este documento resume como
            funciona la experiencia publica de SERV-ALERT y que condiciones aplican al entorno demo.
          </p>
        </header>

        <nav className="policy-nav" aria-label="Secciones de politicas">
          {policySections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <div className="policy-grid">
          {policySections.map((section) => (
            <article className="policy-card" id={section.id} key={section.id}>
              <span>{section.label}</span>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>

        <section className="policy-note">
          <h2>Recomendacion operativa</h2>
          <p>
            Si SERV-ALERT va a utilizarse en una organizacion real, conviene complementar estas
            politicas con autenticacion, roles, respaldo de base de datos, bitacora de cambios y
            lineamientos internos de atencion a incidencias.
          </p>
        </section>
      </div>
    </section>
  )
}

export default PoliciesPage
