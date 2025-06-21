import { getUserByEmail, verifyPassword } from '../services/auth.service'
import type { Cookie } from 'elysia'

export type AuthHandlerContext = {
  jwt: {
    sign: (payload: Record<string, any>) => Promise<string>
    verify: (token?: string) => Promise<any>
  }
  cookie: { auth: Cookie<'auth'> }
  set: { status: number }
  body: { email: string; password: string }
}

export async function loginHandler(ctx: AuthHandlerContext) {
  const { email, password } = ctx.body
  const {
    jwt,
    cookie: { auth },
    set,
  } = ctx

  const user = await getUserByEmail(email)
  if (!user || !(await verifyPassword(password, user.password))) {
    set.status = 401
    return { error: 'Credenciais inválidas' }
  }

  const token = await jwt.sign({
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
  })

  auth.set({
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 86400,
  })

  return { message: 'Login realizado com sucesso' }
}

export function logoutHandler(auth: Cookie<'auth'>) {
  auth.remove()
  return { message: 'Logout realizado com sucesso' }
}
