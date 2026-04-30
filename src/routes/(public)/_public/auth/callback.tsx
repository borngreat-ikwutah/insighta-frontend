import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '#/store/auth-store'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const callbackSearchSchema = z.object({
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/(public)/_public/auth/callback')({
  validateSearch: (search) => callbackSearchSchema.parse(search),
  component: CallbackComponent,
})

function CallbackComponent() {
  const navigate = useNavigate()
  const { access_token, refresh_token, error } = Route.useSearch()
  const setTokens = useAuthStore((state) => state.setTokens)

  useEffect(() => {
    if (error) {
      toast.error(`Authentication failed: ${error}`)
      navigate({ to: '/auth' })
      return
    }

    if (access_token && refresh_token) {
      setTokens({ accessToken: access_token, refreshToken: refresh_token })
      toast.success('Successfully authenticated')
      navigate({ to: '/' })
    } else {
      toast.error('Missing authentication tokens')
      navigate({ to: '/auth' })
    }
  }, [access_token, refresh_token, error, setTokens, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-10 animate-spin text-slate-900" />
        <p className="text-sm font-medium text-slate-500">Finalizing authentication...</p>
      </div>
    </div>
  )
}
