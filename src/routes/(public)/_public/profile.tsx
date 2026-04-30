import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/_public/profile')({
  component: () => <Outlet />,
})
