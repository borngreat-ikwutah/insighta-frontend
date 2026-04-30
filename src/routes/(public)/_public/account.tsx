import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ShieldCheck, UserCircle2, Loader2, Mail, User, Clock } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { useAuthStore } from '#/store/auth-store'
import { logout } from '#/lib/api/auth'
import { toast } from 'sonner'

export const Route = createFileRoute('/(public)/_public/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { refreshToken, clearTokens, user } = useAuthStore()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      clearTokens()
      toast.success('Signed out successfully')
      navigate({ to: '/auth' })
      setSigningOut(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-950 h-32" />
        <CardHeader className="relative pb-0">
          <div className="absolute -top-12 left-6 ring-4 ring-white rounded-full bg-white">
            {user.avatar_url ? (
              <img src={user.avatar_url} className="size-24 rounded-full" alt={user.username} />
            ) : (
              <UserCircle2 className="size-24 text-slate-200" />
            )}
          </div>
          <div className="pt-14 flex items-end justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight text-slate-950">
                @{user.username}
              </CardTitle>
              <CardDescription className="text-slate-500">
                Member of Insighta Labs+ since {new Date(user.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="rounded-full px-4 py-1 uppercase text-[10px] font-bold">
                {user.role}
              </Badge>
              <Badge className="rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                Active Session
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 pt-10 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Mail className="size-3" />
              Email Address
            </div>
            <p className="text-slate-950 font-medium truncate">{user.email || 'No email provided'}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="size-3" />
              Access Level
            </div>
            <p className="text-slate-950 font-medium capitalize">{user.role}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Clock className="size-3" />
              Last Activity
            </div>
            <p className="text-slate-950 font-medium">{new Date(user.last_login_at).toLocaleString()}</p>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 p-6 md:col-span-3">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-950">Security Notice</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your session is authenticated via GitHub OAuth. Insighta Labs+ enforces role-based access control. 
                  {user.role === 'analyst' 
                    ? " You currently have read-only access to profiles." 
                    : " You have full administrative privileges to manage profile data."}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-4">
            <Button asChild variant="outline" className="rounded-xl h-11 px-8">
              <Link to="/">Dashboard</Link>
            </Button>
            <Button 
              className="rounded-xl h-11 px-8 bg-slate-950 text-white hover:bg-slate-800"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Terminate Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
