const database = require('../database/database_connection');

class AccountRepository {

    async create(name, email, password) {
        await database.query(
            `INSERT INTO account (user_name, email, account_password) VALUES ($1, $2, $3)`, 
            [name, email, password]
        );
    }

    async findOne(pk = null, name = null, email = null, password = null) {

        const result = await database.query(
            `SELECT * FROM account 
            WHERE (pk = $1 OR $1 IS NULL) 
            AND (user_name = $2 OR $2 IS NULL)
            AND (email = $3 OR $3 IS NULL)
            AND (account_password = $4 OR $4 IS NULL) 
            LIMIT 1`, 
            [pk, name, email, password]
        );

        return result.rows[0];
    }

    async updateOne(pk, name = null, email = null) {

        await database.query(
            `UPDATE account
            SET 
                user_name = COALESCE($2, user_name),
                email = COALESCE($3, email),
                updated_at = NOW() 
            WHERE pk = $1`, 
            [pk, name, email]
        );
    }
}
  
module.exports = new AccountRepository();