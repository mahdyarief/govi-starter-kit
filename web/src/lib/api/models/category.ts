import type { ISO8601DateString } from '@/types/time'

/** Master-data category, mirroring server/internal/models/category.go. */
export interface Category {
  id: string
  name: string
  created_at: ISO8601DateString
  updated_at: ISO8601DateString
  deleted_at?: ISO8601DateString | null
}
