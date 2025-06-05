const { idValidator, actionCreateValidator, logsCreateValidator, schemaNameValidator } = require('./utils/validators');

const data = {
    usuario_id: 2, 
    rol_id: 5,
    area_id: 7, 
    tabla_afectada: '    ', 
    accion_id: 'i'
};

const id = 1;

const result = schemaNameValidator('Accion').safeParse('Acción');

if(result.success){
    console.log(result.data);
    
} else {
    console.log(result.error.errors[0].message);
    
}