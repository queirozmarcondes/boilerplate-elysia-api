// routes/auth.routes.ts
import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt' // Make sure to install this package
import { mockUsers } from '../schemas/mock/users'
import { authGuard } from '../middlewares/auth.guard'

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Add JWT plugin first
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key' // Use environment variable
    })
  )
  
  // Login
  .post(
    '/login',
    async ({ body, jwt, cookie: { auth }, set }) => {
      const user = mockUsers.find(
        (u) => u.email === body.email && u.password === body.password
      )

      if (!user) {
        set.status = 401
        return { error: 'Credenciais inválidas' }
      }

      const token = await jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles
      })

      auth.set({
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 7 * 86400 // 7 dias
      })

      return { message: 'Login realizado com sucesso' }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 })
      }),
      detail: {
        tags: ['Auth']
      }
    }
  )

  // Logout
  .post(
    '/logout',
    ({ cookie: { auth } }) => {
      auth.remove()
      return { message: 'Logout realizado com sucesso' }
    },
    {
      detail: {
        tags: ['Auth']
      }
    }
  )

  // Rota protegida
  .use(authGuard)
  .get(
    '/me',
    ({ user }) => ({
      message: `Olá, ${user.name}`,
      user
    }),
    {
      detail: {
        tags: ['Auth']
      }
    }
  )