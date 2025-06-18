// routes/users.ts
import { Elysia, t } from 'elysia'
import {
    userCreateSchema,
    userResponseSchema,
    userUpdateSchema
} from '../schemas/user'

export const userRoutes = new Elysia({ prefix: '/users' })
    // Listar todos
    .get(
        '/',
        () => {
            return [] // Exemplo: retornar array vazio ou simulado
        },
        {
            response: t.Array(userResponseSchema),
            detail: {
                tags: ['Users']
            }
        }
    )
    // Buscar por ID
    .get(
        '/:id',
        ({ params }) => {
            return {
                id: params.id,
                name: 'Renato',
                email: 'renato@example.com',
                telefone: '11999999999',
                password: '********',
                cpf: '12345678900',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                roles: 'user'
            }
        },
        {
            params: t.Object({
                id: t.String()
            }),
            response: userResponseSchema,
            detail: {
                tags: ['Users']
            }
        }
    )
    // Criar novo usuário
    .post(
        '/',
        ({ body }) => {
            return {
                id: crypto.randomUUID(),
                ...body,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        },
        {
            body: userCreateSchema,
            response: userResponseSchema,
            detail: {
                tags: ['Users']
            }
        }
    )
    // Atualizar parcialmente
  .patch(
  '/:id',
  ({ params, body }) => {
    return {
      id: params.id,
      name: body.name ?? 'Renato Atualizado',
      email: body.email ?? 'renato@atualizado.com',
      telefone: body.telefone ?? '11999999999',
      password: body.password ?? '********',
      cpf: body.cpf ?? '12345678900',
      isActive: body.isActive ?? true,
      roles: body.roles ?? 'user',
      createdAt: new Date().toISOString(), // necessário!
      updatedAt: new Date().toISOString()
    }
  },
  {
    params: t.Object({
      id: t.String()
    }),
    body: userUpdateSchema,
    response: userResponseSchema,
    detail: {
      tags: ['Users']
    }
  }
)
