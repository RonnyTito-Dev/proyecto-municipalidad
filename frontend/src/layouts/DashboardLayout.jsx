// layouts/DashboardLayout.jsx

import { useState } from 'react'
import Sidebar from '../components/Private/Sidebar'
import Header from '../components/Private/Header'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />

      {/* Contenido principal */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Contenido dinámico según ruta */}
        <main className="p-4 bg-light flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
