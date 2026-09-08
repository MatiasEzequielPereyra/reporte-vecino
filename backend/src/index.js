import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

import './db.js'
import reportsRouter from './routes/reports.js'
import authRouter from './routes/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRouter)
app.use('/api/reports', reportsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReporteVecino API funcionando' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
  console.log(`📦 Base de datos SQLite en backend/data/reporte-vecino.db`)
})
