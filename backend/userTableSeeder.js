
// usersTableSeeder.js

// Importamos la db
const db = require('./config/db');

// Importamos bcrypt
const { hashPassword } = require('./utils/bcryptHelper');


class UsersTableSeeder {
    
    // Metodo seeder up
    async up(){

        try{   

            const password = await hashPassword('12345678');

            const query = `INSERT INTO users (name, email, password, role_id) VALUES
            ($1, $2, $3, $4)`;

            await db.query(query, ['Ronny Tito', 'ronnytito@gmail.com', password, 1]
            );

            console.log('EXITO => El seeder "usersTableSeeder.js" fue levantado correctamente.');
        
        } catch(error){
            console.log('ERROR => Al ejecutar levantar el seeder "usersTableSeeder.js": ', error);
        };
    
    }


    // Metodo seeder down
    async down(){

        try{
            await db.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

            console.log('EXITO => El seeder "usersTableSeeder.js" fue quitado correctamente.');

        } catch(error){
            console.log('ERROR => Al ejecutar quitar el seeder "usersTableSeeder.js": ', error);
        }
    
    };

}

// Exportamos una instancia de UsersTableSeeder
module.exports = new UsersTableSeeder();
    