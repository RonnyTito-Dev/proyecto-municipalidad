// Importamos el bcrypt
const bcrypt = require('bcrypt');

// Importamos configuracion de bcrypt salt
const { bcrypt_config } = require('../config/config');


// Funcion para encryptar password
async function hashPassword(plainTextPassword){
    return await bcrypt.hash(plainTextPassword, bcrypt_config.saltRounds);
}

// Funcion para comparar password
async function comparePassword(plainTextPassword, hashPassword) {
    return await bcrypt.compare(plainTextPassword, hashPassword);
}

// Funcion para encryptar pin
async function hashPin(plainTextPin){
    return await bcrypt.hash(plainTextPin, bcrypt_config.saltRounds);
}

// Funcion para comparar pin
async function comparePin(plainTextPin, hashPin) {
    return await bcrypt.compare(plainTextPin, hashPin);
}

// Exportar el modulo
module.exports = {
    hashPassword,
    comparePassword,
    hashPin,
    comparePin,
}
