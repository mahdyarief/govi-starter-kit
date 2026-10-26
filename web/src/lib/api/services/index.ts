import { authServices } from './auth'
import { categoryServices } from './category'
import { healthServices } from './health'

export const services = {
  health: healthServices,
  auth: authServices,
  categories: categoryServices,
} as const
