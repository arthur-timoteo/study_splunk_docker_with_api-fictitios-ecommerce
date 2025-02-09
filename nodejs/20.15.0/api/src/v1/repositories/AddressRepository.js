const database = require('../database/database_connection');

class AddressRepository {

    async create(pk_account, street, city, state, postal_code ) {
        await database.query(
            `INSERT INTO address (fk_account, street, city, state, postal_code) 
            VALUES ($1, $2, $3, $4, $5)`, 
            [pk_account, street, city, state, postal_code ]
        );
    }

    async find(fk_account, pk = null) {

        const result = await database.query(
            `SELECT * FROM address 
            WHERE (fk_account = $1 OR $1 IS NULL) 
            AND (pk = $2 OR $2 IS NULL)`, 
            [fk_account, pk]
        );

        return result.rows;
    }
}
  
module.exports = new AddressRepository();