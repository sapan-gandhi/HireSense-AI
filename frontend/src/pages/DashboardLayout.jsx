import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { ToastProvider } from '../components/Toast'

export default function DashboardLayout() {
  return (
    <ToastProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}
