// components/Header.jsx
import { NavLink } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h1 className="m-0">Sistema de Trámites</h1>
      <nav>
        <NavLink
          to="/crear-solicitud"
          className={({ isActive }) =>
            `me-3 text-decoration-none ${isActive ? 'fw-bold text-warning' : 'text-white'}`
          }
        >
          Crear Solicitud
        </NavLink>
        <NavLink
          to="/rastrear-solicitud"
          className={({ isActive }) =>
            `me-3 text-decoration-none ${isActive ? 'fw-bold text-warning' : 'text-white'}`
          }
        >
          Rastrear Solicitud
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `text-decoration-none ${isActive ? 'fw-bold text-warning' : 'text-white'}`
          }
        >
          Iniciar Sesión Colaboradores
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
