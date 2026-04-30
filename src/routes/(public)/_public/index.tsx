import { createFileRoute, Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Loader2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { listProfiles } from '#/lib/api/profiles'

export const Route = createFileRoute('/(public)/_public/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [profileCount, setProfileCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await listProfiles({ limit: 1 })
        setProfileCount(response.total)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-10">
      <section className="grid gap-8">
        <Card className="overflow-hidden border-slate-200 bg-white shadow-md">
          <div className="bg-slate-950 p-10 text-white">
            <div className="mb-6">
              <Badge
                variant="secondary"
                className="rounded-full bg-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-800"
              >
                Operational Dashboard
              </Badge>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-bold tracking-tight">
                  Insighta Labs+
                </CardTitle>
                <CardDescription className="max-w-md text-lg text-slate-400">
                  Profile intelligence system for the Backend Engineering Track.
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-slate-950">
                  <Users className="size-8" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    Profiles Indexed
                  </p>
                  <p className="text-3xl font-bold">
                    {loading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      profileCount?.toLocaleString() ?? '0'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="flex flex-wrap gap-4 p-8">
            <Button asChild size="lg" className="h-12 rounded-xl px-8">
              <Link to="/profile">Explore Profiles</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8">
              <Link to="/search">Advanced Search</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-8 text-slate-600">
              <Link to="/export">Export Data</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <LayoutDashboard className="size-4" />
                </div>
                <CardTitle className="text-xl">Portal Shortcuts</CardTitle>
              </div>
              <CardDescription>
                Quick access to common administrative tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                { label: 'View All Profiles', href: '/profile' },
                { label: 'Natural Language Search', href: '/search' },
                { label: 'System Export', href: '/export' },
                { label: 'Account Settings', href: '/account' },
              ].map((item) => (
                <Button
                  key={item.label}
                  asChild
                  variant="ghost"
                  className="justify-start rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50"
                >
                  <Link to={item.href as any}>{item.label}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50 shadow-sm border-dashed">
            <CardHeader>
              <CardTitle className="text-xl">System Status</CardTitle>
              <CardDescription>
                Operational health and configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">API Status</span>
                <Badge className="bg-emerald-500 hover:bg-emerald-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Authentication</span>
                <span className="font-medium text-slate-900">OAuth Enabled</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Dataset Version</span>
                <span className="font-medium text-slate-900">Stage 3 (2026)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
