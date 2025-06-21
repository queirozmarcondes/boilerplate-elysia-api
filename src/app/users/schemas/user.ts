import { t } from 'elysia'

const Role = t.Union([
  t.Literal('user'),
  t.Literal('admin'),
  t.Literal('collaborator')
])

const Base = {
  name: t.String(),
  email: t.String({ format: 'email' }),
  telefone: t.String(),
  password: t.String({ minLength: 6 }),
  cpf: t.String(),
  isActive: t.Boolean({ default: true }),
  roles: t.Array(Role)
}

export const userBaseSchema = t.Object(Base)

export const userCreateSchema = t.Object(Base, {
  example: {
    name: 'João Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    password: 'senhaSegura123',
    cpf: '12345678900',
    isActive: true,
    roles: ['collaborator']
  }
})

export const userUpdateSchema = t.Partial(userBaseSchema, {
  example: {
    email: 'joao.novo@example.com',
    telefone: '11988887777',
    password: 'novaSenha123',
    roles: ['admin']
  }
})

// export const userResponseSchema = t.Object({
//   id: t.String(),
//   ...Base,
//   createdAt: t.String({ format: 'date-time' }),
//   updatedAt: t.String({ format: 'date-time' })
// }, {
//   example: {
//     id: 'uuid-exemplo-123',
//     name: 'João Silva',
//     email: 'joao@example.com',
//     telefone: '11999999999',
//     cpf: '12345678900',
//     isActive: true,
//     roles: ['collaborator'],
//     createdAt: '2025-06-21T22:00:00.000Z',
//     updatedAt: '2025-06-21T22:00:00.000Z'
//   }
// })

export const userResponseSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String({ format: 'email' }),
  telefone: t.String(),
  cpf: t.String(),
  isActive: t.Boolean(),
  roles: t.Array(Role),
  createdAt: t.String({ format: 'date-time' }),
  updatedAt: t.String({ format: 'date-time' }),
}, {
  example: {
    id: 'uuid-exemplo-123',
    name: 'João Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    cpf: '12345678900',
    isActive: true,
    roles: ['collaborator'],
    createdAt: '2025-06-21T22:00:00.000Z',
    updatedAt: '2025-06-21T22:00:00.000Z'
  }
})
