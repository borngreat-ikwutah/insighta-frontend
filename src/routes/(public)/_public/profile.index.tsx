import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  Filter, 
  Plus, 
  Search, 
  Loader2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '#/store/auth-store'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Badge } from '#/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '#/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Label } from '#/components/ui/label'
import { 
  listProfiles, 
  type Profile, 
  deleteProfile, 
  createProfile,
  type ProfileQuery
} from '#/lib/api/profiles'
import { toast } from 'sonner'

export const Route = createFileRoute('/(public)/_public/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Query state
  const [query, setQuery] = useState<ProfileQuery>({
    page: 1,
    limit: 10,
    sort_by: 'created_at',
    order: 'desc',
  })

  // Pagination metadata
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  })

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true)
      const response = await listProfiles(query)
      setProfiles(response.data)
      setPagination({
        total: response.total,
        totalPages: response.total_pages,
      })
    } catch (error) {
      console.error('Failed to fetch profiles:', error)
      toast.error('Failed to load profiles. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const handleFilterChange = (key: keyof ProfileQuery, value: any) => {
    setQuery(prev => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const handleSort = (field: 'created_at' | 'age' | 'gender_probability') => {
    setQuery(prev => ({
      ...prev,
      sort_by: field,
      order: prev.sort_by === field && prev.order === 'desc' ? 'asc' : 'desc',
      page: 1
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    try {
      setDeletingId(id)
      await deleteProfile(id)
      toast.success('Profile deleted successfully')
      fetchProfiles()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete profile. Admin role required.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProfileName.trim()) return
    
    try {
      setIsCreating(true)
      await createProfile({ name: newProfileName })
      toast.success('Profile created successfully')
      setNewProfileName('')
      setIsAddDialogOpen(false)
      fetchProfiles()
    } catch (error) {
      console.error('Create failed:', error)
      toast.error('Failed to create profile. Admin role required.')
    } finally {
      setIsCreating(false)
    }
  }

  const SortIcon = ({ field }: { field: 'created_at' | 'age' | 'gender_probability' }) => {
    if (query.sort_by !== field) return <ArrowUpDown className="ml-2 size-3" />
    return query.order === 'asc' ? <ArrowUp className="ml-2 size-3" /> : <ArrowDown className="ml-2 size-3" />
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-2xl">Profiles</CardTitle>
            <CardDescription>
              Browse, filter, and open profile details.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {useAuthStore.getState().isAdmin() && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl">
                    <Plus className="mr-2 size-4" />
                    Add Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleCreate}>
                    <DialogHeader>
                      <DialogTitle>Add Profile</DialogTitle>
                      <DialogDescription>
                        Create a new profile entry in the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g. Harriet Tubman"
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isCreating} className="rounded-xl w-full">
                        {isCreating ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                        Create Profile
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/">Back to dashboard</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wider">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Name..." 
                  className="pl-9 rounded-xl"
                  value={query.q || ''}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-500 uppercase tracking-wider">Gender</Label>
              <Select 
                value={query.gender || 'all'} 
                onValueChange={(val) => handleFilterChange('gender', val === 'all' ? undefined : val)}
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
              <Label className="text-xs text-slate-500 uppercase tracking-wider">Age Group</Label>
              <Select 
                value={query.age_group || 'all'} 
                onValueChange={(val) => handleFilterChange('age_group', val === 'all' ? undefined : val)}
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
              <Label className="text-xs text-slate-500 uppercase tracking-wider">Country ID</Label>
              <Input 
                placeholder="e.g. US" 
                className="rounded-xl uppercase"
                maxLength={2}
                value={query.country_id || ''}
                onChange={(e) => handleFilterChange('country_id', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full rounded-xl"
                onClick={() => setQuery({ page: 1, limit: 10, sort_by: 'created_at', order: 'desc' })}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Gender</th>
                  <th 
                    className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('age')}
                  >
                    <div className="flex items-center">
                      Age <SortIcon field="age" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th 
                    className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('gender_probability')}
                  >
                    <div className="flex items-center">
                      Probability <SortIcon field="gender_probability" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 font-medium cursor-pointer hover:text-slate-900 transition-colors"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      Created <SortIcon field="created_at" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading && profiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="size-8 animate-spin" />
                        <p className="font-medium">Loading profiles...</p>
                      </div>
                    </td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      No profiles found matching your filters.
                    </td>
                  </tr>
                ) : (
                  profiles.map((profile) => (
                    <tr key={profile.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-semibold text-slate-950">
                        {profile.name}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="capitalize rounded-full font-medium">
                          {profile.gender}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {profile.age} <span className="text-xs text-slate-400 capitalize">({profile.age_group})</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 font-medium">
                        {profile.country_name} <span className="text-xs text-slate-400 uppercase">({profile.country_id})</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-950" 
                              style={{ width: `${profile.gender_probability * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {(profile.gender_probability * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-xs">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8"
                          >
                            <Link to="/profile/$profileId" params={{ profileId: profile.id }}>
                              View
                            </Link>
                          </Button>
                          {useAuthStore.getState().isAdmin() && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-xl size-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(profile.id)}
                              disabled={deletingId === profile.id}
                            >
                              {deletingId === profile.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-950">{profiles.length}</span> of <span className="text-slate-950">{pagination.total}</span> profiles
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9"
                onClick={() => setQuery(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                disabled={query.page === 1 || loading}
              >
                <ChevronLeft className="mr-2 size-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-slate-950 px-3">
                  Page {query.page} of {pagination.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9"
                onClick={() => setQuery(prev => ({ ...prev, page: Math.min(pagination.totalPages, (prev.page || 1) + 1) }))}
                disabled={query.page === pagination.totalPages || loading}
              >
                Next
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
