import { loginHandler, logoutHandler } from '../controllers/auth.controller'
import { authGuard } from '../middlewares/auth.guard'
import { Cookie, Elysia, t } from 'elysia'
import { loginSchema } from '../schemas/auth'

export const authRoutes = new Elysia({ prefix: '/auth' })

  .post(
    '/login',
    async (ctx) => {
      // Passa o contexto completo para o handler
      return await loginHandler(ctx as any)
    },
    {
      body: loginSchema,
      detail: { tags: ['Auth'] },
    },
  )

  .post(
    '/logout',
    (ctx) => {
      const authCookie = ctx.cookie.auth
      if (!authCookie) {
        return { error: 'Cookie não encontrado' }
      }
      return logoutHandler(authCookie as Cookie<'auth'>)
    },
    {
      detail: { tags: ['Auth'] },
    },
  )

  .use(authGuard)
  .get(
    '/me',
    (ctx: { user?: { name: string } }) => ({
      message: ctx.user ? `Olá, ${ctx.user.name}` : 'Usuário não autenticado',
      user: ctx.user,
    }),
    {
      detail: { tags: ['Auth'] },
    },
  )
