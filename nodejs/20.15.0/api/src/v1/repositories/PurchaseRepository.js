const database = require('../database/database_connection');

class PurchaseRepository {

    async create(account_pk, address_pk, total_amount) {
        await database.query(
            `INSERT INTO purchase (fk_account, fk_address, total_amount, status) 
            VALUES ($1, $2, $3, 1)`, 
            [account_pk, address_pk, total_amount]
        );
    }
}
  
module.exports = new PurchaseRepository();