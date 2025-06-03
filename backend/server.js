// server.js

// Importamos express
const express = require('express');

// Importacion de cors
const cors = require('cors');

// Importar el cookie parser
const cookieParser = require('cookie-parser');

// Importamos la configuracion de la app
const { app } = require('./config/config');

// ======================================= Importamos los enrutadores =======================================

const actionRouter = require('./routes/actionRouter');                  // Enrutador de acciones
const areaRouter = require('./routes/areaRouter');                      // Enrutador de areas
const attachmentRouter = require('./routes/attachmentRouter');          // Enrutador de adjuntos
const authRouter = require('./routes/authRouter');                      // Enrutador de autenticacion
const documentRouter = require('./routes/documentRouter');              // Enrutador de documentos
const documentTypeRouter = require('./routes/documentTypeRouter');      // Enrutador de tipos de documentos
const logRouter = require('./routes/logRouter');                        // Enrutador de logs
const notificationChannelRouter = require('./routes/notificationChannelRouter');        // Enrutador de canal de notificaciones
const notificationRouter = require('./routes/notificationRouter');      // Enrutador de notificaciones
const registerStatusRouter = require('./routes/registerStatusRouter');  // Enrutador de los estados de registro
const reniecRouter = require('./routes/reniecRouter');                  // Enrutador de API reniec
const requestChannelRouter = require('./routes/requestChannelRouter');  // Enrutador de canal de solicitud
const requestRouter = require('./routes/requestRouter');                // Enrutador de solicitudes
const requestStatusHistoryRouter = require('./routes/requestStatusHistoryRouter');      // Enrutador de historial de estados de solicitud
const requestStatusRouter = require('./routes/requestStatusRouter');    // Enrutador de estados de solicitud
const roleRouter = require('./routes/roleRouter');                      // Enrutador de roles
const userRouter = require('./routes/userRouter');                      // Enrutador de usuarios
const userSignatureRouter = require('./routes/userSignatureRouter');    // Enrutador de firmas de usuarios
const userStatusRouter = require('./routes/userStatusRouter');          // Enrutador de estados de usuarios

const errorHandler = require('./middleware/errorMiddleware');           // Importamos el middleware para errores

// Clase del servidor
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config() {
        this.app.use(express.json()); // Configuramos que trabajara con archivos json
        
        this.app.use(cors({
            origin: (origin, callback) => {
              if (!origin) return callback(null, true); // Permitir herramientas como Postman
              return callback(null, true);
            },
            credentials: true
        }));
          

        this.app.use(cookieParser()); // Habilitamos el uso de cookies
    }

    routes() {
        // Configuración de todas las rutas

        this.app.use('/acciones', actionRouter);                // Ruta para acciones
        this.app.use('/areas', areaRouter);                     // Ruta para areas
        this.app.use('/adjuntos', attachmentRouter);            // Ruta para adjuntos
        this.app.use('/auth', authRouter);                      // Ruta para autenticacion
        this.app.use('/documentos', documentRouter);            // Ruta para documentos
        this.app.use('/tipos-documento', documentTypeRouter);   // Ruta para tipos de docuementos
        this.app.use('/logs', logRouter);                       // Ruta para logs
        this.app.use('/canales-notificacion', notificationChannelRouter);                   // Ruta para canales de notificacion
        this.app.use('/notificaciones', notificationRouter);    // Ruta para notificaciones
        this.app.use('/estados-registro', registerStatusRouter);                            // Ruta para estados de registro
        this.app.use('/reniec', reniecRouter);                  // Ruta pare la API
        this.app.use('/canales-solicitud', requestChannelRouter);                           // Ruta para canales de solicitud
        this.app.use('/solicitudes', requestRouter);            // Ruta para solicitudes
        this.app.use('/historial-estados-solicitud', requestStatusHistoryRouter);           // Ruta para historial de estados de solicitud
        this.app.use('/estados-solicitud', requestStatusRouter);                            // Ruta para estados de solicitud
        this.app.use('/roles', roleRouter);                     // Ruta para roles
        this.app.use('/usuarios', userRouter);                  // Ruta para usuarios
        this.app.use('/firmas-usuario', userSignatureRouter);   // Ruta para firmas de usuarios
        this.app.use('/estados-usuario', userStatusRouter);     // Ruta para estados de usuario

        // Configuración del middleware de errores
        this.app.use(errorHandler); 
    }

    // Método para arrancar el servidor
    start() {
        const PORT = app.port;
        this.app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    }
}

const server = new Server(); // Creamos el servidor
server.start(); // Arrancamos el servidor
