const database = require('../database/database_connection');

class ReviewRepository {

    async create(fk_product, fk_account, rating, review_comment) {
        await database.query(
            `INSERT INTO review (fk_product, fk_account, rating, review_comment) 
            VALUES ($1, $2, $3, $4)`, 
            [fk_product, fk_account, rating, review_comment]
        );
    }

    async find(fk_product = null, fk_account = null, rating = null, review_comment = null) {

        const result = await database.query(
            `SELECT * FROM review 
            WHERE (fk_product = $1 OR $1 IS NULL) 
            AND (fk_account = $2 OR $2 IS NULL) 
            AND (rating = $3 OR $3 IS NULL) 
            AND (review_comment = $4 OR $4 IS NULL)`, 
            [fk_product, fk_account, rating, review_comment]
        );

        return result.rows;
    }
}
  
module.exports = new ReviewRepository();