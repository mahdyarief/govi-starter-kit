import type { ISO8601DateString } from '@/types/time'

/** Profile returned by GET /api/v1/me: govi's mirror of the Authula user. */
export interface User {
  id: string
  created_at: ISO8601DateString
  updated_at: ISO8601DateString
  name: string
  email: string
  image: string | null
  role: string
}

/** Tokens merged into the native Authula sign-in and refresh responses. */
export interface SignInData {
  access_token: string
  refresh_token: string
  expires_at?: ISO8601DateString
  expires_in?: number
}
