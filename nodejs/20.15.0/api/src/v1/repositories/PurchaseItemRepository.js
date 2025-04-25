const database = require('../database/database_connection');

class PurchaseItemRepository {

    async create(fk_purchase, fk_product, quantity, price) {
        await database.query(
            `INSERT INTO purchase_item (fk_purchase, fk_product, quantity, price) 
            VALUES ($1, $2, $3, $4)`, 
            [fk_purchase, fk_product, quantity, price]
        );
    }
}
  
module.exports = new PurchaseItemRepository();