import express from 'express'
import healthRoutes from './routes/health.routes.js'
import healthDbRoutes from './routes/health.db.routes.js'
import usersRoutes from './routes/users.routes.js'



const app = express()

app.use(express.json())

// registra as rotas
app.use(healthRoutes)
app.use(healthDbRoutes)
app.use('/users', usersRoutes)



const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend rodando em http://${HOST}:${PORT}`)
})
