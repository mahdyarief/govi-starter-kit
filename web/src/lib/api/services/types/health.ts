import type { AxiosItemResponse } from '@/types/api'

import type { Health } from '../../models/health'

/** /health answers the standard govi envelope: `{ data: { status } }`. */
export type HealthResources = {
  get: () => Promise<AxiosItemResponse<Health>>
}
