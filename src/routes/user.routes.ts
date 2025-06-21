import { Elysia, t } from 'elysia'
import { userCreateSchema, userResponseSchema, userUpdateSchema } from '../schemas/user'

import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleSoftDeleteUser,
} from '../controllers/user.controller'

export const userRoutes = new Elysia({ prefix: '/users' })
  .get('/', handleGetAllUsers, {
    response: t.Array(userResponseSchema),
    detail: { tags: ['Users'] },
  })

  .get('/:id', async ({ params }) => handleGetUserById(params.id), {
    params: t.Object({ id: t.String() }),
    response: userResponseSchema,
    detail: { tags: ['Users'] },
  })

  .post(
    '/',
    async ({ body, set }) => {
      const user = await handleCreateUser(body)
      set.status = 201 // ← status aqui, na rota
      return user
    },
    {
      body: userCreateSchema,
      response: { 201: userResponseSchema },
      detail: { tags: ['Users'] },
    },
  )

  .patch('/:id', async ({ params, body }) => handleUpdateUser(params.id, body), {
    params: t.Object({ id: t.String() }),
    body: userUpdateSchema,
    response: userResponseSchema,
    detail: { tags: ['Users'] },
  })

  .delete('/:id', async ({ params }) => handleSoftDeleteUser(params.id), {
    params: t.Object({ id: t.String() }),
    response: t.Boolean(),
    detail: { tags: ['Users'] },
  })
