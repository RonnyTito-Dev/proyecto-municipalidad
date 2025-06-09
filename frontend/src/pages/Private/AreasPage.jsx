// src/pages/Private/AreaPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance'; // Importa tu instancia de axios configurada
import Swal from 'sweetalert2';
import './AreasPage.css';

const AreasPage = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newArea, setNewArea] = useState({ nombre: '', descripcion: '' });
    
    // State for editing an area
    const [isEditing, setIsEditing] = useState(false);
    const [currentArea, setCurrentArea] = useState(null); // Stores the area being edited

    // Function to fetch all areas
    const fetchAreas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/areas');
            setAreas(response.data);
        } catch (err) {
            console.error('Error al obtener las áreas:', err);
            setError('No se pudieron cargar las áreas. Intente de nuevo.');
            Swal.fire('Error', 'No se pudieron cargar las áreas.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Load areas on component mount
    useEffect(() => {
        fetchAreas();
    }, []);

    // Handle changes in the new area form
    const handleNewAreaChange = (e) => {
        const { name, value } = e.target;
        setNewArea(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission to create an area
    const handleCreateArea = async (e) => {
        e.preventDefault();
        try {
            await api.post('/areas', newArea);
            Swal.fire('Éxito', 'Área creada correctamente.', 'success');
            setNewArea({ nombre: '', descripcion: '' }); // Clear form
            fetchAreas(); // Reload areas to see the new one
        } catch (err) {
            console.error('Error al crear el área:', err);
            let errorMessage = 'Error al crear el área.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    // Handler for "Editar" button click
    const handleEditClick = (area) => {
        setCurrentArea({ ...area }); // Set a copy of the area to be edited
        setIsEditing(true); // Open the edit modal/form
    };

    // Handle changes in the edit area form
    const handleEditAreaChange = (e) => {
        const { name, value } = e.target;
        setCurrentArea(prev => ({ ...prev, [name]: value }));
    };

    // Handle submission of the edit area form
    const handleUpdateArea = async (e) => {
        e.preventDefault();
        if (!currentArea || !currentArea.id) return;

        try {
            await api.put(`/areas/${currentArea.id}`, {
                nombre: currentArea.nombre,
                descripcion: currentArea.descripcion
            });
            Swal.fire('Éxito', 'Área actualizada correctamente.', 'success');
            setIsEditing(false); // Close the modal
            setCurrentArea(null); // Clear current area
            fetchAreas(); // Reload areas to see the updated one
        } catch (err) {
            console.error('Error al actualizar el área:', err);
            let errorMessage = 'Error al actualizar el área.';
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    };

    // Handler for "Eliminar" (logical delete)
    const handleDeleteArea = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción eliminará el área lógicamente!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.patch(`/areas/${id}/eliminar`);
                    Swal.fire('Eliminada', 'El área ha sido marcada como eliminada.', 'success');
                    fetchAreas(); // Reload areas
                } catch (err) {
                    console.error('Error al eliminar el área:', err);
                    let errorMessage = 'Error al eliminar el área.';
                    if (err.response && err.response.data && err.response.data.message) {
                        errorMessage = err.response.data.message;
                    }
                    Swal.fire('Error', errorMessage, 'error');
                }
            }
        });
    };

    // Handler for "Restaurar" (logical restore)
    const handleRestoreArea = async (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción restaurará el área!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, restaurar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.patch(`/areas/${id}/restaurar`);
                    Swal.fire('Restaurada', 'El área ha sido restaurada.', 'success');
                    fetchAreas(); // Reload areas
                } catch (err) {
                    console.error('Error al restaurar el área:', err);
                    let errorMessage = 'Error al restaurar el área.';
                    if (err.response && err.response.data && err.response.data.message) {
                        errorMessage = err.response.data.message;
                    }
                    Swal.fire('Error', errorMessage, 'error');
                }
            }
        });
    };

    // Handler for changing area visibility
    const handleChangeVisibility = async (id, currentVisibility) => {
        const newVisibility = !currentVisibility;
        Swal.fire({
            title: '¿Cambiar visibilidad?',
            text: `¿Quieres hacer esta área ${newVisibility ? 'Pública' : 'Privada'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/areas/${id}/visibilidad`, { area_publica: newVisibility });
                    Swal.fire('Cambiado', 'La visibilidad del área ha sido actualizada.', 'success');
                    fetchAreas(); // Reload areas
                } catch (err) {
                    console.error('Error al cambiar la visibilidad:', err);
                    let errorMessage = 'Error al cambiar la visibilidad.';
                    if (err.response && err.response.data && err.response.data.message) {
                        errorMessage = err.response.data.message;
                    }
                    Swal.fire('Error', errorMessage, 'error');
                }
            }
        });
    };

    if (loading) {
        return <div className="loading-message">Cargando áreas...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="container">
            <h1 className="page-title">Gestión de Áreas</h1>

            {/* Formulario para crear nueva área */}
            <div className="card">
                <h2 className="card-title">Crear Nueva Área</h2>
                <form onSubmit={handleCreateArea}>
                    <div className="form-group">
                        <label htmlFor="nombre" className="form-label">Nombre del Área</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={newArea.nombre}
                            onChange={handleNewAreaChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion" className="form-label">Descripción</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={newArea.descripcion}
                            onChange={handleNewAreaChange}
                            rows="3"
                            className="form-textarea"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Crear Área
                    </button>
                </form>
            </div>

            {/* Tabla de áreas */}
            <div className="card">
                <h2 className="card-title">Listado de Áreas</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Pública</th>
                                <th>Estado</th>
                                <th>Fecha Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map((area) => (
                                <tr key={area.id}>
                                    <td>{area.id}</td>
                                    <td>{area.nombre}</td>
                                    <td>{area.descripcion}</td>
                                    <td>{area.area_publica ? 'Sí' : 'No'}</td>
                                    <td>{area.estado}</td>
                                    <td>{area.fecha_creacion}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditClick(area)} // Pass the whole area object
                                        >
                                            Editar
                                        </button>
                                        {area.estado === 'Activo' ? (
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDeleteArea(area.id)}
                                            >
                                                Eliminar
                                            </button>
                                        ) : (
                                            <button
                                                className="btn-restore"
                                                onClick={() => handleRestoreArea(area.id)}
                                            >
                                                Restaurar
                                            </button>
                                        )}
                                        <button
                                            className="btn-visibility"
                                            onClick={() => handleChangeVisibility(area.id, area.area_publica)}
                                        >
                                            {area.area_publica ? 'Hacer Privada' : 'Hacer Pública'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal para editar área */}
            {isEditing && currentArea && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Editar Área</h2>
                        <form onSubmit={handleUpdateArea}>
                            <div className="form-group">
                                <label htmlFor="editNombre" className="form-label">Nombre del Área</label>
                                <input
                                    type="text"
                                    id="editNombre"
                                    name="nombre"
                                    value={currentArea.nombre}
                                    onChange={handleEditAreaChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editDescripcion" className="form-label">Descripción</label>
                                <textarea
                                    id="editDescripcion"
                                    name="descripcion"
                                    value={currentArea.descripcion}
                                    onChange={handleEditAreaChange}
                                    rows="3"
                                    className="form-textarea"
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-cancel"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AreasPage;