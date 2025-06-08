import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/auth/current');
        navigate('/dashboard', { replace: true });
      } catch {}
    };
    checkAuth();
  }, [navigate]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email.trim()) {
      return Swal.fire({
        icon: 'warning',
        title: 'Correo requerido',
        text: 'Por favor ingrese su correo electrónico',
        confirmButtonColor: '#0d6efd'
      });
    }

    if (!isValidEmail(credentials.email)) {
      return Swal.fire({
        icon: 'warning',
        title: 'Correo inválido',
        text: 'Por favor ingrese un correo electrónico válido',
        confirmButtonColor: '#0d6efd'
      });
    }

    if (credentials.password.length < 8) {
      return Swal.fire({
        icon: 'error',
        title: 'Contraseña insuficiente',
        text: 'La contraseña debe tener al menos 8 caracteres',
        confirmButtonColor: '#0d6efd'
      });
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        contrasenia: credentials.password
      });

      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: response.data.message || 'Has iniciado sesión correctamente',
          showConfirmButton: false,
          timer: 1500,
          position: 'top-end'
        });

        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales incorrectas. Intente nuevamente.';
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: message,
        confirmButtonColor: '#0d6efd'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center login-page">
      <div className="login-card">
        <div className="login-card-body">
          <div className="login-header">
            <h2 className="login-title">
              <i className="bi bi-building me-2"></i>
              Municipalidad
            </h2>
            <p className="login-subtitle">Sistema de gestión de solicitudes ciudadanas</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="custom-input"
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="@muni.gob.pe"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="custom-input"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="custom-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar sesión
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
