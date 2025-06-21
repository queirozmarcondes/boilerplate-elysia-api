// validators/jwt.ts
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { jwtPayloadSchema } from '../../app/auth/schemas/auth'

export const CheckJwtPayload = TypeCompiler.Compile(jwtPayloadSchema)
