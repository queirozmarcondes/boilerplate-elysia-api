// index.ts
import { Elysia } from 'elysia'
import { swaggerPlugin } from './plugins/swagger'
import { userRoutes } from './routes/user.routes'

new Elysia()
    .use(swaggerPlugin)
    .use(userRoutes)
    .listen(3000)

console.log(`🚀 Server running at http://localhost:3000`)
