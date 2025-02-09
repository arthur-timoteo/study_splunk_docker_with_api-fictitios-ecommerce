const database = require('../database/database_connection');

class AddressRepository {

    async create(pk_account, street, city, state, postal_code ) {
        await database.query(
            `INSERT INTO address (fk_account, street, city, state, postal_code) 
            VALUES ($1, $2, $3, $4, $5)`, 
            [pk_account, street, city, state, postal_code ]
        );
    }
}
  
module.exports = new AddressRepository();