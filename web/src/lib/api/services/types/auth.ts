import type { AxiosResponse } from 'axios'

import type { ISO8601DateString } from '@/types/time'
import type { AxiosItemResponse } from '@/types/api'

import type { SignInData, User } from '../../models/user'

/** Native Authula sign-in body: no `{data}` envelope, tokens merged in. */
export type SignInResponse = SignInData & {
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  session: {
    id: string
    token: string
    expires_at: ISO8601DateString
  }
}

export type AuthResources = {
  signIn: (body: { email: string; password: string }) => Promise<AxiosResponse<SignInResponse>>
  me: () => Promise<AxiosItemResponse<User>>
  signOut: () => Promise<AxiosResponse<unknown>>
}
