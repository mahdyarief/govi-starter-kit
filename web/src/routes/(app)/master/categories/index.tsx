import { createFileRoute } from '@tanstack/react-router'

import CategoryTable from '@/components/block/master/category/table'

export const Route = createFileRoute('/(app)/master/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Master data shared across the application. Search, add, and review entries here.
        </p>
      </div>

      <CategoryTable />
    </div>
  )
}
