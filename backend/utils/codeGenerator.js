// utils/codeGenerator.js

// Importar configuracion de la municipalidad
const { muni_config: { muniRequestCode, muniTrackingCode } } = require('../config/config');

class CodeGenerator {

    // Obtener la fecha actual
    #getPeruDate(){
        return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
    }

    // Agrega un cero a la izquierda si el valor tiene solo un dígito (para mantener el formato)
    #pad(value) {
        return value.toString().padStart(2, '0');
    }

        // Devuelve una fecha compacta sin separadores en formato 'DDMMYYYY'
    #getCompactDate() {
        const date = this.#getPeruDate();
        const d = this.#pad(date.getDate());
        const m = this.#pad(date.getMonth() + 1);
        const y = date.getFullYear();
        return `${d}${m}${y}`;
    }

    // Devuelve una hora compacta sin separadores en formato 'HHMMSS'
    #getCompactTime() {
        const date = this.#getPeruDate();
        const h = this.#pad(date.getHours());
        const min = this.#pad(date.getMinutes());
        const s = this.#pad(date.getSeconds());
        return `${h}${min}${s}`;
    }

    // Obtener Codigo de solicitud
    getRequestCode(nombres, apellidos){
        const requestPrefix = muniRequestCode;
        const timestamp = `${this.#getCompactTime()}_${this.#getCompactDate()}`;
        const userTag = `${nombres.substring(0, 2)}-${apellidos.substring(0, 2)}`;
        return `${requestPrefix}_${timestamp}_${userTag}`;
    }
    
    // Obtener Codigo de seguimiento
    getRequestTrackingCode(nombres, apellidos){
        const trackingPrefix = muniTrackingCode;
        const timestamp = `${this.#getCompactTime()}_${this.#getCompactDate()}`;
        const userTag = `${nombres.substring(0, 2)}-${apellidos.substring(0, 2)}`;
        return `${trackingPrefix}_${timestamp}_${userTag}`;
    }

    // Obtener ambos codigos
    getRequestCodeAndTrackingCode(nombres, apellidos){
        const requestPrefix = muniRequestCode;
        const trackingPrefix = muniTrackingCode;

        const timestamp = `${this.#getCompactTime()}_${this.#getCompactDate()}`;
        const userTag = `${nombres.substring(0, 2)}-${apellidos.substring(0, 2)}`;

        const requestCode = `${requestPrefix}_${timestamp}_${userTag}`;
        const trackingCode = `${trackingPrefix}_${timestamp}_${userTag}`
        
        return { requestCode, trackingCode };
    }

}

// Exportar una instancia de l a clase
module.exports = new CodeGenerator();