// routes/users.ts
import { Elysia, t } from 'elysia'
import { userCreateSchema, userResponseSchema, userUpdateSchema } from '../schemas/user'

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} from '../services/user.service'

export const userRoutes = new Elysia({ prefix: '/users' })
  // Listar todos
  .get('/', async () => await getAllUsers(), {
    response: t.Array(userResponseSchema),
    detail: {
      tags: ['Users'],
    },
  })
  // Buscar por ID
  .get(
    '/:id',
    async ({ params }) => {
      const user = await getUserById(params.id)
      if (!user) {
        throw new Error(`Usuário ${params.id} não encontrado`)
      }
      return user
    },
    {
      params: t.Object({ id: t.String() }),
      response: userResponseSchema,
      detail: { tags: ['Users'] },
    },
  )

  // Criar novo usuário
  .post(
    '/',
    async ({ body }) => {
      return await createUser(body)
    },
    {
      body: userCreateSchema,
      response: userResponseSchema,
      detail: { tags: ['Users'] },
    },
  )
  // Atualizar parcialmente
  .patch(
    '/:id',
    async ({ params, body }) => {
      const updated = await updateUser(params.id, body)
      if (!updated) {
        throw new Error(`Usuário ${params.id} não encontrado`)
      }
      return updated
    },
    {
      params: t.Object({ id: t.String() }),
      body: userUpdateSchema,
      response: userResponseSchema,
      detail: { tags: ['Users'] },
    },
  )

  // Soft delete (desativar)
  .delete(
    '/:id',
    async ({ params }) => {
      const ok = await softDeleteUser(params.id)
      return ok
    },
    {
      params: t.Object({ id: t.String() }),
      response: t.Boolean(),
      detail: { tags: ['Users'] },
    },
  )
