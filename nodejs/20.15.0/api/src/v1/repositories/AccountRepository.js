const database = require('../database/database_connection');

class AccountRepository {

    async create(name, email, password) {
        await database.query(
            `INSERT INTO account (user_name, email, account_password) VALUES ($1, $2, $3)`, 
            [name, email, password]
        );
    }
}
  
module.exports = new AccountRepository();