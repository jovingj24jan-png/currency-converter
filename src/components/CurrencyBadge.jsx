import { getCurrencySymbol } from '../utils/format.js'

// Round badge showing the currency symbol (₹, $, €) or, for crypto, the first letters of the code.
export default function CurrencyBadge({ code, small = false }) {
  const symbol = getCurrencySymbol(code)
  const text = symbol ?? code.slice(0, 3).toUpperCase()
  const sizeClass = text.length > 2 ? 'is-long' : ''
  return (
    <span className={`currency-badge ${small ? 'is-small' : ''} ${sizeClass}`} aria-hidden="true">
      {text}
    </span>
  )
}
