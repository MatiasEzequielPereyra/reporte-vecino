import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewReportPage from './pages/NewReportPage'
import ReportDetailPage from './pages/ReportDetailPage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import Layout from './components/Layout'
import { useAuth } from './lib/auth'

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 40, textAlign: 'center' }}>
        Cargando...
      </div>
    )
  }
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nuevo" element={<NewReportPage />} />
        <Route path="/reporte/:id" element={<ReportDetailPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminPage />
            </AdminGuard>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
