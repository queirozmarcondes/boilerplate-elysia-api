// plugins/jwt.ts
import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'

export const jwtPlugin = new Elysia().use(
  jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'your-secret-key',
    exp: '7d',
    alg: 'HS256',
    iss: 'your-issuer',
    aud: 'your-audience',
  })
)

export type JwtPluginContext = typeof jwtPlugin // ✅ exporta o tipo
