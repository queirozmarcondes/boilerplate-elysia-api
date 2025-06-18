// routes/auth.routes.ts
import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwt({
    name: 'jwt',
    secret: 'your-secret-key', // Replace with your actual secret
    exp: '7d'
  }))
  // Rota para login e geração de token
  .get('/sign/:name', async ({ jwt, params: { name }, cookie: { auth } }) => {
    const token = await jwt.sign({ name })

    auth.set({
      value: token,
      httpOnly: true,
      maxAge: 7 * 86400, // 7 dias
      path: '/profile'
    })

    return { message: `Autenticado como ${name}`, token }
  }, {
    detail: {
      tags: ['Auth']
    },
    params: t.Object({
      name: t.String()
    })
  })

  // Rota protegida que lê o cookie
  .get('/profile', async ({ jwt, cookie: { auth }, set }) => {
    const payload = await jwt.verify(auth.value)

    if (!payload) {
      set.status = 401
      return { error: 'Unauthorized' }
    }

    return {
      message: `Bem-vindo ${payload.name}`,
      user: payload
    }
  }, {
    detail: {
      tags: ['Auth']
    }
  });
