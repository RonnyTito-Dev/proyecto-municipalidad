// src/pages/Private/RolesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import './RolesPage.css';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    descripcion: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/roles');
      setRoles(response.data);
    } catch (error) {
      toast.error('Error al cargar los roles.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setForm({ ...role });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        await axios.patch(`/roles/${id}/eliminar`);
        toast.success('Rol eliminado exitosamente.');
        fetchRoles();
      } catch (error) {
        toast.error('Error al eliminar el rol.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre.trim()) {
      toast.warning('El nombre del rol es obligatorio.');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/roles/${form.id}`, form);
        toast.success('Rol actualizado exitosamente.');
      } else {
        await axios.post('/roles', form);
        toast.success('Rol creado exitosamente.');
      }
      resetForm();
      fetchRoles();
    } catch (error) {
      toast.error('Error al guardar el rol.');
    }
  };

  const resetForm = () => {
    setForm({ id: null, nombre: '', descripcion: '' });
    setIsEditing(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="roles-container">
      <h1 className="titulo-principal">Gestión de Roles</h1>

      {/* Formulario */}
      <div className="formulario-roles">
        <div className="formulario-contenido">
          <h2 className="titulo-seccion">
            {isEditing ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-fila">
              <div className="form-grupo">
                <label>Nombre del Rol</label>
                <input
                  type="text"
                  placeholder="Ej: Administrador"
                  value={form.nombre}
                  onChange={(e) => setForm({...form, nombre: e.target.value})}
                  required
                />
              </div>
              <div className="form-grupo">
                <label>Descripción</label>
                <textarea
                  rows="3"
                  placeholder="Descripción de las funciones del rol"
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                />
              </div>
            </div>
            <div className="botones-formulario">
              <button type="submit" className="boton-primario">
                {isEditing ? 'Guardar Cambios' : 'Crear Rol'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="boton-secundario">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Tabla de roles */}
      <div className="tabla-contenedor">
        <h2 className="titulo-seccion">Listado de Roles</h2>
        
        {loading ? (
          <div className="cargando">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="tabla-responsive">
            <table className="tabla-roles">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>{role.nombre}</td>
                      <td>{role.descripcion}</td>
                      <td className="acciones-celda">
                        <button 
                          className="boton-editar"
                          onClick={() => handleEdit(role)}
                        >
                          Editar
                        </button>
                        <button 
                          className="boton-eliminar"
                          onClick={() => handleDelete(role.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="sin-registros">
                      No hay roles registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default RolesPage;