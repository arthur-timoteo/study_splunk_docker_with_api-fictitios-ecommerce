const database = require('../database/database_connection');

class PurchaseItemRepository {

    async create(fk_purchase, fk_product, quantity, price) {
        await database.query(
            `INSERT INTO purchase_item (fk_purchase, fk_product, quantity, price) 
            VALUES ($1, $2, $3, $4)`, 
            [fk_purchase, fk_product, quantity, price]
        );
    }

    async find(pk = null, fk_purchase = null, fk_product = null, quantity = null, price = null) {
    
        const result = await database.query(
            `SELECT * FROM purchase_item 
            WHERE (pk = $1 OR $1 IS NULL) 
            AND (fk_purchase = $2 OR $2 IS NULL) 
            AND (fk_product = $3 OR $3 IS NULL) 
            AND (quantity = $4 OR $4 IS NULL) 
            AND (price = $5 OR $5 IS NULL)`, 
            [pk, fk_purchase, fk_product, quantity, price]
        );

        return result.rows;
    }
}
  
module.exports = new PurchaseItemRepository();