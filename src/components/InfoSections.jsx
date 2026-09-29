const SERVICES = [
  {
    title: 'Fiat currencies',
    text: 'Dollars, euros, rupees, yen and 150+ more world currencies.',
    icon: <path d="M12 3v18M16.5 7.5c0-1.9-2-3-4.5-3s-4.5 1.1-4.5 3 2 2.6 4.5 3.1 4.5 1.4 4.5 3.4-2 3.2-4.5 3.2-4.5-1.3-4.5-3.2" />,
  },
  {
    title: 'Crypto',
    text: 'Bitcoin, Ethereum and other popular coins, priced in any currency.',
    icon: <path d="M7 4h7a3.5 3.5 0 010 7H7zm0 7h8a3.5 3.5 0 010 7H7zM9.5 2v2M13 2v2M9.5 18v3M13 18v3" />,
  },
  {
    title: 'Metals',
    text: 'Gold, silver, platinum and palladium rates per troy ounce.',
    icon: <path d="M3 18h18l-3-6H6zM7.5 12l2-5h5l2 5" />,
  },
]

export default function InfoSections() {
  return (
    <>
      <section className="info-section" id="about" aria-labelledby="about-title">
        <div className="glass-panel info-panel">
          <p className="eyebrow">About</p>
          <h2 id="about-title">Simple conversions, honest numbers.</h2>
          <p>
            Pick two currencies, type an amount and see what it’s worth. Every rate comes straight from the open
            fawazahmed0 exchange-api, which is refreshed daily. The date under the converter tells you exactly
            which day the rates are from.
          </p>
        </div>
      </section>

      <section className="info-section" id="services" aria-labelledby="services-title">
        <p className="eyebrow">Services</p>
        <h2 id="services-title">Everything you can convert</h2>
        <ul className="service-grid">
          {SERVICES.map((service) => (
            <li key={service.title} className="glass-panel service-card">
              <span className="service-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  {service.icon}
                </svg>
              </span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="info-section" id="contact" aria-labelledby="contact-title">
        <div className="glass-panel info-panel">
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Found a problem with a rate?</h2>
          <p>
            Rate data is maintained by the open-source exchange-api project. You can report issues on its{' '}
            <a href="https://github.com/fawazahmed0/exchange-api/issues" target="_blank" rel="noreferrer">
              GitHub page
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
