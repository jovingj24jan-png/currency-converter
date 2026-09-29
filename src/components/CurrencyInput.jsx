import CurrencySelect from './CurrencySelect.jsx'

// One side of the converter: a label row, the amount (editable or read-only) and a currency picker.
export default function CurrencyInput({
  id,
  label,
  hint,
  amount,
  onAmountChange,
  readOnly = false,
  loading = false,
  error,
  currency,
  currencies,
  onCurrencyChange,
  inputRef,
}) {
  const errorId = `${id}-error`

  return (
    <div className={`currency-field ${error ? 'has-error' : ''}`}>
      <div className="field-labels">
        {readOnly ? (
          <span className="field-label" id={`${id}-label`}>{label}</span>
        ) : (
          <label className="field-label" htmlFor={id}>{label}</label>
        )}
        <span className="field-hint">{hint}</span>
      </div>

      {readOnly ? (
        <output
          id={id}
          className={`amount-display ${loading ? 'is-loading' : ''}`}
          aria-labelledby={`${id}-label`}
          aria-live="polite"
          aria-busy={loading}
        >
          {amount}
        </output>
      ) : (
        <input
          ref={inputRef}
          id={id}
          className="amount-input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck="false"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      )}

      {!readOnly && (
        <p className="field-error" id={errorId} role={error ? 'alert' : undefined}>
          {error && (
            <>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M10 6v5M10 14h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {error}
            </>
          )}
        </p>
      )}

      <CurrencySelect label={label} value={currency} currencies={currencies} onChange={onCurrencyChange} />
    </div>
  )
}
