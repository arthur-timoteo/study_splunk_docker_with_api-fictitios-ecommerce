const database = require('../database/database_connection');

class AddressRepository {

    async create(pk_account, street, city, state, postal_code) {
        await database.query(
            `INSERT INTO address (fk_account, street, city, state, postal_code) 
            VALUES ($1, $2, $3, $4, $5)`, 
            [pk_account, street, city, state, postal_code ]
        );
    }

    async find(pk = null, account_fk = null, street = null, city = null, state = null, postal_code = null) {

        const result = await database.query(
            `SELECT * FROM address 
            WHERE (pk = $1 OR $1 IS NULL) 
            AND (fk_account = $2 OR $2 IS NULL) 
            AND (street = $3 OR $3 IS NULL) 
            AND (city = $4 OR $4 IS NULL) 
            AND (state = $5 OR $5 IS NULL) 
            AND (postal_code = $6 OR $6 IS NULL)`, 
            [pk, account_fk, street, city, state, postal_code]
        );

        return result.rows;
    }
}
  
module.exports = new AddressRepository();