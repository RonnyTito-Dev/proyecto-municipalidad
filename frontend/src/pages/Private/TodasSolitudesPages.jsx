import React, { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import './TodasSolicitudesPage.css';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const PaginaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [solicitudesFiltradas, setSolicitudesFiltradas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todos');
    const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [areas, setAreas] = useState([]);
    const [areaSeleccionadaId, setAreaSeleccionadaId] = useState('');
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(true);

    useEffect(() => {
        obtenerUsuarioActual();
        obtenerSolicitudes();
        obtenerAreas();
    }, []);

    const obtenerUsuarioActual = async () => {
        try {
            const res = await api.get('/auth/current');
            setUsuarioActual(res.data.user);
        } catch (err) {
            console.error('Error al obtener usuario actual:', err);
        } finally {
            setCargandoUsuario(false);
        }
    };

    const obtenerSolicitudes = async () => {
        setCargando(true);
        try {
            const res = await api.get('/solicitudes');
            setSolicitudes(res.data);
            setSolicitudesFiltradas(res.data);
        } catch (err) {
            console.error('Error:', err);
            setError('No se pudieron cargar las solicitudes.');
        } finally {
            setCargando(false);
        }
    };

    const obtenerAreas = async () => {
        try {
            const res = await api.get('/areas/activos');
            setAreas(res.data);
        } catch (err) {
            console.error('Error al obtener áreas:', err);
        }
    };

    const manejarRecepcionarSolicitud = async (codigoSolicitud) => {
        try {
            await api.put(`/solicitudes/${codigoSolicitud}/recepcionar`);
            const res = await api.get(`/solicitudes/solicitud/${codigoSolicitud}`);
            setSolicitudSeleccionada(res.data);
            setMostrarModal(true);
            obtenerSolicitudes();
        } catch (err) {
            console.error('Error:', err);
            setError('No se pudo recepcionar la solicitud.');
        }
    };

    const manejarVerSolicitud = async (codigoSolicitud) => {
        try {
            const res = await api.get(`/solicitudes/solicitud/${codigoSolicitud}`);
            setSolicitudSeleccionada(res.data);
            setMostrarModal(true);
        } catch (err) {
            console.error('Error:', err);
            setError('No se pudo cargar la solicitud.');
        }
    };

    const manejarAccion = async (accion, codigoSolicitud, datosExtra = null) => {
        const resultado = await Swal.fire({
            title: `¿Está seguro que desea ${accion} esta solicitud?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });

        if (!resultado.isConfirmed) return;

        try {
            let endpoint = '';
            
            switch(accion) {
                case 'trabajar':
                    endpoint = `solicitudes/${codigoSolicitud}/trabajar`;
                    break;
                case 'derivar':
                    if (!areaSeleccionadaId) {
                        Swal.fire('Error', 'Seleccione un área de destino', 'error');
                        return;
                    }
                    endpoint = `solicitudes/${codigoSolicitud}/derivar`;
                    datosExtra = { area_destino_id: areaSeleccionadaId };
                    break;
                case 'aprobar':
                    endpoint = `solicitudes/${codigoSolicitud}/aprobar`;
                    break;
                case 'rechazar':
                    endpoint = `solicitudes/${codigoSolicitud}/rechazar`;
                    break;
                case 'anular':
                    endpoint = `solicitudes/${codigoSolicitud}/anular`;
                    break;
                default:
                    return;
            }

            await api.put(endpoint, datosExtra);
            obtenerSolicitudes();
            setMostrarModal(false);
            Swal.fire('Éxito', `La solicitud ha sido ${accion} correctamente`, 'success');
        } catch (err) {
            console.error(`Error al ${accion} la solicitud:`, err);
            Swal.fire('Error', `No se pudo ${accion} la solicitud`, 'error');
        }
    };

    useEffect(() => {
        if (filtro === 'todos') {
            setSolicitudesFiltradas(solicitudes);
        } else {
            setSolicitudesFiltradas(solicitudes.filter(sol => sol.estado_solicitud === filtro));
        }
    }, [filtro, solicitudes]);

    const opcionesEstado = [
        'todos',
        'Pendiente',
        'Recepcionado',
        'En Proceso',
        'Aprobado',
        'Rechazado',
        'Anulado'
    ];

    const puedeRealizarAccion = () => {
        if (!usuarioActual) return false;
        if ([1, 2].includes(usuarioActual.rol_id)) return false;
        return true;
    };

    const puedeAprobar = () => {
        if (!usuarioActual) return false;
        return usuarioActual.rol_id !== 3;
    };

    const renderizarBotonesAccion = () => {
        if (!solicitudSeleccionada || !puedeRealizarAccion()) return null;

        const estado = solicitudSeleccionada.estado_solicitud;
        
        if (estado === 'Recepcionado') {
            return (
                <div className="contenedor-botones-accion">
                    <button 
                        className="boton-accion boton-trabajar"
                        onClick={() => manejarAccion('trabajar', solicitudSeleccionada.codigo_solicitud)}
                    >
                        Trabajar en Solicitud
                    </button>
                    
                    <div className="contenedor-derivar">
                        <select
                            value={areaSeleccionadaId}
                            onChange={(e) => setAreaSeleccionadaId(e.target.value)}
                            className="selector-area"
                        >
                            <option value="">Seleccione área</option>
                            {areas.map(area => (
                                <option key={area.id} value={area.id}>
                                    {area.nombre}
                                </option>
                            ))}
                        </select>
                        <button 
                            className="boton-accion boton-derivar"
                            onClick={() => manejarAccion('derivar', solicitudSeleccionada.codigo_solicitud)}
                        >
                            Derivar
                        </button>
                    </div>
                </div>
            );
        } else if (estado === 'En Proceso') {
            return (
                <div className="contenedor-botones-accion">
                    {puedeAprobar() && (
                        <button 
                            className="boton-accion boton-aprobar"
                            onClick={() => manejarAccion('aprobar', solicitudSeleccionada.codigo_solicitud)}
                        >
                            Aprobar
                        </button>
                    )}
                    <button 
                        className="boton-accion boton-rechazar"
                        onClick={() => manejarAccion('rechazar', solicitudSeleccionada.codigo_solicitud)}
                    >
                        Rechazar
                    </button>
                    <button 
                        className="boton-accion boton-anular"
                        onClick={() => manejarAccion('anular', solicitudSeleccionada.codigo_solicitud)}
                    >
                        Anular
                    </button>
                </div>
            );
        }
        
        return null;
    };

    const renderizarAccionesTabla = (solicitud) => {
        if (!puedeRealizarAccion()) {
            return (
                <button 
                    className="boton-accion boton-ver"
                    onClick={() => manejarVerSolicitud(solicitud.codigo_solicitud)}
                >
                    Ver
                </button>
            );
        }

        return solicitud.estado_solicitud === 'Pendiente' ? (
            <button 
                className="boton-accion boton-recepcionar"
                onClick={() => manejarRecepcionarSolicitud(solicitud.codigo_solicitud)}
            >
                Recepcionar
            </button>
        ) : (
            <button 
                className="boton-accion boton-ver"
                onClick={() => manejarVerSolicitud(solicitud.codigo_solicitud)}
            >
                Ver
            </button>
        );
    };

    if (cargandoUsuario) {
        return <div className="indicador-carga">Cargando información de usuario...</div>;
    }

    return (
        <div className="contenedor-solicitudes">
            <h1 className="titulo-principal">Gestión de Solicitudes</h1>

            <div className="contenedor-filtros">
                {opcionesEstado.map((estado) => (
                    <button
                        key={estado}
                        className={`boton-filtro ${filtro === estado ? 'activo' : ''}`}
                        onClick={() => setFiltro(estado)}
                    >
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </button>
                ))}
            </div>

            <div className="tarjeta-solicitudes">
                <h2 className="encabezado-tarjeta">Listado de Solicitudes</h2>
                {cargando ? (
                    <div className="indicador-carga">Cargando solicitudes...</div>
                ) : error ? (
                    <div className="mensaje-error">{error}</div>
                ) : (
                    <div className="tabla-responsive">
                        <table className="tabla-solicitudes">
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Ciudadano</th>
                                    <th>Área</th>
                                    <th>Asunto</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesFiltradas.map((sol) => (
                                    <tr key={sol.id}>
                                        <td>{sol.codigo_solicitud}</td>
                                        <td>{`${sol.nombres_ciudadano} ${sol.apellidos_ciudadano}`}</td>
                                        <td>{sol.area_asignada}</td>
                                        <td>{sol.asunto}</td>
                                        <td>{new Date(sol.fecha_envio).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge-estado ${sol.estado_solicitud.toLowerCase().replace(' ', '-')}`}>
                                                {sol.estado_solicitud}
                                            </span>
                                        </td>
                                        <td>
                                            {renderizarAccionesTabla(sol)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal 
                show={mostrarModal} 
                onHide={() => setMostrarModal(false)}
                size="lg"
                centered
                className="modal-detalles"
            >
                <Modal.Header closeButton className="encabezado-modal">
                    <Modal.Title className="titulo-modal">Detalles de Solicitud</Modal.Title>
                </Modal.Header>
                <Modal.Body className="cuerpo-modal">
                    {solicitudSeleccionada && (
                        <div className="detalles-solicitud">
                            <div className="seccion-detalles">
                                <div className="columna-detalles">
                                    <ItemDetalle etiqueta="Código" valor={solicitudSeleccionada.codigo_solicitud} />
                                    <ItemDetalle etiqueta="Ciudadano" valor={`${solicitudSeleccionada.nombres_ciudadano} ${solicitudSeleccionada.apellidos_ciudadano}`} />
                                    <ItemDetalle etiqueta="DNI" valor={solicitudSeleccionada.dni_ciudadano} />
                                    <ItemDetalle etiqueta="Dirección" valor={solicitudSeleccionada.direccion_ciudadano} />
                                    <ItemDetalle etiqueta="Sector" valor={solicitudSeleccionada.sector_ciudadano} />
                                </div>
                                <div className="columna-detalles">
                                    <ItemDetalle etiqueta="Contacto" valor={`${solicitudSeleccionada.email_ciudadano} / ${solicitudSeleccionada.celular_ciudadano}`} />
                                    <ItemDetalle etiqueta="Código Seguimiento" valor={solicitudSeleccionada.codigo_seguimiento} />
                                    <ItemDetalle etiqueta="Área Sugerida" valor={solicitudSeleccionada.area_sugerida} />
                                    <ItemDetalle etiqueta="Área Asignada" valor={solicitudSeleccionada.area_asignada} />
                                    <ItemDetalle etiqueta="Fecha Envío" valor={new Date(solicitudSeleccionada.fecha_envio).toLocaleString()} />
                                </div>
                            </div>
                            
                            <div className="seccion-contenido">
                                <h5>Asunto</h5>
                                <p className="asunto">{solicitudSeleccionada.asunto}</p>
                                
                                <h5>Contenido</h5>
                                <p className="contenido">{solicitudSeleccionada.contenido}</p>
                            </div>
                            
                            <div className="seccion-metadatos">
                                <ItemDetalle etiqueta="Canal Notificación" valor={solicitudSeleccionada.canal_notificacion} />
                                <ItemDetalle etiqueta="Canal Solicitud" valor={solicitudSeleccionada.canal_solicitud} />
                                <div className="contenedor-estado">
                                    <span className="etiqueta-estado">Estado:</span>
                                    <span className={`valor-estado ${solicitudSeleccionada.estado_solicitud.toLowerCase().replace(' ', '-')}`}>
                                        {solicitudSeleccionada.estado_solicitud}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="pie-modal">
                    {renderizarBotonesAccion()}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

const ItemDetalle = ({ etiqueta, valor }) => (
    <div className="item-detalle">
        <span className="etiqueta-detalle">{etiqueta}:</span>
        <span className="valor-detalle">{valor}</span>
    </div>
);

export default PaginaSolicitudes;