# Base de datos

## SQLite (desarrollo actual)

Los reportes se guardan en:

```
backend/data/reporte-vecino.db
```

Se crea automáticamente al iniciar el backend por primera vez.

### Tablas

**reports**
- id, category, description, lat, lng, photo_url, status, created_at, updated_at

**status_history**
- id, report_id, status, comment, changed_at

### Instalación

```bash
cd backend
npm install
npm run dev
```

`better-sqlite3` necesita compilar un módulo nativo. Si falla:

```bash
# En macOS puede hacer falta
xcode-select --install

# En Ubuntu/Debian
sudo apt install build-essential python3
```

### Migrar a PostgreSQL (más adelante)

Cuando el proyecto crezca o se entregue al municipio, se puede cambiar a PostgreSQL + PostGIS para consultas geoespaciales avanzadas. El esquema es compatible con pocas adaptaciones.
