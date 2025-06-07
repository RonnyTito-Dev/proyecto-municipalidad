// Importar nodemailer
const nodemailer = require('nodemailer');

// Importar ApiError para manejo personalizado de errores
const ApiError = require('../errors/apiError');

// Importar configuración del email
const { email_service } = require('../config/config');

class EmailService {

    // El constructor crea el transporter con la configuración
    constructor() {
        this.transporter = nodemailer.createTransport({
            ...email_service
        });
    }

    // Método para enviar el email
    async sendEmail({ to, subject, html }) {
        try {
            const info = await this.transporter.sendMail({
                from: `tilinnomas@gmail.com`,
                to,
                subject,
                html
            });

            console.log(`Correo enviado a ${to}: ${info.messageId}`);
            return info;

        } catch (error) {
            // Lanzar error personalizado en caso de fallo en el envío
            throw ApiError.internal(`Error al enviar correo: ${error.message}`);
        }
    }
}

// Exportar una instancia
module.exports = new EmailService();
