// schemas/user.ts
import { t } from 'elysia'

export const RoleEnum = t.Enum(
  {
    user: 'user',
    admin: 'admin',
    moderator: 'moderator',
  },
  {
    default: 'user',
  },
)

export const userBaseSchema = t.Object({
  name: t.String(),
  email: t.String({ format: 'email' }),
  telefone: t.String(),
  password: t.String({ minLength: 6 }),
  cpf: t.String(),
  isActive: t.Boolean({ default: true }),
  roles: RoleEnum,
})

export const userCreateSchema = userBaseSchema

export const userUpdateSchema = t.Partial(userBaseSchema)

export const userResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String({ format: 'email' }),
  telefone: t.String(),
  cpf: t.String(),
  isActive: t.Boolean(),
  roles: RoleEnum,
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' }),
})

