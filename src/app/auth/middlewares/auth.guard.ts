import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { CheckJwtPayload } from '../../../utils/validators/jwt'
import type { JwtPayload } from '../schemas/auth'

export const authGuard = (app: Elysia) =>
  app
    .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
    .derive(async ({ jwt, cookie: { auth }, set }) => {
      const raw = await jwt.verify(auth.value)

      if (!raw || !CheckJwtPayload.Check(raw)) {
        set.status = 401
        return { error: 'Unauthorized' }
      }

      const { id, name, email, roles } = raw as JwtPayload
      const user: JwtPayload = { id, name, email, roles }

      return { user }
    })
