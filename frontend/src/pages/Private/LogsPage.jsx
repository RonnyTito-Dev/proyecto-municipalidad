// src/pages/Private/LogsPages.jsx
// src/pages/Private/LogsPages.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import './LogsPage.css';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/logs');
      setLogs(res.data);
    } catch (error) {
      toast.error('Error al cargar los logs.');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionClass = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('crear')) return 'accion-crear';
    if (actionLower.includes('actualizar')) return 'accion-actualizar';
    if (actionLower.includes('eliminar')) return 'accion-eliminar';
    return '';
  };

  return (
    <div className="pagina-logs">

      <div className="contenedor-tabla">
        <h2 className="subtitulo-tabla">Historial de Acciones</h2>
        <table className="tabla-logs">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Área</th>
              <th>Tabla Afectada</th>
              <th>Acción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.nombres} {log.apellidos}</td>
                  <td>{log.rol}</td>
                  <td>{log.area}</td>
                  <td>{log.tabla_afectada}</td>
                  <td className={getActionClass(log.accion)}>{log.accion}</td>
                  <td>{new Date(log.fecha_registro).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="sin-registros">No hay registros disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LogsPage;