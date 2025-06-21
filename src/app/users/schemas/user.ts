import { t } from 'elysia'

// Define os valores possíveis de roles
const RoleLiteral = t.Union([t.Literal('user'), t.Literal('admin'), t.Literal('moderator')])

export const userBaseSchema = t.Object({
  name: t.String(),
  email: t.String({ format: 'email' }),
  telefone: t.String(),
  password: t.String({ minLength: 6 }),
  cpf: t.String(),
  isActive: t.Boolean({ default: true }),
  roles: t.Array(RoleLiteral), // <-- Agora é um array de roles válidos
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
  roles: t.Array(RoleLiteral), // <-- Corrigido também aqui
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' }),
})
