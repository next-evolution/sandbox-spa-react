import { useRef } from 'react'

interface Props {
  price: number
  scale: number
  isZeroError?: boolean
  size?: number
  result: (price: number) => void
}

export const InputPrice = ({ price, scale, isZeroError, size = 9, result }: Props) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '')
    const val = Number(Number(raw).toFixed(scale))
    if (!raw || val === 0) {
      if (isZeroError) {
        alert('0 error.')
        e.target.value = scale > 0 ? price.toFixed(scale) : price.toLocaleString()
        e.target.select()
      } else {
        result(0)
      }
    } else {
      result(val)
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      key={price}
      defaultValue={scale > 0 ? price.toFixed(scale) : price.toLocaleString()}
      size={size}
      className="sim-price-input"
      onClick={(e) => (e.target as HTMLInputElement).select()}
      onBlur={handleBlur}
    />
  )
}
