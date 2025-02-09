const database = require('../database/database_connection');

class AccountRepository {

    async create(name, email, password) {
        await database.query(
            `INSERT INTO account (user_name, email, account_password) VALUES ($1, $2, $3)`, 
            [name, email, password]
        );
    }

    async findOne(name = null, email = null, password = null) {

        const result = await database.query(
            `SELECT * FROM account 
            WHERE (user_name = $1 OR $1 IS NULL) 
            AND (email = $2 OR $2 IS NULL)
            AND (account_password = $3 OR $3 IS NULL) 
            LIMIT 1`, 
            [name, email, password]
        );

        return result.rows[0];
    }
}
  
module.exports = new AccountRepository();