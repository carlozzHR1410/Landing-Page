const supportContacts = [
  {
    name: 'ANDA',
    phoneLabel: '(503) 2247-2700',
    phoneHref: 'tel:+50322472700',
    siteLabel: 'Portal ANDA',
    siteHref: 'https://www.anda.gob.sv/contactenos-2-2/',
  },
  {
    name: 'AES El Salvador',
    phoneLabel: '2506-9000',
    phoneHref: 'tel:+50325069000',
    siteLabel: 'Contacto AES',
    siteHref: 'https://www.aes-elsalvador.com/en/digital-service',
  },
  {
    name: 'CAES',
    phoneLabel: '+503 7476-5725',
    phoneHref: 'tel:+50374765725',
    siteLabel: 'Atencion directa',
    siteHref: 'tel:+50374765725',
  },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <strong>© Desarrollado por DeusDev</strong>
        </div>

        <div className="site-footer-contacts" aria-label="Contactos de soporte">
          {supportContacts.map((contact) => (
            <article className="footer-contact-card" key={contact.name}>
              <span className="footer-contact-name">{contact.name}</span>
              <a href={contact.phoneHref}>📞 {contact.phoneLabel}</a>
              <a href={contact.siteHref} target="_blank" rel="noreferrer">
                ✉ {contact.siteLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
