import { Elysia, t } from 'elysia'

import {
  handleCreateUser,
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUser,
  handleSoftDeleteUser,
} from '../controllers/user.controller'
import { userCreateSchema, userResponseSchema, userUpdateSchema } from '../schemas/user'

export const userRoutes = new Elysia({ prefix: '/users' })
  .get(
    '/',
    async () => {
      const users = await handleGetAllUsers()
      // Map roles to match the schema ("collaborator" -> "collaborator")
      return users.map((user: any) => ({
        ...user,
        roles: user.roles.map((role: string) => (role === 'collaborator' ? 'collaborator' : role)),
      }))
    },
    {
      response: t.Array(userResponseSchema),
      detail: { tags: ['Users'] },
    },
  )

  .get(
    '/:id',
    async ({ params }) => {
      const user = await handleGetUserById(params.id)
      // Map roles to match the schema ("collaborator" -> "collaborator") and filter allowed roles
      const allowedRoles = ['user', 'admin', 'collaborator'] as const
      return {
        ...user,
        roles: user.roles
          .map((role: string) => (role === 'collaborator' ? 'collaborator' : role))
          .filter((role: string): role is (typeof allowedRoles)[number] =>
            allowedRoles.includes(role as (typeof allowedRoles)[number]),
          ),
      }
    },
    {
      params: t.Object({ id: t.String() }),
      response: userResponseSchema,
      detail: { tags: ['Users'] },
    },
  )

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
