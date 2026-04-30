import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useAuthStore } from '#/store/auth-store'

export function useAuthRedirect() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) {
      navigate({ to: '/' })
      return
    }

    navigate({ to: '/auth' })
  }, [accessToken, navigate])
}
