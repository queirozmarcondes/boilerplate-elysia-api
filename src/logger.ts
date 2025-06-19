import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'info',
        options: { colorize: true }
      },
      ...(process.env.NODE_ENV === 'production'
        ? [{
            target: 'pino/file',
            level: 'error',
            options: { destination: 'logs/error.log' }
          }]
        : [])
    ]
  }
})

// Tipos para o contexto do Elysia