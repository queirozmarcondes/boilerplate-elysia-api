// plugins/cors.ts
import { Elysia } from 'elysia'

export const corsPlugin = new Elysia()
  .derive(() => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['*']

    return {
      isOriginAllowed: (origin: string) =>
        allowedOrigins.includes('*') || allowedOrigins.includes(origin),
    }
  })
  .onAfterHandle(({ set, isOriginAllowed, request }) => {
    const origin = request.headers.get('origin')

    if (origin && isOriginAllowed(origin)) {
      set.headers = {
        ...Object.fromEntries(
          Object.entries(set.headers ?? {}).map(([k, v]) => [
            k,
            Array.isArray(v) ? v.join('; ') : v,
          ]),
        ),
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        Vary: 'Origin',
      }
    }
  })
  .options('*', ({ set }) => {
    set.status = 204 // No Content
  })
  .error({
    CORS_ERROR: class CORSValidationError extends Error {
      constructor() {
        super('CORS validation failed')
        this.name = 'CORSValidationError'
      }
    },
  })
