import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '../../data')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'reporte-vecino.db')
const db = new Database(dbPath)

// Mejor rendimiento y seguridad
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Crear tablas si no existen
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'recibido',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id TEXT NOT NULL,
    status TEXT NOT NULL,
    comment TEXT,
    changed_at TEXT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
  CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at);
  CREATE INDEX IF NOT EXISTS idx_history_report ON status_history(report_id);
`)

export function getAllReports() {
  const reports = db.prepare(`
    SELECT id, category, description, lat, lng, photo_url as photoUrl,
           status, created_at as createdAt, updated_at as updatedAt
    FROM reports
    ORDER BY created_at DESC
  `).all()

  return reports
}

export function getReportById(id) {
  const report = db.prepare(`
    SELECT id, category, description, lat, lng, photo_url as photoUrl,
           status, created_at as createdAt, updated_at as updatedAt
    FROM reports
    WHERE id = ?
  `).get(id)

  if (!report) return null

  const history = db.prepare(`
    SELECT status, comment, changed_at as changedAt
    FROM status_history
    WHERE report_id = ?
    ORDER BY changed_at ASC
  `).all(id)

  return { ...report, history }
}

export function createReport({ id, category, description, lat, lng, photoUrl }) {
  const now = new Date().toISOString()

  const insertReport = db.prepare(`
    INSERT INTO reports (id, category, description, lat, lng, photo_url, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'recibido', ?, ?)
  `)

  const insertHistory = db.prepare(`
    INSERT INTO status_history (report_id, status, comment, changed_at)
    VALUES (?, 'recibido', 'Reporte recibido', ?)
  `)

  const tx = db.transaction(() => {
    insertReport.run(id, category, description || null, lat, lng, photoUrl || null, now, now)
    insertHistory.run(id, now)
  })

  tx()

  return getReportById(id)
}

export function updateStatus(id, status, comment) {
  const report = getReportById(id)
  if (!report) return null

  const now = new Date().toISOString()

  const updateReport = db.prepare(`
    UPDATE reports SET status = ?, updated_at = ? WHERE id = ?
  `)

  const insertHistory = db.prepare(`
    INSERT INTO status_history (report_id, status, comment, changed_at)
    VALUES (?, ?, ?, ?)
  `)

  const tx = db.transaction(() => {
    updateReport.run(status, now, id)
    insertHistory.run(id, status, comment || null, now)
  })

  tx()

  return getReportById(id)
}

export default db
