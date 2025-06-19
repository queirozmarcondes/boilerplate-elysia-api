import { Elysia } from 'elysia'
import { logger } from '../logger'

export const loggingPlugin = new Elysia()
  .decorate('logger', logger)
  .onRequest(({ request, logger }) => {
    logger.info({
      method: request.method,
      path: request.url,
      ip: request.headers.get('x-forwarded-for') || 'localhost'
    }, 'Request received')
  })
  .onError(({ error, request, logger }) => {
    logger.error({
      method: request.method,
      path: request.url,
      error: (error as Error).message ?? String(error),
      stack: process.env.NODE_ENV === 'development' && 'stack' in error ? (error as Error).stack : undefined
    }, 'Request error')
  })