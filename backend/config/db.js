const { Pool } = require('pg'); // Importamos pg
const { db } = require('./config'); // Importamos la configuracion

class DataBase {

    // Constructor de la clase
    constructor() {
        this.pool = new Pool(db);
    }

    // Metodo query para realizar consultas
    query(text, params) {
        return this.pool.query(text, params);
    }
}

// Exportamos una instancia de la clase
module.exports = new DataBase();
