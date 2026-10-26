/** GET /health — liveness plus a real database ping, wrapped in the govi envelope. */
export type Health = {
  status: 'ok' | 'unavailable'
}
