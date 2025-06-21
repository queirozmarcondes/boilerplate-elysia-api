// plugins/jwt.ts
import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'
import { environmentVariables } from '../config/env'

export const jwtPlugin = new Elysia().use(
  jwt({
    name: 'jwt',
    secret: environmentVariables.JWT.secret,
    exp: environmentVariables.JWT.exp,
    alg: environmentVariables.JWT.alg as 'HS256',
    iss: environmentVariables.JWT.iss,
    aud: environmentVariables.JWT.aud,
  }),
)

export type JwtPluginContext = typeof jwtPlugin
