import z from 'zod'

import { requiredString } from '@/lib/validation'

export const CategoryFormSchema = z.object({
  name: requiredString('name').max(100),
})

export type CategoryFormDto = z.infer<typeof CategoryFormSchema>
