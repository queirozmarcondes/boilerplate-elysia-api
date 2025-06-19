// index.ts
import { Elysia } from 'elysia'
import { swaggerPlugin } from './plugins/swagger'
import { userRoutes } from './routes/user.routes'
import { jwtPlugin } from './plugins/jwt'
import { authRoutes } from './routes/auth.routes'
import { corsPlugin } from './plugins/cors'
import { logger } from './logger'


const app = new Elysia()
  // Plugins (CORS primeiro)
  .use(corsPlugin)
  .use(swaggerPlugin)
  .use(jwtPlugin)

  // Rotas
  .use(authRoutes)
  .use(userRoutes)

  // Health Check
  .get('/status', () => ({
    status: 'up',
    timestamp: new Date().toISOString()
  }), {
    detail: {
      tags: ['System'],
      description: 'Verifica se a API está online'
    }
  })


// Inicia o servidor
app.listen(3000, ({ hostname, port }) => {
  logger.info(`🚀 Servidor rodando em http://${hostname}:${port}`)
  logger.info(`📄 Docs: http://${hostname}:${port}/docs`)
})

// Shutdown graceful
process.on('SIGINT', () => {
  logger.info('Encerrando servidor...')
  process.exit(0)
})