export const formatDt = (value: string) => {
  const sep = value.indexOf('T') > 0 ? 'T' : ' '
  const date = value.split(sep)[0]
  const time = value.split(sep)[1] ?? ''
  return { date: date.slice(-8), time: time.slice(0, 5) }
}

export const waveClass = (wave: number, large: boolean) => {
  const color = wave > 0 ? (large ? 'fx-buy-lg' : 'fx-buy') : large ? 'fx-sell-lg' : 'fx-sell'
  const bg = wave > 0 ? 'zz-bg-up' : 'zz-bg-dw'
  return `${color} ${bg}`
}

export const smaClass = (direction: number) => {
  if (direction === 1) return 'zz-sma-up'
  if (direction === 2) return 'zz-sma-up-s'
  if (direction === -1) return 'zz-sma-dw'
  if (direction === -2) return 'zz-sma-dw-s'
  return 'zz-sma-flat'
}
