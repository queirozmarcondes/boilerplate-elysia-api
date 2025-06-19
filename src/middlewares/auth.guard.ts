// middlewares/auth.guard.ts
import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt' // Make sure to install this package

export const authGuard = (app: Elysia) => 
  app
    .use(
      jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || 'your-secret-key' // Use environment variable
      })
    )
    .derive(async ({ jwt, cookie: { auth }, set }) => {
      const user = await jwt.verify(auth.value)

      if (!user) {
        set.status = 401
        throw new Error('Unauthorized')
      }

      return { user }
    })

    