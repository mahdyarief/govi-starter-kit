import { createFileRoute } from '@tanstack/react-router'

import HealthCard from '@/components/block/dashboard/health-card'

export const Route = createFileRoute('/(app)/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Service status for this deployment. Master data lives under the sidebar menu.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <HealthCard />
      </div>
    </div>
  )
}
