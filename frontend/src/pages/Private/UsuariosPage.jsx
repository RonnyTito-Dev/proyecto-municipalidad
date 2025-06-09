// src/pages/Private/ListaUsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import './UsuariosPage.css';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [usuariosRes, rolesRes, areasRes] = await Promise.all([
          axios.get('/usuarios'),
          axios.get('/roles'),
          axios.get('/areas')
        ]);
        
        setUsuarios(usuariosRes.data);
        setRoles(rolesRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        toast.error('Error al cargar los datos');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    // Filtro por estado
    const estadoFiltro = filtro === 'todos' || 
      (filtro === 'activos' && usuario.id_estado_registro === 1) || 
      (filtro === 'inactivos' && usuario.id_estado_registro !== 1);
    
    // Filtro por búsqueda
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = 
      usuario.nombres.toLowerCase().includes(textoBusqueda) ||
      usuario.apellidos.toLowerCase().includes(textoBusqueda) ||
      usuario.email.toLowerCase().includes(textoBusqueda) ||
      usuario.rol.toLowerCase().includes(textoBusqueda) ||
      usuario.area.toLowerCase().includes(textoBusqueda);
    
    return estadoFiltro && coincideBusqueda;
  });

  const cambiarEstadoUsuario = async (id, activar) => {
    try {
      const endpoint = activar ? `usuarios/${id}/restaurar` : `usuarios/${id}/eliminar`;
      await axios.patch(endpoint);
      toast.success(`Usuario ${activar ? 'activado' : 'desactivado'} correctamente`);
      
      // Actualizar lista
      const updated = usuarios.map(u => 
        u.id === id ? {...u, id_estado_registro: activar ? 1 : 0} : u
      );
      setUsuarios(updated);
    } catch (error) {
      toast.error(`Error al ${activar ? 'activar' : 'desactivar'} el usuario`);
    }
  };

  return (
    <div className="lista-usuarios-container">
      <h1 className="titulo-principal">Gestión de Usuarios</h1>
      
      {/* Controles de filtrado y búsqueda */}
      <div className="controles-busqueda">
        <div className="filtros">
          <button 
            className={`filtro-btn ${filtro === 'todos' ? 'activo' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'activos' ? 'activo' : ''}`}
            onClick={() => setFiltro('activos')}
          >
            Activos
          </button>
          <button 
            className={`filtro-btn ${filtro === 'inactivos' ? 'activo' : ''}`}
            onClick={() => setFiltro('inactivos')}
          >
            Inactivos
          </button>
        </div>
        
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <i className="icono-busqueda">🔍</i>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="tabla-contenedor">
        {cargando ? (
          <div className="cargando">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>
        ) : (
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <div className="info-usuario">
                        <div className="avatar-usuario">{usuario.nombres.charAt(0)}</div>
                        <div>
                          <div className="nombre-completo">{usuario.nombres} {usuario.apellidos}</div>
                          <div className="detalle">{usuario.dni} | {usuario.celular}</div>
                        </div>
                      </div>
                    </td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.area}</td>
                    <td>
                      <span className={`badge-estado ${usuario.id_estado_registro === 1 ? 'activo' : 'inactivo'}`}>
                        {usuario.id_estado_registro === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="acciones">
                      {usuario.id_estado_registro === 1 ? (
                        <button 
                          className="btn-accion desactivar"
                          onClick={() => cambiarEstadoUsuario(usuario.id, false)}
                        >
                          Desactivar
                        </button>
                      ) : (
                        <button 
                          className="btn-accion activar"
                          onClick={() => cambiarEstadoUsuario(usuario.id, true)}
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="sin-resultados">
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default UsuariosPage;