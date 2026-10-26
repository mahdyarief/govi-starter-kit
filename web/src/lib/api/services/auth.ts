import type { SignInDto } from '../dtos/auth/schema'
import type { AuthResources } from './types/auth'
import { api } from '../client-fetch'

/** Authula is mounted here by the Go API (cmd/api/authula.go). */
const path = '/api/v1/auth'

const resources = (): AuthResources => ({
  signIn: (body: SignInDto) => api.post(`${path}/email-password/sign-in`, body),
  // govi's own profile endpoint: it adds the application role Authula lacks.
  me: () => api.get('/api/v1/me'),
  signOut: () => api.post(`${path}/sign-out`),
})

export const authServices = resources()
