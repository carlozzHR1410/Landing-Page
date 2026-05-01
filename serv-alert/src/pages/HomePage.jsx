import { Link } from 'react-router-dom'
import './HomePage.css'
import demoReports from '../data/demoReports'
import { easternDepartments, easternLocations } from '../data/easternLocations'
import {
  formatElapsedTime,
  isActiveIssue,
  isIssueReport,
  isRestoreReport,
  sortReportsByCreatedDesc,
  supportedServices,
} from '../utils/reportUtils'

const heroImage = {
  src: 'https://images.pexels.com/photos/34610704/pexels-photo-34610704.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=1200',
  alt: 'Cuadrilla tecnica atendiendo infraestructura electrica en campo.',
  creditLabel: 'Foto de Denniz Futalan en Pexels',
  creditHref: 'https://www.pexels.com/photo/utility-workers-repairing-downed-power-lines-34610704/',
}

const heroBullets = [
  'La portada solo muestra actividad de referencia para presentar el producto con claridad.',
  'La operacion completa queda aislada dentro de una app-demo lista para explorar sin mezclar recorridos.',
  'El producto comunica reportes, cobertura, restablecimientos y trazabilidad con apariencia institucional.',
]

const brandStory = [
  {
    label: 'Quienes somos',
    title: 'Una propuesta digital creada para mejorar la forma de presentar incidencias de servicios esenciales.',
    description:
      'SERV-ALERT responde a una necesidad concreta: mostrar fallas, cobertura y tiempos de respuesta con una lectura profesional que sirva tanto en reuniones operativas como en presentaciones institucionales.',
  },
  {
    label: 'Nuestra idea',
    title: 'Separar la vitrina del producto de la operacion interna sin perder coherencia entre ambas.',
    description:
      'La portada introduce el valor, el enfoque y la imagen del producto. La app-demo conserva el flujo completo para registrar eventos, revisar actividad y validar como se comportaria la experiencia operativa.',
  },
  {
    label: 'Que ofrecemos',
    title: 'Una experiencia de producto con narrativa clara, datos demo y una app lista para explorar.',
    description:
      'SERV-ALERT combina cobertura territorial, monitoreo por servicio, historial de actividad y una demo navegable para explicar mejor el producto antes de una implementacion real.',
  },
]

const solutionPillars = [
  {
    tag: 'Presentacion institucional',
    title: 'La portada vende bien el producto sin exponer flujos internos ni acciones operativas reales.',
    description:
      'Esto permite hablar de SERV-ALERT como plataforma con discurso claro, confianza visual y una primera impresion mucho mas profesional.',
  },
  {
    tag: 'Demo separada',
    title: 'La app-demo conserva reportes, calendario y seguimiento para validar la experiencia completa.',
    description:
      'La separacion evita mezclar usuarios que solo quieren conocer el producto con personas que necesitan probar la operacion paso a paso.',
  },
  {
    tag: 'Escalabilidad real',
    title: 'El producto puede crecer hacia un entorno formal con seguridad, roles y respaldo operativo.',
    description:
      'SERV-ALERT queda mejor preparado para evolucionar hacia despliegues con politicas, integraciones y procesos internos mas serios.',
  },
]

const offerCards = [
  {
    title: 'Portada institucional',
    description:
      'Presenta el producto con narrativa clara, muestra promocional y una entrada ordenada hacia la demo.',
  },
  {
    title: 'App-demo operativa',
    description:
      'Mantiene el flujo de reportes, restablecimientos y calendario para explorar el comportamiento completo de la experiencia.',
  },
  {
    title: 'Cobertura territorial',
    description:
      'Resume departamentos, distritos y densidad de actividad para explicar alcance de forma inmediata.',
  },
  {
    title: 'Politicas visibles',
    description:
      'Incluye aviso de cookies y una pagina de politicas para reforzar orden, confianza y madurez del producto.',
  },
]

const operatingSteps = [
  {
    step: '01',
    title: 'Presentar el producto',
    description:
      'La portada introduce a SERV-ALERT, explica el problema que resuelve y muestra indicadores visuales faciles de leer.',
  },
  {
    step: '02',
    title: 'Explorar la app-demo',
    description:
      'Quien necesita profundizar puede entrar a la demo operativa y navegar reportes, calendario y actividad sin mezclar la experiencia comercial.',
  },
  {
    step: '03',
    title: 'Preparar una adopcion real',
    description:
      'Con la propuesta clara y la demo validada, la organizacion puede definir integraciones, politicas, respaldo y siguientes pasos.',
  },
]

const useCases = [
  {
    title: 'Municipalidades y proteccion civil',
    description:
      'Sirve para centralizar reportes ciudadanos, ordenar seguimiento por territorio y presentar mejor el estado del servicio ante coordinacion interna.',
  },
  {
    title: 'Juntas de agua y lideres comunitarios',
    description:
      'Ayuda a documentar incidencias, respaldar recurrencia y explicar con mas evidencia donde se concentran los problemas.',
  },
  {
    title: 'Mesas tecnicas y supervision',
    description:
      'Da una lectura mas seria de actividad, cierres y tiempos de seguimiento sin depender de chats o registros dispersos.',
  },
]

const experienceStories = [
  {
    title: 'Coordinacion municipal de servicios',
    sector: 'Perfil de uso referencial',
    score: '4.9/5',
    stars: 5,
    quote:
      'Ayuda a llegar a reuniones con un panorama claro por distrito y con una narrativa mas ordenada frente a las jefaturas.',
  },
  {
    title: 'Junta administradora de agua comunitaria',
    sector: 'Perfil de uso referencial',
    score: '4.8/5',
    stars: 5,
    quote:
      'La experiencia hace mas facil explicar recurrencia, cierres y zonas afectadas sin depender de capturas o registros sueltos.',
  },
  {
    title: 'Operaciones de mantenimiento institucional',
    sector: 'Perfil de uso referencial',
    score: '4.9/5',
    stars: 5,
    quote:
      'La separacion entre la portada y app-demo ayuda a presentar el producto a direccion mientras el equipo tecnico valida el flujo completo.',
  },
]

const demoFeatureList = [
  'Registrar fallas y restablecimientos dentro de la demo operativa.',
  'Filtrar actividad por departamento y distrito.',
  'Revisar calendario de movimientos por fecha.',
  'Mantener rutas heredadas funcionando para no romper accesos previos.',
]

const demoRoutes = [
  { label: 'Ruta principal', path: '/app-demo/reportes' },
  { label: 'Calendario demo', path: '/app-demo/calendario' },
  { label: 'Politicas', path: '/politicas' },
]

const faqs = [
  {
    question: 'Por que la portada no permite reportar directamente?',
    answer:
      'Porque su funcion es presentar el producto y proteger la experiencia comercial. La operacion completa se concentra en la app-demo para no mezclar ambos recorridos.',
  },
  {
    question: 'Que es exactamente app-demo?',
    answer:
      'Es la version navegable donde se pueden probar reportes, filtros y calendario con el flujo completo de la aplicacion.',
  },
  {
    question: 'Que gana una organizacion con esta separacion?',
    answer:
      'Mejor narrativa comercial, menos ruido operativo en la portada y una demo lista para profundizar sin comprometer la presentacion institucional.',
  },
]

function formatRatio(value) {
  if (!Number.isFinite(value)) {
    return '0%'
  }

  return `${Math.round(value * 100)}%`
}

function formatAverageTime(hours) {
  if (!Number.isFinite(hours)) {
    return 'Sin historico'
  }

  if (hours < 1) {
    const minutes = Math.max(1, Math.round(hours * 60))
    return `${minutes} min`
  }

  return `${hours >= 10 ? Math.round(hours) : hours.toFixed(1)} h`
}

function getActivityLabel(report) {
  return report.reportType === 'restore' ? 'Restablecimiento' : 'Incidencia'
}

function getStars(count) {
  return '\u2605'.repeat(count)
}

function HomePage() {
  const reports = sortReportsByCreatedDesc(demoReports)
  const issueReports = sortReportsByCreatedDesc(reports.filter(isIssueReport))
  const restoreReports = sortReportsByCreatedDesc(reports.filter(isRestoreReport))
  const activeIssues = sortReportsByCreatedDesc(reports.filter(isActiveIssue))
  const recentActivity = sortReportsByCreatedDesc(reports).slice(0, 5)

  const resolvedIssues = issueReports.filter((report) => report.status === 'restored')
  const monitoredDistricts = new Set(issueReports.map((report) => report.district).filter(Boolean)).size
  const departmentsWithActiveIssues = new Set(
    activeIssues.map((report) => report.department).filter(Boolean),
  ).size
  const totalDistricts = easternLocations.reduce(
    (total, locationGroup) => total + locationGroup.districts.length,
    0,
  )

  const matchedDurations = restoreReports
    .map((restoreReport) => {
      const linkedIssue = issueReports.find((report) => report.id === restoreReport.relatedReportId)

      if (!linkedIssue) {
        return null
      }

      const duration =
        (new Date(restoreReport.createdAt).getTime() - new Date(linkedIssue.createdAt).getTime()) /
        3600000

      return Number.isFinite(duration) && duration >= 0 ? duration : null
    })
    .filter((duration) => duration !== null)

  const averageRestoreHours =
    matchedDurations.length > 0
      ? matchedDurations.reduce((sum, duration) => sum + duration, 0) / matchedDurations.length
      : null

  const liveMetrics = [
    {
      label: 'Reportes activos',
      value: activeIssues.length,
      copy: 'Actividad abierta visible solo como muestra promocional dentro de la portada.',
    },
    {
      label: 'Casos resueltos',
      value: resolvedIssues.length,
      copy: 'Incidencias que ya cuentan con restablecimiento dentro del set de referencia.',
    },
    {
      label: 'Cobertura actual',
      value: `${monitoredDistricts}/${totalDistricts}`,
      copy: 'Distritos representados dentro de la narrativa visual del producto.',
    },
    {
      label: 'Tiempo medio de cierre',
      value: formatAverageTime(averageRestoreHours),
      copy: 'Promedio calculado sobre la muestra demo para reforzar lectura operativa.',
    },
  ]

  const serviceCards = supportedServices.map((service) => {
    const serviceIssues = issueReports.filter((report) => report.service === service)
    const serviceActive = serviceIssues.filter((report) => report.status === 'active').length
    const serviceResolved = serviceIssues.filter((report) => report.status === 'restored').length

    return {
      service,
      total: serviceIssues.length,
      active: serviceActive,
      resolved: serviceResolved,
      ratio: serviceIssues.length === 0 ? 0 : serviceResolved / serviceIssues.length,
    }
  })

  const territoryCards = easternLocations.map((locationGroup) => {
    const reportsByDepartment = issueReports.filter(
      (report) => report.department === locationGroup.department,
    )

    return {
      department: locationGroup.department,
      districtCount: locationGroup.districts.length,
      active: reportsByDepartment.filter((report) => report.status === 'active').length,
      total: reportsByDepartment.length,
    }
  })

  return (
    <section className="page home-page landing-home">
      <div className="serv-alert-screen landing-shell">
        <p className="serv-alert-notice landing-notice">
          La portada usa reportes de muestra con fines visuales. Toda la operacion completa vive en
          la <strong> app-demo</strong>.
        </p>

        <section className="landing-hero" id="top">
          <article className="landing-hero-stage">
            <div className="landing-hero-content">
              <div className="landing-hero-topline">
                <span className="landing-kicker">Monitoreo inteligente para servicios esenciales</span>
                <span className="landing-hero-chip">Portada institucional + app-demo operativa</span>
              </div>

              <h1>Una plataforma que presenta bien la operacion y demuestra mejor el producto.</h1>

              <p className="landing-hero-text">
                SERV-ALERT muestra fallas y restablecimientos con una narrativa visual clara, pero
                reserva la experiencia operativa completa para una app-demo separada. Asi la portada
                vende el producto y la demo profundiza sin comprometer el recorrido principal.
              </p>

              <div className="landing-hero-bullets">
                {heroBullets.map((item) => (
                  <article className="landing-hero-bullet" key={item}>
                    <span />
                    <p>{item}</p>
                  </article>
                ))}
              </div>

              <div className="landing-action-row">
                <a className="btn btn-soft landing-primary-action" href="#app-demo">
                  Ir a la app-demo
                </a>
                <Link className="btn btn-secondary landing-secondary-action" to="/app-demo/reportes">
                  Abrir reportes demo
                </Link>
                <Link className="btn btn-outline landing-outline-action" to="/politicas">
                  Ver politicas
                </Link>
              </div>

              <div className="landing-trust-row" aria-label="Indicadores clave de ServAlert">
                <article className="landing-trust-pill">
                  <strong>{easternDepartments.length}</strong>
                  <span>departamentos priorizados</span>
                </article>
                <article className="landing-trust-pill">
                  <strong>{supportedServices.length}</strong>
                  <span>servicios esenciales visibles</span>
                </article>
                <article className="landing-trust-pill">
                  <strong>{experienceStories.length}</strong>
                  <span>perfiles de adopcion referencial</span>
                </article>
              </div>
            </div>

            <div className="landing-hero-media">
              <div className="landing-hero-image-shell">
                <img className="landing-hero-image" src={heroImage.src} alt={heroImage.alt} />
                <div className="landing-hero-image-copy">
                  <span className="landing-panel-label">Vista promocional</span>
                  <h2>La operacion se vuelve visible, presentable y facil de explicar.</h2>
                  <p>
                    La portada deja una primera impresion fuerte y la app-demo conserva el recorrido
                    completo para probar reportes, actividad y calendario cuando realmente se necesita.
                  </p>

                  <div className="landing-hero-image-stats">
                    {liveMetrics.slice(0, 2).map((metric) => (
                      <article className="landing-hero-image-stat" key={metric.label}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </article>
                    ))}
                  </div>
                </div>
                <a
                  className="landing-hero-credit"
                  href={heroImage.creditHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {heroImage.creditLabel}
                </a>
              </div>
            </div>
          </article>

          <div className="landing-hero-support-grid">
            <article className="landing-preview-card landing-preview-primary">
              <div className="landing-preview-header">
                <div>
                  <span className="landing-panel-label">Centro de control</span>
                  <h2>Indicadores visibles desde la primera pantalla</h2>
                </div>
                <span className="landing-status-chip">Muestra demo</span>
              </div>

              <div className="landing-metric-grid">
                {liveMetrics.map((metric) => (
                  <article className="landing-metric-card" key={metric.label}>
                    <span className="landing-metric-label">{metric.label}</span>
                    <strong className="landing-metric-value">{metric.value}</strong>
                    <p>{metric.copy}</p>
                  </article>
                ))}
              </div>
            </article>

            <article className="landing-preview-card landing-preview-feed">
              <div className="landing-preview-header">
                <div>
                  <span className="landing-panel-label">Actividad visible</span>
                  <h2>Reportes de referencia para hablar del producto con contexto</h2>
                </div>
                <Link className="landing-inline-link" to="/app-demo/reportes">
                  Ver app-demo
                </Link>
              </div>

              <div className="landing-activity-list">
                {recentActivity.map((report) => (
                  <article className="landing-activity-item" key={`${report.reportType}-${report.id}`}>
                    <span className={`landing-activity-kind landing-activity-kind-${report.reportType}`}>
                      {getActivityLabel(report)}
                    </span>
                    <strong>
                      {report.service} en {report.location}
                    </strong>
                    <p>{report.description}</p>
                    <small>{formatElapsedTime(report.createdAt)}</small>
                  </article>
                ))}
              </div>

              <p className="landing-sample-note">
                Esta actividad corresponde a una muestra visual usada para presentar SERV-ALERT sin
                exponer directamente la operacion de la app.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-section" id="nosotros">
          <div className="landing-section-head">
            <span className="landing-eyebrow">SERV-ALERT</span>
            <h2>Una propuesta pensada para que el producto se vea serio y la demo se sienta util.</h2>
            <p>
              SERV-ALERT ahora tiene un recorrido mas profesional: una portada que explica y convence,
              y una app-demo aparte para probar el flujo completo cuando hace falta profundizar.
            </p>
          </div>

          <div className="landing-story-grid">
            {brandStory.map((item) => (
              <article className="landing-story-card" key={item.label}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="solucion">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Solucion</span>
              <h2>Una estructura mas limpia para explicar, demostrar y proyectar el producto.</h2>
            </div>
            <p>
              La portada deja de comportarse como panel y se convierte en una vitrina real. La app-demo
              queda como siguiente paso natural para quien necesita ver el funcionamiento completo.
            </p>
          </div>

          <div className="landing-pillar-grid">
            {solutionPillars.map((pillar) => (
              <article className="landing-pillar-card" key={pillar.title}>
                <span>{pillar.tag}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="producto">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Lo que ofrecemos</span>
              <h2>Una experiencia de producto lista para mostrar valor sin mezclar contextos.</h2>
            </div>
            <p>
              SERV-ALERT no solo presenta paneles. Presenta una forma mas ordenada de contar el estado
              del servicio y una demo operativa preparada para validaciones reales.
            </p>
          </div>

          <div className="landing-offer-grid">
            {offerCards.map((offer) => (
              <article className="landing-offer-card" key={offer.title}>
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="actividad">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Muestra promocional</span>
              <h2>La portada conserva solo la actividad necesaria para reforzar el valor del producto.</h2>
            </div>
            <p>
              La informacion visible ayuda a que SERV-ALERT se sienta vivo y creible, pero sin convertir
              la portada en el espacio principal de operacion.
            </p>
          </div>

          <div className="landing-ops-grid">
            <article className="landing-panel landing-service-panel">
              <div className="landing-panel-head">
                <div>
                  <span className="landing-panel-label">Servicios</span>
                  <h3>Lectura promocional por tipo de servicio</h3>
                </div>
              </div>

              <div className="landing-service-grid">
                {serviceCards.map((card) => (
                  <article className="landing-service-card" key={card.service}>
                    <div className="landing-service-card-head">
                      <strong>{card.service}</strong>
                      <span>{formatRatio(card.ratio)} resuelto</span>
                    </div>
                    <p>{card.total} reportes historicos visibles dentro de la muestra demo.</p>
                    <div className="landing-service-stats">
                      <span>{card.active} activos</span>
                      <span>{card.resolved} resueltos</span>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="landing-panel landing-highlight-panel">
              <div className="landing-panel-head">
                <div>
                  <span className="landing-panel-label">Valor inmediato</span>
                  <h3>Lo que la portada ya deja claro sobre SERV-ALERT</h3>
                </div>
              </div>

              <div className="landing-highlight-list">
                <article>
                  <strong>{issueReports.length}</strong>
                  <p>casos documentados para respaldar la narrativa del producto.</p>
                </article>
                <article>
                  <strong>{departmentsWithActiveIssues}</strong>
                  <p>departamentos con actividad activa dentro de la muestra visible.</p>
                </article>
                <article>
                  <strong>{restoreReports.length}</strong>
                  <p>restablecimientos mostrados para explicar continuidad y cierre.</p>
                </article>
              </div>
            </article>
          </div>
        </section>

        <section className="landing-section" id="operacion">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Como funciona</span>
              <h2>Una ruta clara desde la primera impresion hasta la exploracion profunda.</h2>
            </div>
            <p>
              El producto ahora tiene una secuencia mas limpia: primero convence, luego demuestra y
              despues permite validar la parte operativa en un espacio separado.
            </p>
          </div>

          <div className="landing-steps-grid">
            {operatingSteps.map((step) => (
              <article className="landing-step-card" key={step.step}>
                <span className="landing-step-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="cobertura">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Cobertura</span>
              <h2>Territorio, servicio y densidad de actividad en una vista consistente y profesional.</h2>
            </div>
            <p>
              Esta capa visual ayuda a hablar del alcance del producto sin convertir la portada en un
              panel funcional. Todo sigue orientado a mostrar valor de manera ordenada.
            </p>
          </div>

          <div className="landing-territory-grid">
            {territoryCards.map((territory) => (
              <article className="landing-territory-card" key={territory.department}>
                <div className="landing-territory-head">
                  <h3>{territory.department}</h3>
                  <span>{territory.districtCount} distritos</span>
                </div>
                <p>{territory.total} incidencias historicas visibles dentro de esta muestra.</p>
                <div className="landing-territory-stats">
                  <span>{territory.active} activas</span>
                  <span>{Math.max(territory.total - territory.active, 0)} cerradas</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Para quienes</span>
              <h2>Una solucion util para equipos que necesitan visibilidad y mejor narrativa operativa.</h2>
            </div>
            <p>
              El producto gana fuerza cuando queda claro en que tipo de equipos encaja y por que esa
              diferencia importa al momento de comunicar incidentes.
            </p>
          </div>

          <div className="landing-audience-grid">
            {useCases.map((useCase) => (
              <article className="landing-audience-card" key={useCase.title}>
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="experiencias">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Experiencias de uso</span>
              <h2>Perfiles de adopcion referencial para que el producto se sienta realista y confiable.</h2>
            </div>
            <p>
              Estas referencias muestran donde SERV-ALERT encaja mejor y como se percibe su valor
              cuando la conversacion pasa de la idea a la implementacion.
            </p>
          </div>

          <div className="landing-experience-grid">
            {experienceStories.map((story) => (
              <article className="landing-experience-card" key={story.title}>
                <div className="landing-experience-head">
                  <div>
                    <span className="landing-panel-label">{story.sector}</span>
                    <h3>{story.title}</h3>
                  </div>
                  <div className="landing-experience-score">
                    <strong>{story.score}</strong>
                    <span className="landing-stars" aria-label={`${story.stars} estrellas`}>
                      {getStars(story.stars)}
                    </span>
                  </div>
                </div>
                <p>{story.quote}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="app-demo">
          <div className="landing-section-head landing-section-head-inline">
            <div>
              <span className="landing-eyebrow">Ir a la app-demo</span>
              <h2>Cuando quieras operar de verdad dentro de la demo, aqui esta la entrada correcta.</h2>
            </div>
            <p>
              La app-demo concentra las funciones completas de la aplicacion y deja a la portada como
              una experiencia mas limpia, institucional y enfocada en vender el producto.
            </p>
          </div>

          <div className="landing-demo-grid">
            <article className="landing-panel landing-demo-panel">
              <div className="landing-panel-head">
                <div>
                  <span className="landing-panel-label">App-demo operativa</span>
                  <h3>Todo el flujo completo en un espacio separado</h3>
                </div>
              </div>

              <div className="landing-demo-list">
                {demoFeatureList.map((item) => (
                  <article className="landing-demo-item" key={item}>
                    <span />
                    <p>{item}</p>
                  </article>
                ))}
              </div>

              <div className="landing-demo-actions">
                <Link className="btn btn-soft" to="/app-demo/reportes">
                  Ir a reportes demo
                </Link>
                <Link className="btn btn-secondary" to="/app-demo/calendario">
                  Abrir calendario demo
                </Link>
              </div>
            </article>

            <article className="landing-panel landing-demo-summary">
              <div className="landing-panel-head">
                <div>
                  <span className="landing-panel-label">Rutas clave</span>
                  <h3>Accesos pensados para presentar y explorar</h3>
                </div>
              </div>

              <div className="landing-route-list">
                {demoRoutes.map((route) => (
                  <article className="landing-route-card" key={route.path}>
                    <span>{route.label}</span>
                    <strong>{route.path}</strong>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="landing-section landing-section-faq">
          <div className="landing-section-head">
            <span className="landing-eyebrow">Preguntas clave</span>
            <h2>Contexto util para explicar por que SERV-ALERT ahora se siente mas profesional.</h2>
            <p>
              Estas respuestas ayudan a sostener la propuesta cuando alguien pregunta por el rol de
              la portada, la demo y la separacion entre ambas.
            </p>
          </div>

          <div className="landing-faq-grid">
            {faqs.map((item) => (
              <article className="landing-faq-card" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-cta">
          <div>
            <span className="landing-eyebrow">Siguiente paso</span>
            <h2>Presenta el producto en la portada y opera todo lo demas dentro de la app-demo.</h2>
            <p>
              La portada queda enfocada en posicionar bien a SERV-ALERT. La demo concentra reportes,
              calendario y pruebas operativas en un espacio mas apropiado.
            </p>
          </div>

          <div className="landing-cta-actions">
            <Link className="btn btn-soft" to="/app-demo/reportes">
              Abrir app-demo
            </Link>
            <Link className="btn btn-secondary" to="/politicas">
              Revisar politicas
            </Link>
          </div>
        </section>
      </div>
    </section>
  )
}

export default HomePage
