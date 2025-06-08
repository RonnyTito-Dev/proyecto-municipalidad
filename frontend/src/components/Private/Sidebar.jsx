

import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../api/axiosInstance'

const Sidebar = ({ collapsed }) => {
    const [userRole, setUserRole] = useState(null)
    const [loading, setLoading] = useState(true)
    const [openMenus, setOpenMenus] = useState({})

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await api.get('/auth/current')
                setUserRole(data.user.rol_id)
            } catch (error) {
                console.error('Error obteniendo datos de usuario:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const toggleMenu = (label) => {
        setOpenMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }))
    }

    const allMenuItems = [
        { path: '/dashboard', label: 'Inicio', icon: 'bi-house-fill', roles: [1, 2, 3, 4] },
        {
            label: 'solicitudes', icon: 'bi-cart-fill', roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            subItems: [
                { path: '/dashboard/solicitudes/todas', label: 'Todas Las Solicitudes', icon: 'bi-clock-history', roles: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
                { path: '/dashboard/solicitudes/crear', label: 'Crear Solicitud', icon: 'bi-clock-history', roles: [1, 2, 4] },
                { path: '/dashboard/solicitudes/historial-estados', label: 'Historial de Estados', icon: 'bi-clock-history', roles: [1, 2] },
                { path: '/dashboard/solicitudes/notificaciones', label: 'Notificaciones', icon: 'bi-bell-fill', roles: [1, 2] }
            ]
        },
        { path: '/dashboard/areas', label: 'Áreas', icon: 'bi-people-fill', roles: [1, 2] },
        {
            label: 'Configuración', icon: 'bi-gear-fill', roles: [1, 2],
            subItems: [
                { path: '/canales-solicitud', label: 'Canales de Solicitud', icon: 'bi-diagram-3-fill', roles: [1, 2] },
                { path: '/configuracion/canales-notificacion', label: 'Canales de Notificación', icon: 'bi-broadcast-pin', roles: [1, 2] },
                { path: '/configuracion/estados-registro', label: 'Estados de Registro', icon: 'bi-ui-checks-grid', roles: [1, 2] },
                { path: '/configuracion/estados-usuario', label: 'Estados de Usuario', icon: 'bi-person-lines-fill', roles: [1, 2] },
                { path: '/configuracion/estados-solicitud', label: 'Estados de Solicitud', icon: 'bi-journal-text', roles: [1, 2] },
            ]
        },
        { path: '/dashboard/usuarios', label: 'Usuarios', icon: 'bi-person-badge-fill', roles: [1, 2] },
        { path: '/dashboard/roles', label: 'Roles', icon: 'bi-shield-lock-fill', roles: [1, 2] },
        { path: '/dashboard/logs', label: 'Registros', icon: 'bi-clipboard-data-fill', roles: [1, 2] },
        { path: '/dashboard/asistente', label: 'Asistente', icon: 'bi-chat-dots-fill', roles: [1, 2] }
    ]

    const filteredMenuItems = allMenuItems
        .filter(item => userRole && item.roles.includes(userRole))
        .map(item => {
            if (item.subItems) {
                const filteredSubs = item.subItems.filter(sub => sub.roles.includes(userRole))
                return { ...item, subItems: filteredSubs }
            }
            return item
        })

    if (loading) {
        return (
            <div className="sidebar-loading">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    return (
        <div className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-content">
                {filteredMenuItems.map((item) => (
                    <div key={item.label} className="menu-item">
                        {!item.subItems ? (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `menu-link ${isActive ? 'active' : ''}`
                                }
                                end
                            >
                                <span className="menu-icon">
                                    <i className={`bi ${item.icon}`}></i>
                                </span>
                                {!collapsed && <span className="menu-text">{item.label}</span>}
                            </NavLink>
                        ) : (
                            <>
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className={`menu-toggle ${openMenus[item.label] ? 'open' : ''}`}
                                >
                                    <span className="menu-icon">
                                        <i className={`bi ${item.icon}`}></i>
                                    </span>
                                    {!collapsed && <span className="menu-text">{item.label}</span>}
                                    {!collapsed && (
                                        <span className="menu-caret">
                                            <i className="bi bi-caret-down-fill"></i>
                                        </span>
                                    )}
                                </button>

                                {openMenus[item.label] && !collapsed && (
                                    <div className="submenu">
                                        {item.subItems.map(sub => (
                                            <NavLink
                                                key={sub.path}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `submenu-link ${isActive ? 'active' : ''}`
                                                }
                                                end
                                            >
                                                <span className="submenu-icon">
                                                    <i className={`bi ${sub.icon}`}></i>
                                                </span>
                                                {!collapsed && <span className="submenu-text">{sub.label}</span>}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
