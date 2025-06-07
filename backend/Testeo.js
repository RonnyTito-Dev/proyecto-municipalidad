const emailService = require('./services/emailService');

(async () => {
    try {
        await emailService.sendEmail({
            to: 'tilinnomas@gmail.com',
            subject: 'Prueba desde backend',
            html: '<p>Este es un correo de prueba enviado desde el backend.</p>'
        });
        console.log('Correo enviado correctamente.');
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
})();
