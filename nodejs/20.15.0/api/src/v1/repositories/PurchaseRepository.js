const database = require('../database/database_connection');

class PurchaseRepository {

    async create(account_pk, address_pk, total_amount) {
        await database.query(
            `INSERT INTO purchase (fk_account, fk_address, total_amount, status) 
            VALUES ($1, $2, $3, 1)`, 
            [account_pk, address_pk, total_amount]
        );

        const purchase = await this.find(null, account_pk, address_pk, total_amount, 1);
        purchase.sort((a, b) => b.created_at - a.created_at);
        
        return purchase[0]['pk'];
    }

    async find(pk = null, fk_account = null, fk_address = null, total_amount = null, status = null) {
    
        const result = await database.query(
            `SELECT * FROM purchase 
            WHERE (pk = $1 OR $1 IS NULL) 
            AND (fk_account = $2 OR $2 IS NULL) 
            AND (fk_address = $3 OR $3 IS NULL) 
            AND (total_amount = $4 OR $4 IS NULL) 
            AND (status = $5 OR $5 IS NULL)`, 
            [pk, fk_account, fk_address, total_amount, status]
        );

        return result.rows;
    }
}
  
module.exports = new PurchaseRepository();