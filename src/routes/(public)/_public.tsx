import { createFileRoute, Link, useNavigate, Outlet, useLocation, redirect } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Search,
  ShieldCheck,
  Users,
  Loader2,
  FileDown,
  BookOpen,
  UserCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '#/store/auth-store'
import { logout, getCurrentUser } from '#/lib/api/auth'
import { toast } from 'sonner'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '#/components/ui/sidebar'

export const Route = createFileRoute('/(public)/_public')({
  beforeLoad: ({ location }) => {
    const { accessToken } = useAuthStore.getState()
    const isAuthPage = location.pathname.startsWith('/auth')

    if (!accessToken && !isAuthPage) {
      throw redirect({
        to: '/auth',
      })
    }

    if (accessToken && isAuthPage) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: LayoutComponent,
})

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Profiles', to: '/profile', icon: Users },
  { label: 'Search', to: '/search', icon: Search },
  { label: 'Export', to: '/export', icon: FileDown },
  { label: 'Account', to: '/account', icon: ShieldCheck },
]

function LayoutComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshToken, clearTokens, user, setUser, isAdmin } = useAuthStore()
  const [signingOut, setSigningOut] = useState(false)
  const [loading, setLoading] = useState(true)

  const isAuthPage = location.pathname.startsWith('/auth')

  useEffect(() => {
    if (isAuthPage) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData.data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Interceptor should handle 401, but just in case:
        if ((error as any).response?.status === 401) {
          navigate({ to: '/auth' })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [isAuthPage, setUser, navigate])

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

  if (isAuthPage) {
    return <Outlet />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-slate-900" />
          <p className="text-sm font-medium text-slate-500">Establishing secure session...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r border-slate-200 bg-white"
      >
        <SidebarHeader className="gap-4 p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <BookOpen className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">
                Insighta Labs+
              </p>
              <p className="truncate text-base font-semibold text-slate-950">
                Web Portal
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <Link to={item.to}>
                          <Icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {isAdmin() && (
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid gap-2 px-2 text-sm text-slate-600">
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2 text-xs">
                    Admin privileges enabled. You can create and delete profiles.
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              {user?.avatar_url ? (
                <img src={user.avatar_url} className="size-full rounded-full" alt="" />
              ) : (
                <UserCircle className="size-6" />
              )}
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="truncate text-sm font-semibold text-slate-950">
                @{user?.username || 'user'}
              </p>
              <p className="truncate text-xs text-slate-500 capitalize">
                {user?.role || 'Guest'}
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="min-h-svh bg-slate-50">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center justify-between px-4 py-4 lg:px-6">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <p className="text-sm text-slate-500">System context</p>
                  <h1 className="text-xl font-semibold tracking-tight">
                    {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-xs font-medium text-slate-500">Security Context</p>
                  <Badge 
                    variant={isAdmin() ? "default" : "secondary"} 
                    className="rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-bold"
                  >
                    {user?.role || 'Guest'}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  onClick={handleSignOut}
                  disabled={signingOut}
                >
                  {signingOut ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Log out
                </Button>
              </div>
            </div>
          </header>

          <main>
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
