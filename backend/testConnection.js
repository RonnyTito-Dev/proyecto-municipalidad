// Importar la base de datos
const db = require('./config/db');

(async () => {
    
    try {
        
        // Ejecutar una consulta para probar la conexion
        const result = await db.query('SELECT NOW()');
        console.log('Conexion exitosa con la DB \Fecha y Hora: ', result.rows[0]);

        // const data = await db.query('SELECT * FROM usuarios');
        // console.log(data.rows)

    } catch(error){
        console.log('Error la conectar con la DB: ', error);
        
    }

})();