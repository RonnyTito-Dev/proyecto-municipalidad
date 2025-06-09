// src/pages/Private/MiCuentaPage.jsx

import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import './MiCuentaPage.css';

const MiCuentaPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [area, setArea] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [usuarioRes, areasRes, rolesRes] = await Promise.all([
          axios.get('/auth/current'),
          axios.get('/areas'),
          axios.get('/roles')
        ]);

        const usuarioData = usuarioRes.data.user;
        setUsuario(usuarioData);

        // Buscar área correspondiente
        const areaEncontrada = areasRes.data.find(a => a.id === usuarioData.area_id);
        setArea(areaEncontrada);

        // Buscar rol correspondiente
        const rolEncontrado = rolesRes.data.find(r => r.id === usuarioData.rol_id);
        setRol(rolEncontrado);

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container className="text-center py-5">
        <h2>No se pudo cargar la información del usuario</h2>
      </Container>
    );
  }

  return (
    <Container className="mi-cuenta-container">
      <h1 className="titulo-pagina">Mi Cuenta</h1>
      
      <Card className="tarjeta-perfil">
        <Card.Body>
          <Row>
            <Col md={4} className="columna-avatar">
              <div className="avatar-container">
                <div className="avatar">
                  {usuario.nombres_usuario.charAt(0)}
                </div>
                <h3 className="nombre-usuario">{usuario.nombres_usuario}</h3>
                <div className="rol-usuario">{rol?.nombre || 'Sin rol asignado'}</div>
              </div>
            </Col>
            
            <Col md={8} className="columna-detalles">
              <div className="seccion-detalle">
                <h4>Información Personal</h4>
                <div className="detalle-item">
                  <span className="etiqueta">Correo electrónico:</span>
                  <span className="valor">{usuario.email_usuario}</span>
                </div>
              </div>
              
              <div className="seccion-detalle">
                <h4>Información Laboral</h4>
                <div className="detalle-item">
                  <span className="etiqueta">Área:</span>
                  <span className="valor">{area?.nombre || 'Sin área asignada'}</span>
                </div>
                <div className="detalle-item">
                  <span className="etiqueta">Descripción del área:</span>
                  <span className="valor">{area?.descripcion || 'No disponible'}</span>
                </div>
                <div className="detalle-item">
                  <span className="etiqueta">Rol:</span>
                  <span className="valor">{rol?.nombre || 'Sin rol asignado'}</span>
                </div>
                <div className="detalle-item">
                  <span className="etiqueta">Descripción del rol:</span>
                  <span className="valor">{rol?.descripcion || 'No disponible'}</span>
                </div>
              </div>
              
              <div className="seccion-detalle">
                <h4>Estado de la Cuenta</h4>
                <div className="detalle-item">
                  <span className="etiqueta">Estado:</span>
                  <span className={`valor estado ${usuario.estado_usuario_id === 1 ? 'activo' : 'inactivo'}`}>
                    {usuario.estado_usuario_id === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MiCuentaPage;
