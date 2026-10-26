import { authQueries } from './auth'
import { categoryQueries } from './category'
import { healthQueries } from './health'

export const queries = {
  health: healthQueries,
  auth: authQueries,
  categories: categoryQueries,
} as const
