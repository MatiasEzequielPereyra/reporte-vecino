import jwt from 'jsonwebtoken'
import { findUserById } from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'reporte-vecino-dev-secret-cambiar-en-produccion'

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado. Iniciá sesión.' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = findUserById(payload.id)
    if (!user) {
      return res.status(401).json({ error: 'Usuario no válido' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Sesión expirada. Iniciá sesión de nuevo.' })
  }
}
