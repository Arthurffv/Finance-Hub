import express from 'express'

const app = express()

/**
 * 1️⃣ Middlewares globais
 */
app.use(express.json())

/**
 * 2️⃣ Rota de saúde (teste)
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

/**
 * 3️⃣ Porta e host (Docker-friendly)
 */
const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend rodando em http://${HOST}:${PORT}`)
})
