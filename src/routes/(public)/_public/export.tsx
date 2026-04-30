import { createFileRoute, Link } from '@tanstack/react-router'
import { FileDown, Loader2, Search, ShieldCheck } from 'lucide-react'
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
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { exportProfiles, type ProfileQuery } from '#/lib/api/profiles'
import { toast } from 'sonner'

export const Route = createFileRoute('/(public)/_public/export')({
  component: RouteComponent,
})

function RouteComponent() {
  const [exporting, setExporting] = useState(false)
  const [query, setQuery] = useState<ProfileQuery>({})

  const handleFilterChange = (key: keyof ProfileQuery, value: any) => {
    setQuery((prev) => ({ ...prev, [key]: value || undefined }))
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const blob = await exportProfiles(query)

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `profiles_export_${new Date().toISOString().split('T')[0]}.csv`,
      )
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)

      toast.success('Export started successfully')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed. Please check your permissions.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileDown className="size-5 text-slate-500" />
            Export profiles
          </CardTitle>
          <CardDescription>
            Download filtered profile data as CSV with backend-generated export.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Filters */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Gender
              </Label>
              <Select
                value={query.gender || 'all'}
                onValueChange={(val) =>
                  handleFilterChange('gender', val === 'all' ? undefined : val)
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Age Group
              </Label>
              <Select
                value={query.age_group || 'all'}
                onValueChange={(val) =>
                  handleFilterChange(
                    'age_group',
                    val === 'all' ? undefined : val,
                  )
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="teenager">Teenager</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                Country ID
              </Label>
              <Input
                placeholder="e.g. US"
                className="rounded-xl uppercase h-10"
                maxLength={2}
                value={query.country_id || ''}
                onChange={(e) =>
                  handleFilterChange('country_id', e.target.value)
                }
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="ghost"
                className="w-full rounded-xl text-slate-500 hover:text-slate-900"
                onClick={() => setQuery({})}
              >
                Reset Configuration
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
            <h3 className="font-semibold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              Export Protocol
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your export will be generated server-side. The file will include
              all columns specified in the TRD:
              <code className="mx-1 rounded bg-slate-200 px-1 text-slate-800 text-[10px]">
                id, name, gender, age, country, probability, created_at
              </code>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              {['CSV Format', 'UTF-8 Encoding', 'Comma Delimited'].map(
                (item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="rounded-full bg-white px-3 py-1 text-[10px] uppercase font-bold text-slate-500"
                  >
                    {item}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              size="lg"
              className="rounded-xl px-8 h-12 bg-slate-950 text-white hover:bg-slate-800"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Generating Data Stream...
                </>
              ) : (
                <>
                  <FileDown className="mr-2 size-5" />
                  Initialize Export
                </>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 h-12"
            >
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
