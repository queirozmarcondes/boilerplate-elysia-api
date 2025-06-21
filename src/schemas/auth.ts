// schemas/auth.ts
import { t } from 'elysia'

//Schema de entrada para login
export const loginSchema = t.Object({
  email: t.String({ format: 'email' }),
  password: t.String({ minLength: 6 }),
})

//Tipagem de payload JWT que será assinado e verificado
export const jwtPayloadSchema = t.Object({
  id: t.String(),
  name: t.String(),
  email: t.String({ format: 'email' }),
  roles: t.Union([t.Literal('user'), t.Literal('admin'), t.Literal('moderator')]),
})

//TypeScript types para uso direto nas rotas
export type LoginInput = typeof loginSchema.static
export type JwtPayload = typeof jwtPayloadSchema.static
