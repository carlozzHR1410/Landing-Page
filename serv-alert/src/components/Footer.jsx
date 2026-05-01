const supportContacts = [
  {
    name: 'ANDA',
    contactLabel: '(503) 2247-2700',
    contactHref: 'tel:+50322472700',
    detailLabel: 'Portal ANDA',
    detailHref: 'https://www.anda.gob.sv/contactenos-2-2/',
  },
  {
    name: 'AES El Salvador',
    contactLabel: '2506-9000',
    contactHref: 'tel:+50325069000',
    detailLabel: 'Atencion digital',
    detailHref: 'https://www.aes-elsalvador.com/en/digital-service',
  },
  {
    name: 'CAESS',
    contactLabel: '+503 7476-5725',
    contactHref: 'tel:+50374765725',
    detailLabel: 'Linea directa',
    detailHref: 'tel:+50374765725',
  },
]

const quickLinks = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Solucion', href: '/#solucion' },
  { label: 'Cobertura', href: '/#cobertura' },
  { label: 'App-demo', href: '/app-demo/reportes' },
  { label: 'Politicas', href: '/politicas' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span className="site-footer-kicker">SERV-ALERT</span>
          <strong>Visibilidad publica y operacion real en una sola plataforma.</strong>
          <p>
            SERV-ALERT separa la vitrina institucional de la experiencia operativa para presentar
            el producto con claridad y mantener la demo completa en un espacio propio.
          </p>
        </div>

        <div className="site-footer-links" aria-label="Enlaces rapidos">
          {quickLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="site-footer-contacts" aria-label="Contactos de soporte">
          {supportContacts.map((contact) => (
            <article className="footer-contact-card" key={contact.name}>
              <span className="footer-contact-name">{contact.name}</span>
              <a href={contact.contactHref}>{contact.contactLabel}</a>
              <a href={contact.detailHref} target="_blank" rel="noreferrer">
                {contact.detailLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
