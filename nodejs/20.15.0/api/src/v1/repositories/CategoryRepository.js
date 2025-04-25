const database = require('../database/database_connection');

class CategoryRepository {

    async find(name = null) {

        const result = await database.query(
            `SELECT * 
            FROM category
            WHERE (category_name = $1 OR $1 IS NULL)`, 
            [name]
        );

        return result.rows;
    }

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