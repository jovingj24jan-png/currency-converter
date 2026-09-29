// All exchange-rate data comes from https://github.com/fawazahmed0/exchange-api
// jsDelivr is the primary source; the Cloudflare Pages mirror is the documented fallback.
const PRIMARY_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1'
const FALLBACK_BASE = 'https://latest.currency-api.pages.dev/v1'

export class CurrencyApiError extends Error {}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}

async function fetchWithFallback(path) {
  try {
    return await fetchJson(`${PRIMARY_BASE}${path}`)
  } catch (primaryError) {
    console.warn('jsDelivr request failed, trying Cloudflare mirror.', primaryError)
    try {
      return await fetchJson(`${FALLBACK_BASE}${path}`)
    } catch (fallbackError) {
      console.error('Cloudflare mirror also failed.', fallbackError)
      throw new CurrencyApiError('Unable to load exchange rates. Please try again.')
    }
  }
}

// Returns { usd: "US Dollar", eur: "Euro", ... }
export async function fetchCurrencies() {
  const data = await fetchWithFallback('/currencies.min.json')
  if (!data || typeof data !== 'object') {
    throw new CurrencyApiError('Unable to load the currency list. Please try again.')
  }
  return data
}

// Returns { date: "YYYY-MM-DD", rates: { eur: 0.92, inr: 88.1, ... } } for the given base currency.
export async function fetchCurrencyRates(currencyCode) {
  const code = currencyCode.toLowerCase()
  const data = await fetchWithFallback(`/currencies/${code}.json`)
  const rates = data?.[code]
  if (!rates || typeof rates !== 'object') {
    throw new CurrencyApiError('Exchange rate unavailable. Please try again.')
  }
  return { date: data.date, rates }
}
