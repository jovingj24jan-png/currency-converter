import { useEffect, useId, useMemo, useRef, useState } from 'react'
import CurrencyBadge from './CurrencyBadge.jsx'

// Shown first in the list because most people look for these.
const POPULAR = ['usd', 'eur', 'inr', 'gbp', 'jpy', 'aud', 'cad', 'chf', 'cny', 'aed', 'sgd', 'btc', 'eth']

// A searchable dropdown. Keyboard: type to filter, ↑/↓ to move, Enter to pick, Esc to close.
export default function CurrencySelect({ label, value, currencies, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapperRef = useRef(null)
  const buttonRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)
  const baseId = useId()
  const listId = `${baseId}-list`

  const selectedName = currencies[value] || ''

  const options = useMemo(() => {
    const q = query.trim().toLowerCase()
    const all = Object.entries(currencies)
      .filter(([code, name]) => code && name)
      .map(([code, name]) => ({ code, name }))
    const matches = q
      ? all.filter((c) => c.code.includes(q) || c.name.toLowerCase().includes(q))
      : all
    return matches.sort((a, b) => {
      if (q) {
        // Exact code match first, e.g. typing "inr" puts INR on top.
        if (a.code === q) return -1
        if (b.code === q) return 1
      }
      const pa = POPULAR.indexOf(a.code)
      const pb = POPULAR.indexOf(b.code)
      if (pa !== -1 || pb !== -1) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb)
      return a.code.localeCompare(b.code)
    })
  }, [currencies, query])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    searchRef.current?.focus({ preventScroll: true })
    // On small screens the list can open below the fold, so bring it into view.
    searchRef.current?.closest('.currency-popover')?.scrollIntoView({ block: 'nearest' })
  }, [open])

  useEffect(() => {
    if (!open) return
    const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`)
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  function openList() {
    setQuery('')
    setActiveIndex(0)
    setOpen(true)
  }

  function choose(code) {
    onChange(code)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onSearchKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (options[activeIndex]) choose(options[activeIndex].code)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      buttonRef.current?.focus()
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="currency-select" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className="currency-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value.toUpperCase()} ${selectedName}. Change currency`}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
      >
        <CurrencyBadge code={value} />
        <span className="currency-trigger-text">
          <span className="currency-code">{value.toUpperCase()}</span>
          <span className="currency-name">{selectedName}</span>
        </span>
        <svg className="chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="currency-popover">
          <label className="visually-hidden" htmlFor={`${baseId}-search`}>
            Search currencies
          </label>
          <input
            ref={searchRef}
            id={`${baseId}-search`}
            className="currency-search"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={options[activeIndex] ? `${baseId}-opt-${options[activeIndex].code}` : undefined}
            placeholder="Search e.g. INR or Euro"
            autoComplete="off"
            spellCheck="false"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onSearchKeyDown}
          />
          <ul className="currency-list" id={listId} role="listbox" aria-label={`${label} currency`} ref={listRef}>
            {options.length === 0 && <li className="currency-empty">No currency matches “{query}”.</li>}
            {options.map((option, index) => (
              <li
                key={option.code}
                id={`${baseId}-opt-${option.code}`}
                data-index={index}
                role="option"
                aria-selected={option.code === value}
                className={`currency-option ${index === activeIndex ? 'is-active' : ''}`}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => choose(option.code)}
              >
                <CurrencyBadge code={option.code} small />
                <span className="currency-code">{option.code.toUpperCase()}</span>
                <span className="currency-name">{option.name}</span>
                {option.code === value && (
                  <svg className="check" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
