import { useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import ExchangeCard from './components/ExchangeCard.jsx'
import GlassCube from './components/GlassCube.jsx'
import InfoSections from './components/InfoSections.jsx'
import { fetchCurrencies } from './services/currencyApi.js'

// Used only until the full list arrives, so the two default currencies have names straight away.
const STARTER_CURRENCIES = { usd: 'US Dollar', inr: 'Indian Rupee' }

export default function App() {
  const [currencies, setCurrencies] = useState(STARTER_CURRENCIES)
  const [currenciesError, setCurrenciesError] = useState('')
  const [toast, setToast] = useState('')
  const amountInputRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetchCurrencies()
      .then((list) => !cancelled && setCurrencies(list))
      .catch(() => !cancelled && setCurrenciesError('Unable to load the currency list. Please refresh the page.'))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(timer)
  }, [toast])

  function startConverting() {
    const input = amountInputRef.current
    if (!input) return
    input.scrollIntoView({ behavior: 'smooth', block: 'center' })
    input.focus({ preventScroll: true })
    input.select()
  }

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <span className="glow glow-a" />
        <span className="glow glow-b" />
      </div>

      <a className="skip-link" href="#converter">Skip to converter</a>

      <Header onSignIn={() => setToast('Accounts aren’t available yet — the converter works without signing in.')} />

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Currency converter</p>
            <h1>
              Exchange
              <br />
              your world.
            </h1>
            <p className="hero-text">
              Fast. Secure. Real-time exchange rates for 200+ currencies, crypto and metals.
            </p>
            <button type="button" className="btn-blue btn-cta" onClick={startConverting}>
              Start converting
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 5.5L15.5 10 11 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="hero-card" id="converter">
            <ExchangeCard currencies={currencies} currenciesError={currenciesError} amountInputRef={amountInputRef} />
          </div>

          <div className="hero-art">
            <GlassCube />
          </div>
        </section>

        <InfoSections />
      </main>

      <footer className="site-footer">
        <p>
          Rates from the free{' '}
          <a href="https://github.com/fawazahmed0/exchange-api" target="_blank" rel="noreferrer">
            fawazahmed0 exchange-api
          </a>
          . Updated daily — for information only.
        </p>
      </footer>

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}
