import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [userRoleName, setUserRoleName] = useState('');
  const [userAreaName, setUserAreaName] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [userRes, rolesRes, areasRes] = await Promise.all([
        api.get('/auth/current'),
        api.get('/roles'),
        api.get('/areas')
      ]);

      const userData = userRes.data.user;
      const rolesData = rolesRes.data;
      const areasData = areasRes.data;

      setUser(userData);
      setRoles(rolesData);
      setAreas(areasData);

      const foundRole = rolesData.find(r => r.id === userData.rol_id);
      const foundArea = areasData.find(a => a.id === userData.area_id);

      setUserRoleName(foundRole ? foundRole.nombre : 'Rol desconocido');
      setUserAreaName(foundArea ? foundArea.nombre : 'Área desconocida');
    } catch (error) {
      console.error('Error de autenticación o carga de datos:', error);

      // 🔒 Si el error es de autenticación, cerramos sesión
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/', { replace: true });
      }
    }
  };

  fetchData();
}, []);


  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.post('/auth/logout');
        navigate('/', { replace: true });

        Swal.fire({
          title: '¡Sesión cerrada!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          position: 'top-end'
        });
      } catch (error) {
        console.error('Error cerrando sesión', error);
        Swal.fire('Error', 'No se pudo cerrar la sesión.', 'error');
      }
    }
  };

  const getInitial = (email) => email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <header className="header-container">
      <div className="header-brand">
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list"></i>
        </button>
        <h1 className="app-title">GESTIÓN MUNICIPAL</h1>
      </div>

      <div className="user-controls">
        <button className="notification-btn">
          <i className="bi bi-bell-fill"></i>
          <span className="notification-badge"></span>
        </button>

        <div className="user-dropdown">
          <button
            className="user-dropdown-btn"
            data-bs-toggle="dropdown"
          >
            <div className="user-avatar">
              {getInitial(user?.email_usuario)}
            </div>

            <div className="user-info">
              <div className="user-name">{user?.email_usuario || 'Usuario'}</div>
              <div className="user-role">
                {userRoleName} — {userAreaName}
              </div>
            </div>
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate('mi-cuenta')}
              >
                <i className="bi bi-person-circle me-2"></i>Mi cuenta
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button
                className="dropdown-item logout-btn"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;