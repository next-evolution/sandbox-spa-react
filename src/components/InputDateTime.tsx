import { useRef } from 'react'

const RE_DATE = /^\d{8}$/
const RE_TIME = /^\d{6}$/

const getDateString = (v: string): string => {
  if (!v) return ''
  let s = ''
  if (RE_DATE.test(v)) {
    s = v
  } else if (v.length === 4) {
    s = `${new Date().getFullYear()}${v}`
  } else if (v.length === 6) {
    s = `20${v}`
  } else if (v.length === 10) {
    s = v.replace(/[/-]/g, '')
  }
  if (!RE_DATE.test(s)) return ''
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

const getTimeString = (v: string): string => {
  if (!v) return ''
  let t = v.replace(/:/g, '')
  if (t.length === 4) t = t + '00'
  if (!RE_TIME.test(t)) return ''
  return `${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}`
}

interface Props {
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}

export const InputDateTime = ({ value, disabled, onChange }: Props) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim()
    const parts = raw.split(' ')
    if (parts.length !== 2) {
      alert('input error.\n\nMMdd HHmm\nyyMMdd HHmm\nyyyyMMdd HHmm')
      return
    }
    const date = getDateString(parts[0])
    const time = getTimeString(parts[1])
    if (!date || !time) {
      alert('input error.\n\nMMdd HHmm\nyyMMdd HHmm\nyyyyMMdd HHmm')
      return
    }
    const m = -new Date().getTimezoneOffset()
    const pad2 = (n: number) => String(n).padStart(2, '0')
    const tz = `${m >= 0 ? '+' : '-'}${pad2(Math.floor(Math.abs(m) / 60))}:${pad2(Math.abs(m) % 60)}`
    onChange(`${date}T${time}${tz}`)
  }

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      key={value}
      defaultValue={value}
      disabled={disabled}
      maxLength={19}
      className="ei-name-input"
      style={{ width: 160, textAlign: 'center' }}
      onClick={() => ref.current?.select()}
      onBlur={handleBlur}
    />
  )
}
