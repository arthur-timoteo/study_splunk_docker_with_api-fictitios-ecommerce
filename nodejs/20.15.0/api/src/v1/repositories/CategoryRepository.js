const database = require('../database/database_connection');

class CategoryRepository {

    async find(name = null) {
        let query = 'SELECT * FROM category WHERE category_name LIKE $1';
        let values = [`%${name}%`];

        const result = await database.query(query, values);

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