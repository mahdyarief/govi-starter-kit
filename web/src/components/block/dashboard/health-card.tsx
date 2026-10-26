import { useQuery } from '@tanstack/react-query'

import SectionCard from '@/components/block/common/section-card'
import { Badge } from '@/components/ui/badge'
import { axiosErrorMessage } from '@/lib/api/axios-error'
import { queries } from '@/lib/api/queries'

/** API liveness, polled by the health query. */
export default function HealthCard() {
  const { data, isLoading, isError, error } = useQuery(queries.health.get())

  return (
    <SectionCard title="API health" description="GET /health — refreshed every 30 seconds.">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Checking...</p>
      ) : isError ? (
        <p className="text-sm text-destructive">{axiosErrorMessage(error)}</p>
      ) : (
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Database-backed API</span>
          <Badge variant={data?.status === 'ok' ? 'success' : 'destructive'}>
            {data?.status ?? 'unknown'}
          </Badge>
        </div>
      )}
    </SectionCard>
  )
}
