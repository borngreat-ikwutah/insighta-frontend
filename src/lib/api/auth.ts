import { apiClient } from './client'

export async function logout(refreshToken: string) {
  const response = await apiClient.post('/auth/logout', {
    refresh_token: refreshToken,
  })
  return response.data
}

export async function refreshSession(refreshToken: string) {
  const response = await apiClient.post('/auth/refresh', {
    refresh_token: refreshToken,
  })
  return response.data
}

export interface User {
  id: string
  github_id: string
  username: string
  email: string
  avatar_url: string
  role: 'admin' | 'analyst'
  is_active: boolean
  last_login_at: string
  created_at: string
}

export async function getCurrentUser() {
  const response = await apiClient.get<{ status: string; data: User }>('/auth/whoami')
  return response.data
}
