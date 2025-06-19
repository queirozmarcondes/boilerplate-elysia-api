// plugins/swagger.ts
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'

export const swaggerPlugin = new Elysia().use(
  swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'User API',
        version: '1.0.0',
        description: 'Documentação da API de usuários com Bun + Elysia'
      },
      tags: [
        {
          name: 'Users',
          description: 'Operações relacionadas a usuários'
        }
      ]
    },
  })
)
