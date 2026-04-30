import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Globe, User, Hash, Shield, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '#/store/auth-store'
import { getProfile, type Profile, deleteProfile } from '#/lib/api/profiles'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { toast } from 'sonner'

export const Route = createFileRoute('/(public)/_public/profile/$profileId')({
  component: ProfileDetailComponent,
})

function ProfileDetailComponent() {
  const { profileId } = Route.useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const response = await getProfile(profileId)
        setProfile(response.data)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast.error('Failed to load profile details.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [profileId])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    try {
      setDeleting(true)
      await deleteProfile(profileId)
      toast.success('Profile deleted successfully')
      navigate({ to: '/profile' })
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Failed to delete profile. Admin role required.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Profile not found</h2>
        <Button asChild variant="link">
          <Link to="/profile">Back to profiles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-full">
            <Link to="/profile">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {profile.name}
            </h1>
            <p className="text-slate-500">Profile ID: {profile.id}</p>
          </div>
        </div>
        {useAuthStore.getState().isAdmin() && (
          <Button
            variant="ghost"
            className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Delete Profile
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Demographic details for this profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gender</p>
                <p className="text-sm font-semibold capitalize">{profile.gender}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Calendar className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Age / Group</p>
                <p className="text-sm font-semibold">{profile.age} years ({profile.age_group})</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Globe className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Country</p>
                <p className="text-sm font-semibold">{profile.country_name} ({profile.country_id})</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">System Insights</CardTitle>
            <CardDescription>AI-generated probabilities and metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Gender Probability</p>
                <Badge variant="secondary" className="rounded-full">
                  {(profile.gender_probability * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-slate-900 transition-all" 
                  style={{ width: `${profile.gender_probability * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">Country Probability</p>
                <Badge variant="secondary" className="rounded-full">
                  {(profile.country_probability * 100).toFixed(1)}%
                </Badge>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div 
                  className="h-full rounded-full bg-slate-900 transition-all" 
                  style={{ width: `${profile.country_probability * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="size-3" />
                Created at {new Date(profile.created_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
