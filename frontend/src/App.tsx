import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewReportPage from './pages/NewReportPage'
import ReportDetailPage from './pages/ReportDetailPage'
import AdminPage from './pages/AdminPage'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nuevo" element={<NewReportPage />} />
        <Route path="/reporte/:id" element={<ReportDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  )
}

export default App
