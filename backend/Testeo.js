const { schemaNullableIdValidator } = require('./utils/validators')


const { data, error } = schemaNullableIdValidator("Usuario").safeParse(null);
console.log(data);
console.log(error);
