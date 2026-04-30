import { createFileRoute } from '@tanstack/react-router'

import insightaLogoUrl from '#/assets/insighta-labs-logo.svg?url'
import githubLogoUrl from '#/assets/github-logo.svg?url'

import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'

export const Route = createFileRoute('/(public)/_public/auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  const handleGithubLogin = () => {
    const apiBaseUrl =
      import.meta.env.VITE_API_BASE_URL ?? window.location.origin
    window.location.assign(`${apiBaseUrl}/auth/github`)
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <CardHeader className="space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-transparent">
              <img
                src={insightaLogoUrl}
                alt="Insighta Labs"
                className="h-12 w-12"
              />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">
                Insighta Labs
              </CardTitle>
              <CardDescription className="text-sm text-slate-500">
                Web Portal
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              className="h-12 w-full rounded-xl bg-black text-white hover:bg-slate-800"
              size="lg"
              onClick={handleGithubLogin}
            >
              <img
                src={githubLogoUrl}
                alt="GitHub"
                className="mr-2 size-7 shrink-0 p-0.5"
              />
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
