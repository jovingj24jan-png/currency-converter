const LOCALE = 'en-US'

// Converted amounts: 2 decimals for normal values, more significant digits for tiny values (e.g. BTC).
export function formatAmount(value) {
  if (!Number.isFinite(value)) return '—'
  if (value === 0) return '0'
  const abs = Math.abs(value)
  if (abs >= 1) {
    return value.toLocaleString(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return value.toLocaleString(LOCALE, { maximumSignificantDigits: 4 })
}

// Rates keep a little more precision so they are not misleading.
export function formatRate(value) {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs >= 1000) return value.toLocaleString(LOCALE, { maximumFractionDigits: 2 })
  if (abs >= 1) return value.toLocaleString(LOCALE, { maximumFractionDigits: 4 })
  return value.toLocaleString(LOCALE, { maximumSignificantDigits: 6 })
}

export function formatApiDate(isoDate) {
  if (!isoDate) return '—'
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// Uses the browser's built-in currency data, so no flag/symbol package is needed.
// Returns null for codes the browser doesn't know (most crypto).
export function getCurrencySymbol(code) {
  if (!/^[a-z]{3}$/i.test(code)) return null
  try {
    const part = new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency: code.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    })
      .formatToParts(0)
      .find((p) => p.type === 'currency')
    const symbol = part?.value
    return symbol && symbol.toUpperCase() !== code.toUpperCase() ? symbol : null
  } catch {
    return null
  }
}

// Checks what the user typed. Commas are allowed as thousands separators ("1,000.50").
export function parseAmount(raw) {
  const text = raw.trim().replace(/,/g, '')
  if (text === '') return { value: null, error: 'Enter an amount to convert.' }
  if (text.startsWith('-')) return { value: null, error: 'Amount can’t be negative.' }
  if (!/^\d*\.?\d*$/.test(text) || text === '.') {
    return { value: null, error: 'Use numbers only, like 100 or 556.45.' }
  }
  const value = Number(text)
  if (value === 0) return { value: null, error: 'Amount must be greater than zero.' }
  if (value > 1e15) return { value: null, error: 'That amount is too large.' }
  return { value, error: null }
}
