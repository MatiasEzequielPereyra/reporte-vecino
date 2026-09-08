import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { findUserByEmail } from '../db.js'
import { signToken, requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    const user = findUserByEmail(email.trim().toLowerCase())
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const ok = bcrypt.compareSync(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = signToken(user)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        municipality: user.municipality
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router
