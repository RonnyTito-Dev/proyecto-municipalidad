import React, { useState, useEffect } from 'react';
import { BiSearchAlt, BiCheckShield, BiTime, BiUser, BiCalendar, BiDetail } from 'react-icons/bi';
import { BsClipboardData, BsArrowRight } from 'react-icons/bs';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import api from '../../api/axiosInstance';

const TrackRequestPage = () => {
  const [trackingData, setTrackingData] = useState({
    codigo_seguimiento: '',
    pin_seguridad: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrackingData({ ...trackingData, [name]: value });
  };

  const toggleShowPin = () => setShowPin(!showPin);

  const fetchStatusHistory = async (codigoSeguimiento) => {
    try {
      const response = await api.get(`/historial-estados-solicitud/seguimiento/${codigoSeguimiento}`);
      setStatusHistory(response.data);
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/solicitudes/seguimiento', trackingData);
      setRequestData(response.data);
      await fetchStatusHistory(response.data.codigo_seguimiento);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud encontrada',
        text: 'La información de tu solicitud se ha cargado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      let errorMessage = 'Ocurrió un error al buscar la solicitud';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Entendido'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const variants = {
      'Aprobado': 'badge-success',
      'Pendiente': 'badge-warning',
      'Rechazado': 'badge-danger',
      'En Proceso': 'badge-info',
      'Completado': 'badge-primary',
      'Recepcionado': 'badge-secondary'
    };
    return variants[status] || 'badge-secondary';
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  return (
    <div className="track-wrapper">
      {/* Container: Seguimiento (formulario de búsqueda) */}
      <div className="container-tracking" style={{ maxWidth: '480px', margin: 'auto', display: requestData ? 'none' : 'block' }}>
        <div className="track-card">
          <div className="track-header">
            <h3><BiCheckShield className="me-2" /> Seguimiento de Solicitud</h3>
          </div>
          <div className="track-body">

            <form onSubmit={handleSubmit} className="track-form">
              <div className="track-form-header" style={{ textAlign: 'center' }}>
                <BiSearchAlt className="icon-large text-primary" />
                <h4>Consultar estado</h4>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="codigo_seguimiento"
                  value={trackingData.codigo_seguimiento}
                  onChange={handleInputChange}
                  placeholder="Código de seguimiento"
                  required
                />
              </div>

              <div className="form-group pin-group" style={{ position: 'relative' }}>
                <input
                  type={showPin ? 'text' : 'password'}
                  name="pin_seguridad"
                  value={trackingData.pin_seguridad}
                  onChange={handleInputChange}
                  placeholder="PIN de seguridad"
                  maxLength="4"
                  pattern="\d{4}"
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={toggleShowPin}
                  className="pin-toggle-btn"
                  aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                  {showPin ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>

              <div className="btn-container">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? (
                    <>
                      <span className="spinner"></span> Buscando...
                    </>
                  ) : (
                    <>
                      <BiSearchAlt className="me-2" /> Buscar Solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Container: Resultado */}
      {requestData && (
        <div className="container-result">
          {/* Container: Estado actual e historial */}
          <div className="container-history track-card mb-4">
            <div className="track-header">
              <h3 className="text-primary fs-4"><BiTime className="me-1 fs-2" /> Estado Actual  </h3>
              <span className={`badge ${getStatusBadgeClass(requestData.estado_solicitud)} fs-5 `}>
                {requestData.estado_solicitud}
              </span>
            </div>
            <div className="track-body">
              <p className="track-date">
                <BiCalendar className="me-2" />
                Solicitud creada el: {requestData.fecha_envio}
              </p>

              <div className="timeline">
                {statusHistory.map((item, index) => (
                  <div key={item.id} className={`timeline-item ${index === 0 ? 'timeline-item-current' : ''}`}>
                    <div className="timeline-item-marker"></div>
                    <div className="timeline-item-content">
                      <div className="d-flex justify-content-between">
                        <span className={`badge ${getStatusBadgeClass(item.estado_solicitud)} me-2`}>
                          {item.estado_solicitud}
                        </span>
                        <small className="text-muted">{item.fecha_registro}</small>
                      </div>
                      <div className="timeline-item-area mt-1">
                        {item.area_actual && (
                          <>
                            <span className="text-primary">{item.area_actual}</span>
                            {item.area_destino && (
                              <>
                                <BsArrowRight className="mx-2 text-muted" />
                                <span className="text-primary">{item.area_destino}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                      {item.notas && (
                        <div className="timeline-item-notes mt-2">
                          <p className="mb-0 small">{item.notas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-1">
              <button onClick={toggleDetails} className="btn btn-ml btn-primary">
                <BiDetail className="me-2" />
                {showDetails ? 'Ocultar detalles de Solicitud' : 'Ver detalles de Solicitud'}
              </button>

              <button onClick={() => setRequestData(null)} className="btn btn-success">
                  <BiSearchAlt className="me-2" /> Nueva búsqueda
                </button>
            </div>
          </div>




          {/* Container: Detalles de solicitud */}
          {showDetails && (
            <div className="container-details track-card">
              <div className="track-header">
                <h3><BsClipboardData className="me-2" /> Detalles Completos de la Solicitud</h3>
              </div>

              <div className="track-body">
                <div className="row">
                  {/* Columna 1: Datos del Ciudadano */}
                  <div className="col-md-6 mb-3">
                    <div className="track-card-inner">
                      <h4><BiUser className="me-2" /> Ciudadano</h4>
                      <ul className="track-list">
                        <li><strong>Nombres:</strong> {requestData.nombres_ciudadano} {requestData.apellidos_ciudadano}</li>
                        <li><strong>DNI:</strong> {requestData.dni_ciudadano}</li>
                        <li><strong>Dirección:</strong> {requestData.direccion_ciudadano}</li>
                        <li><strong>Sector:</strong> {requestData.sector_ciudadano}</li>
                        <li><strong>Email:</strong> {requestData.email_ciudadano}</li>
                        <li><strong>Celular:</strong> {requestData.celular_ciudadano}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Columna 2: Datos del Trámite */}
                  <div className="col-md-6 mb-3">
                    <div className="track-card-inner">
                      <h4><BsClipboardData className="me-2" /> Trámite</h4>
                      <ul className="track-list">
                        <li><strong>Código:</strong> {requestData.codigo_solicitud}</li>
                        <li><strong>Seguimiento:</strong> {requestData.codigo_seguimiento}</li>
                        <li><strong>Área Sugerida:</strong> {requestData.area_sugerida}</li>
                        <li><strong>Área Asignada:</strong> {requestData.area_asignada}</li>
                        <li><strong>Fecha:</strong> {requestData.fecha_envio}</li>
                        <li><strong>Canal:</strong> {requestData.canal_solicitud}</li>
                        <li><strong>Registrado por:</strong> {requestData.usuario_tramite}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Fila completa: Asunto y Contenido */}
                  <div className="col-12">
                    <div className="track-card-inner">
                      <ul className="track-list">
                        <li><strong>Asunto:</strong> {requestData.asunto}</li>
                        <li><strong>Contenido:</strong>
                          <div className="track-content-box">{requestData.contenido}</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="track-footer text-center mt-3">
                {/* <small>¿Necesitas ayuda? Contacta con la municipalidad.</small> */}
              </div>
            </div>
          )}



        </div>
      )}
    </div>
  );
};

export default TrackRequestPage;
