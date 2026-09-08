import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import './db.js' // Inicializa la base de datos (crea tablas si no existen)
import reportsRouter from './routes/reports.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Rutas
app.use('/api/reports', reportsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ReporteVecino API funcionando' })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`)
  console.log(`📦 Base de datos SQLite en backend/data/reporte-vecino.db`)
})
