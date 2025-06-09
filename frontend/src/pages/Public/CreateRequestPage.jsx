import { useEffect, useState } from 'react';
import {
    BiUser, BiIdCard, BiHomeAlt, BiMap, BiEnvelope, BiPhone,
    BiBookmark, BiFile, BiSearchAlt, BiShow, BiHide
} from 'react-icons/bi';
import { BsBuilding, BsChat } from 'react-icons/bs';
import Swal from 'sweetalert2';
import api from '../../api/axiosInstance';

const CreateRequestPage = () => {
    const [areas, setAreas] = useState([]);
    const [channels, setChannels] = useState([]);
    const [form, setForm] = useState({
        nombres_ciudadano: '',
        apellidos_ciudadano: '',
        dni_ciudadano: '',
        direccion_ciudadano: '',
        sector_ciudadano: '',
        email_ciudadano: '',
        celular_ciudadano: '',
        area_sugerida_id: '',
        asunto: '',
        contenido: '',
        pin_seguridad: '',
        canal_notificacion_id: ''
    });
    const [showPin, setShowPin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [areasRes, channelsRes] = await Promise.all([
                    api.get('/areas'),
                    api.get('/canales-notificacion')
                ]);

                const publicAreas = areasRes.data.filter(a => a.area_publica === true);
                setAreas(publicAreas);
                setChannels(channelsRes.data);
            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const consultarReniec = async () => {
        if (form.dni_ciudadano.length !== 8) {
            Swal.fire({
                icon: 'warning',
                title: 'El DNI debe tener 8 caracteres',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        try {
            const response = await api.get(`/reniec/${form.dni_ciudadano}`);
            const { nombres, apellido_paterno, apellido_materno } = response.data;

            setForm(prev => ({
                ...prev,
                nombres_ciudadano: nombres,
                apellidos_ciudadano: `${apellido_paterno} ${apellido_materno}`
            }));

            Swal.fire({
                icon: 'success',
                title: 'Datos cargados',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al consultar RENIEC';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        try {
            const response = await api.post('/solicitudes/public', form);
            const data = response.data;

            // Mostrar alerta solo con código de seguimiento
            Swal.fire({
                icon: 'success',
                title: '¡Solicitud enviada!',
                html: `
            <p>Su solicitud fue registrada exitosamente.</p>
            <p><strong>Código de seguimiento:</strong> ${data.codigo_seguimiento}</p>
            <p>Este código también ha sido enviado a su correo.</p>
        `,
                confirmButtonColor: '#2563eb'
            });

            // Limpiar formulario
            setForm({
                nombres_ciudadano: '',
                apellidos_ciudadano: '',
                dni_ciudadano: '',
                direccion_ciudadano: '',
                sector_ciudadano: '',
                email_ciudadano: '',
                celular_ciudadano: '',
                area_sugerida_id: '',
                asunto: '',
                contenido: '',
                pin_seguridad: '',
                canal_notificacion_id: ''
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Verifica los datos ingresados y vuelve a intentar.';

            Swal.fire({
                icon: 'error',
                title: 'Error al enviar la solicitud',
                text: errorMessage,
                confirmButtonColor: '#dc2626'
            });

            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="contenedor-crear-solicitud mt-4">


            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Columna Izquierda - Datos del ciudadano */}
                    <div className="col-md-6">
                        <h5 className="d-flex align-items-center mb-4">
                            <BiUser className="me-2" />
                            Datos del Ciudadano
                        </h5>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiUser />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombres_ciudadano"
                                    value={form.nombres_ciudadano}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nombres Completos"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiUser />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="apellidos_ciudadano"
                                    value={form.apellidos_ciudadano}
                                    onChange={handleChange}
                                    required
                                    placeholder="Apellidos completos"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiIdCard />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="dni_ciudadano"
                                    value={form.dni_ciudadano}
                                    onChange={handleChange}
                                    required
                                    maxLength={8}
                                    placeholder="Ingrese DNI"
                                />
                                <button
                                    type="button"
                                    className="btn bg-success text-white"
                                    onClick={consultarReniec}
                                >
                                    <BiSearchAlt />
                                </button>
                            </div>
                            {/* <small className="text-muted">Presione el botón de búsqueda para autocompletar</small> */}
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiHomeAlt />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="direccion_ciudadano"
                                    value={form.direccion_ciudadano}
                                    onChange={handleChange}
                                    placeholder="Ingrese dirección"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiMap />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="sector_ciudadano"
                                    value={form.sector_ciudadano}
                                    onChange={handleChange}
                                    placeholder="Ingrese sector o urbanización"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiEnvelope />
                                </span>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email_ciudadano"
                                    value={form.email_ciudadano}
                                    onChange={handleChange}
                                    placeholder="Ingrese correo electrónico"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiPhone />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="celular_ciudadano"
                                    value={form.celular_ciudadano}
                                    onChange={handleChange}
                                    placeholder="Ingrese número celular"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha - Datos de la solicitud */}
                    <div className="col-md-6">
                        <h5 className="d-flex align-items-center mb-4">
                            <BsBuilding className="me-2" />
                            Datos de la Solicitud
                        </h5>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsBuilding />
                                </span>
                                <select
                                    className="form-control"
                                    name="area_sugerida_id"
                                    value={form.area_sugerida_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Área de solicitud
                                    </option>
                                    {areas.map(area => (
                                        <option key={area.id} value={area.id}>
                                            {area.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiBookmark />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="asunto"
                                    value={form.asunto}
                                    onChange={handleChange}
                                    required
                                    placeholder="Asunto de la solicitud"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiFile />
                                </span>
                                <textarea
                                    className="form-control"
                                    name="contenido"
                                    rows="4"
                                    value={form.contenido}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describa detalladamente su solicitud"
                                />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BiShow />
                                </span>
                                <input
                                    type={showPin ? 'text' : 'password'}
                                    className="form-control"
                                    name="pin_seguridad"
                                    value={form.pin_seguridad}
                                    onChange={handleChange}
                                    required
                                    maxLength={4}
                                    pattern="\d{4}"
                                    placeholder="Ingrese PIN de 4 dígitos"
                                />
                                <button
                                    type="button"
                                    className="btn bg-secondary text-white"
                                    onClick={() => setShowPin(!showPin)}
                                >
                                    {showPin ? <BiHide /> : <BiShow />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <BsChat />
                                </span>
                                <select
                                    className="form-control"
                                    name="canal_notificacion_id"
                                    value={form.canal_notificacion_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Canal de notificación
                                    </option>
                                    {channels.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de enviar */}
                <div className="text-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary px-4 py-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Enviando...
                            </>
                        ) : (
                            'Enviar Solicitud'
                        )}
                    </button>
                </div>

                {/* Mensajes de estado */}
                {successMsg && (
                    <div className="alert alert-success mt-3 d-flex align-items-center">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="alert alert-danger mt-3 d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {errorMsg}
                    </div>
                )}
            </form>
        </div>
    );

};

export default CreateRequestPage;