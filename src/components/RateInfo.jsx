import { formatApiDate, formatRate } from '../utils/format.js'

export default function RateInfo({ from, to, rate, date, loading }) {
  const FROM = from.toUpperCase()
  const TO = to.toUpperCase()
  const hasRate = Number.isFinite(rate) && rate > 0

  const placeholder = loading ? 'Loading…' : '—'

  return (
    <dl className="rate-info">
      <div className="rate-row">
        <dt>Rate</dt>
        <dd>{hasRate ? `1 ${FROM} = ${formatRate(rate)} ${TO}` : placeholder}</dd>
      </div>
      <div className="rate-row">
        <dt>Inverse rate</dt>
        <dd>{hasRate ? `1 ${TO} = ${formatRate(1 / rate)} ${FROM}` : placeholder}</dd>
      </div>
      <div className="rate-row">
        <dt>Last updated</dt>
        <dd>{date ? formatApiDate(date) : placeholder}</dd>
      </div>
    </dl>
  )
}
