import { sandboxApi } from '@/sandbox/api/sandboxApi'
import type { Country, CountrySearchRequest, CountrySearchResponse } from '@/sandbox/dto/fx/country'

export const searchCountries = async (
  req: CountrySearchRequest
): Promise<CountrySearchResponse> => {
  const res = await sandboxApi.post<CountrySearchResponse>('/v1/fx/country/search', req)
  return res.data
}

export const getCountry = async (code: string): Promise<Country> => {
  const res = await sandboxApi.get<Country>(`/v1/fx/country/${code}`)
  return res.data
}

export const insertCountry = async (country: Country): Promise<void> => {
  await sandboxApi.post('/v1/fx/country', { country })
}

export const updateCountry = async (code: string, country: Country): Promise<void> => {
  await sandboxApi.put(`/v1/fx/country/${code}`, { country })
}
