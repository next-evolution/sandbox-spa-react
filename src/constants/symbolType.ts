export const SYMBOL_TYPES = ['Trade', 'Analyze'] as const
export type SymbolType = (typeof SYMBOL_TYPES)[number]
export const DEFAULT_SYMBOL_TYPE: SymbolType = 'Trade'
