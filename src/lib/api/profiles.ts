import { apiClient } from './client'

export interface Profile {
  id: string
  name: string
  gender: 'male' | 'female'
  gender_probability: number
  age: number
  age_group: 'child' | 'teenager' | 'adult' | 'senior'
  country_id: string
  country_name: string
  country_probability: number
  created_at: string
}

export interface ProfileQuery {
  gender?: 'male' | 'female'
  country_id?: string
  age_group?: 'child' | 'teenager' | 'adult' | 'senior'
  min_age?: number
  max_age?: number
  min_gender_probability?: number
  min_country_probability?: number
  page?: number
  limit?: number
  sort_by?: 'created_at' | 'age' | 'gender_probability'
  order?: 'asc' | 'desc'
  q?: string
}

export interface ProfileListResponse {
  status: string
  page: number
  limit: number
  total: number
  total_pages: number
  links: {
    self: string
    next: string | null
    prev: string | null
  }
  data: Profile[]
}

export async function listProfiles(params: ProfileQuery = {}) {
  const response = await apiClient.get<ProfileListResponse>('/api/profiles', {
    params,
    headers: {
      'X-API-Version': '1',
    },
  })
  return response.data
}

export async function searchProfiles(params: ProfileQuery = {}) {
  const response = await apiClient.get<ProfileListResponse>(
    '/api/profiles/search',
    {
      params,
      headers: {
        'X-API-Version': '1',
      },
    },
  )
  return response.data
}

export async function getProfile(id: string) {
  const response = await apiClient.get<{ status: string; data: Profile }>(
    `/api/profiles/${id}`,
    {
      headers: {
        'X-API-Version': '1',
      },
    },
  )
  return response.data
}

export async function createProfile(data: { name: string }) {
  const response = await apiClient.post<{ status: string; data: Profile }>(
    '/api/profiles',
    data,
    {
      headers: {
        'X-API-Version': '1',
      },
    },
  )
  return response.data
}

export async function deleteProfile(id: string) {
  await apiClient.delete(`/api/profiles/${id}`, {
    headers: {
      'X-API-Version': '1',
    },
  })
}

export async function exportProfiles(params: ProfileQuery = {}) {
  const response = await apiClient.get('/api/profiles/export', {
    params: { ...params, format: 'csv' },
    responseType: 'blob',
    headers: {
      'X-API-Version': '1',
    },
  })
  return response.data
}
