import { throwAxiosError } from '../api/axios-error'
import { services } from '../api/services'
import { clearAuthTokens, setAuthTokens } from './token-storage'

interface SignInWithEmailParams {
  email: string
  password: string
}

/**
 * Authenticate against the Go API (VITE_API_URL) with email + password.
 * Authula answers without the `{data}` envelope: the tokens sit at the top
 * level, next to the user and session objects.
 */
export async function signInWithEmail({ email, password }: SignInWithEmailParams) {
  try {
    const res = await services.auth.signIn({ email, password })
    const payload = res?.data

    if (!payload?.access_token) {
      throw new Error('Sign-in response did not include an access token')
    }

    setAuthTokens({
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      expiresIn: payload.expires_in,
    })

    return payload
  } catch (error) {
    throwAxiosError(error as Error)
  }
}

/**
 * Sign out: the API ends the session, then the stored tokens are dropped.
 * Best-effort — a session that is already gone still leaves the client signed out.
 */
export async function signOut() {
  try {
    await services.auth.signOut()
  } catch {
    // Ignore: there is no session left to end.
  } finally {
    clearAuthTokens()
  }
}
