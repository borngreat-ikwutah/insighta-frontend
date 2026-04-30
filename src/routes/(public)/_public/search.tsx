import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, Loader2, ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { searchProfiles, type Profile } from '#/lib/api/profiles'
import { toast } from 'sonner'
import { Badge } from '#/components/ui/badge'

export const Route = createFileRoute('/(public)/_public/search')({
  component: RouteComponent,
})

function RouteComponent() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    try {
      setLoading(true)
      const response = await searchProfiles({ q: query })
      setResults(response.data)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const suggestedQueries = [
    'young males from nigeria',
    'adult females in the united states',
    'high probability profiles from ghana',
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="size-5 text-slate-500" />
            Search profiles
          </CardTitle>
          <CardDescription>
            Use natural language or keywords to explore the dataset.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="e.g. young males from nigeria"
              className="h-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" className="rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Search'}
            </Button>
          </form>

          <div className="grid gap-3 md:grid-cols-3">
            {suggestedQueries.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item)
                  // Optional: trigger search immediately
                }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600 transition hover:bg-slate-100"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="mb-2 size-8 animate-spin" />
                <p>Analyzing dataset...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-3">
                {results.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {profile.name}
                        </span>
                        <Badge variant="secondary" className="rounded-full">
                          {profile.country_name}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {profile.age} years old · {profile.gender}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-400">
                          Match Prob.
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {(profile.gender_probability * 100).toFixed(0)}%
                        </p>
                      </div>
                      <Button asChild size="icon" variant="ghost" className="rounded-full">
                        <Link to="/profile/$profileId" params={{ profileId: profile.id }}>
                          <ArrowRight className="size-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
                No profiles matched your search criteria.
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Enter a query above to start searching the Insighta database.
              </div>
            )}
          </div>

          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
