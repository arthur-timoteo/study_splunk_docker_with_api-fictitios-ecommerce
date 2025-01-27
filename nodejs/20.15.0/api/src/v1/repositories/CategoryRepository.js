const database = require('../database/database_connection');

class CategoryRepository {

    async findOne(categoryPk) {
        const result = await database.query(
            `SELECT *
            FROM category tb_categ
            WHERE tb_categ.pk = $1`, 
            [categoryPk]
        );

        return result.rows[0];
    }
}
  
module.exports = new CategoryRepository();