import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import fs from 'fs'

const router = Router()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Asegurar carpeta de uploads
const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${uuidv4()}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes'))
    }
  }
})

// Almacenamiento en memoria (MVP). Después se reemplaza por base de datos.
const reports = []

// GET /api/reports
router.get('/', (req, res) => {
  res.json(reports)
})

// GET /api/reports/:id
router.get('/:id', (req, res) => {
  const report = reports.find(r => r.id === req.params.id)
  if (!report) {
    return res.status(404).json({ error: 'Reporte no encontrado' })
  }
  res.json(report)
})

// POST /api/reports
router.post('/', upload.single('photo'), (req, res) => {
  try {
    const { category, description, lat, lng } = req.body

    if (!category || !lat || !lng) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: category, lat, lng' })
    }

    const report = {
      id: uuidv4(),
      category,
      description: description || null,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'recibido',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: 'recibido',
          comment: 'Reporte recibido',
          changedAt: new Date().toISOString()
        }
      ]
    }

    reports.push(report)
    res.status(201).json(report)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al crear el reporte' })
  }
})

// PATCH /api/reports/:id/status  (para el panel admin)
router.patch('/:id/status', (req, res) => {
  const report = reports.find(r => r.id === req.params.id)
  if (!report) {
    return res.status(404).json({ error: 'Reporte no encontrado' })
  }

  const { status, comment } = req.body
  if (!status) {
    return res.status(400).json({ error: 'Falta el campo status' })
  }

  report.status = status
  report.updatedAt = new Date().toISOString()
  report.history.push({
    status,
    comment: comment || null,
    changedAt: new Date().toISOString()
  })

  res.json(report)
})

export default router
