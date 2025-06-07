// Importar el dot env
require('dotenv').config();

module.exports = {

    app: {
        port: process.env.PORT || 3000,
    },

    db: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT) || 5432,
    },

    bcrypt_config: {
        saltRounds: parseInt(process.env.SALT_ROUNDS) || 10,
    },

    jwt_config: {
        secretKey: process.env.JWT_SECRET_KEY,
    },
    
    api_config: {
        urlApi: process.env.URL_API,
        tokenApi: process.env.TOKEN_API,
    },

    muni_config: {
        muniName: process.env.MUNI_NAME || 'RONNY',
        muniRequestCode: process.env.MUNI_REQUEST_CODE || 'SOL-MUNI-RONNY',
        muniTrackingCode: process.env.MUNI_TRACKING_CODE || 'SEG-MUNI-RONNY',
    },

    project_config: {
        project_env: process.env.PROJECT_ENV === 'production',
    },

    email_service: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        requireTLS: true // fuerza STARTTLS si estás en puerto 587
    }
};