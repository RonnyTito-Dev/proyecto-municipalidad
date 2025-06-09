import { useState } from 'react'
import Sidebar from '../components/Private/Sidebar'
import Header from '../components/Private/Header'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  // Ancho del sidebar dependiendo del estado
  const sidebarWidth = sidebarCollapsed ? 95 : 270

  return (
    <>
      {/* Sidebar fijo */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Contenido principal con margen a la izquierda */}
      <div
        className="d-flex flex-column"
        style={{ marginLeft: sidebarWidth, minHeight: '100vh', transition: 'margin-left 0.3s ease' }}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <main className="p-4 bg-light flex-grow-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default DashboardLayout
