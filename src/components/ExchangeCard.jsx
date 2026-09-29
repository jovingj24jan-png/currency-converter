import { useCallback, useEffect, useRef, useState } from 'react'
import CurrencyInput from './CurrencyInput.jsx'
import RateInfo from './RateInfo.jsx'
import { fetchCurrencyRates } from '../services/currencyApi.js'
import { formatAmount, formatApiDate, parseAmount } from '../utils/format.js'

const FRIENDLY_ERROR = 'Unable to load exchange rates. Please try again.'

export default function ExchangeCard({ currencies, currenciesError, amountInputRef }) {
  const [from, setFrom] = useState('usd')
  const [to, setTo] = useState('inr')
  const [amountText, setAmountText] = useState('100')

  // The rates currently shown: { base: 'usd', date: '2026-09-28', rates: { inr: 88.7, ... } }
  const [current, setCurrent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')

  // Rates already downloaded, keyed by base currency, so typing a new amount never triggers a request.
  const cacheRef = useRef({})
  // Only the newest request is allowed to update the screen (the user may switch currencies quickly).
  const latestRequestRef = useRef(0)

  const loadRates = useCallback(async (base, { force = false } = {}) => {
    const requestId = ++latestRequestRef.current
    const cached = cacheRef.current[base]
    if (cached && !force) {
      setCurrent({ base, ...cached })
      setLoadError('')
      setLoading(false)
      return true
    }

    setLoading(true)
    setLoadError('')
    try {
      const data = await fetchCurrencyRates(base)
      cacheRef.current[base] = data
      if (requestId !== latestRequestRef.current) return false
      setCurrent({ base, ...data })
      return true
    } catch {
      if (requestId !== latestRequestRef.current) return false
      setLoadError(FRIENDLY_ERROR)
      return false
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRates(from)
  }, [from, loadRates])

  const { value: amount, error: amountError } = parseAmount(amountText)
  const ratesReady = current?.base === from
  const rawRate = ratesReady ? current.rates[to] : undefined
  const rate = Number.isFinite(rawRate) && rawRate > 0 ? rawRate : undefined
  const rateMissing = ratesReady && !loading && rate === undefined

  let resultText = '—'
  if (loading && !ratesReady) resultText = '…'
  else if (amount !== null && rate !== undefined) resultText = formatAmount(amount * rate)

  let statusMessage = ''
  let statusTone = 'info'
  if (loadError) {
    statusMessage = loadError
    statusTone = 'error'
  } else if (currenciesError) {
    statusMessage = currenciesError
    statusTone = 'error'
  } else if (rateMissing) {
    statusMessage = `Exchange rate unavailable for ${from.toUpperCase()} → ${to.toUpperCase()}. Please pick another currency.`
    statusTone = 'error'
  } else if (loading) {
    statusMessage = 'Loading exchange rate...'
  } else if (notice) {
    statusMessage = notice
    statusTone = 'success'
  }

  function handleAmountChange(text) {
    setAmountText(text)
    setNotice('')
  }

  function handleFromChange(code) {
    setFrom(code)
    setNotice('')
  }

  function handleToChange(code) {
    setTo(code)
    setNotice('')
  }

  function handleSwap() {
    setFrom(to)
    setTo(from)
    setNotice('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    if (amountError) {
      amountInputRef.current?.focus()
      return
    }
    const ok = await loadRates(from, { force: true })
    if (ok) {
      const date = cacheRef.current[from]?.date
      setNotice(`Converted with the latest rates (${formatApiDate(date)}).`)
    }
  }

  const fromName = currencies[from] || from.toUpperCase()
  const toName = currencies[to] || to.toUpperCase()

  return (
    <form className="exchange" onSubmit={handleSubmit} noValidate aria-labelledby="exchange-title">
      <section className="glass-panel exchange-panel">
        <div className="panel-heading">
          <h2 id="exchange-title">Exchange</h2>
          <span className="live-chip">
            <span className="live-dot" aria-hidden="true" />
            Live rates
          </span>
        </div>

        <CurrencyInput
          id="send-amount"
          label="You send"
          hint={fromName}
          amount={amountText}
          onAmountChange={handleAmountChange}
          error={amountError}
          currency={from}
          currencies={currencies}
          onCurrencyChange={handleFromChange}
          inputRef={amountInputRef}
        />

        <div className="swap-row">
          <button
            type="button"
            className="swap-button"
            onClick={handleSwap}
            aria-label={`Swap currencies: convert ${to.toUpperCase()} to ${from.toUpperCase()} instead`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 4v15M8 4L4.5 7.5M8 4l3.5 3.5M16 20V5M16 20l-3.5-3.5M16 20l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <CurrencyInput
          id="receive-amount"
          label="You receive"
          hint={toName}
          amount={resultText}
          readOnly
          loading={loading}
          currency={to}
          currencies={currencies}
          onCurrencyChange={handleToChange}
        />
      </section>

      <section className="glass-panel rate-panel" aria-label="Rate details">
        <RateInfo from={from} to={to} rate={rate} date={ratesReady ? current.date : null} loading={loading} />

        <p className={`status-message tone-${statusTone}`} role="status" aria-live="polite">
          {statusMessage && (
            <>
              <span className="status-icon" aria-hidden="true">
                {statusTone === 'error' ? '!' : statusTone === 'success' ? '✓' : ''}
              </span>
              <span>{statusMessage}</span>
            </>
          )}
        </p>

        <button type="submit" className="btn-blue btn-exchange" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Loading…
            </>
          ) : (
            'Exchange'
          )}
        </button>
      </section>
    </form>
  )
}
