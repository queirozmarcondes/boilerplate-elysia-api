// validators/jwt.ts
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { jwtPayloadSchema } from '../../schemas/auth'

export const CheckJwtPayload = TypeCompiler.Compile(jwtPayloadSchema)
