export const BarType = {
  M15: '15M',
  H1: '1H',
  H4: '4H',
  D1: '1D',
} as const

export const BAR_TYPES_TRADE = [BarType.M15, BarType.H1, BarType.H4, BarType.D1] as const
export const BAR_TYPES_ANALYZE = [BarType.H1, BarType.H4, BarType.D1] as const
export const DEFAULT_BAR_TYPE = BarType.H1
