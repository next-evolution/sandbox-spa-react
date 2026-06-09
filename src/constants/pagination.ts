export const PAGE_SIZES = [10, 20, 50, 100, 200] as const
export type PageSize = (typeof PAGE_SIZES)[number]
export const DEFAULT_PAGE_SIZE: PageSize = 20

export const PAGE_SIZES_LARGE = [100, 200, 500] as const
export const DEFAULT_PAGE_SIZE_LARGE = 200
