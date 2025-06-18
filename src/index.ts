// index.ts
import { Elysia } from 'elysia'
import { swaggerPlugin } from './plugins/swagger'
import { userRoutes } from './routes/user.routes'
import { jwtPlugin } from './plugins/jwt'
import { authRoutes } from './routes/auth.routes'

new Elysia()
    .use(swaggerPlugin)
    .use(jwtPlugin)
    .use(authRoutes)
    .use(userRoutes)
    .listen(3000)

console.log(`🚀 Server running at http://localhost:3000`)
