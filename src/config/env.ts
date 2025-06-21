import { requiredEnv } from '../utils/validators/env.validation'

export const environmentVariables = {
  PORT: Number(process.env.PORT) || 3000,

  JWT: {
    secret: requiredEnv('JWT_SECRET'),
    exp: process.env.JWT_EXPIRATION || '7d',
    alg: (process.env.JWT_ALGORITHM || 'HS256') as 'HS256',
    iss: requiredEnv('JWT_ISSUER'),
    aud: requiredEnv('JWT_AUDIENCE'),
  },
}
