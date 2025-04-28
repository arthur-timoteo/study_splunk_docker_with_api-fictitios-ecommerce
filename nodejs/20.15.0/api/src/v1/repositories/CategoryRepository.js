const database = require('../database/database_connection');

class CategoryRepository {

    async find(name = null) {
        let query = 'SELECT * FROM category WHERE (category_name LIKE $1 OR $1 IS NULL)';
        let values = name ? [`%${name}%`] : [null];

        const result = await database.query(query, values);

        return result.rows;
    }

    async findOne(category_pk) {
        const result = await database.query(
            `SELECT *
            FROM category tb_categ
            WHERE tb_categ.pk = $1`, 
            [category_pk]
        );

        return result.rows[0];
    }
}
  
module.exports = new CategoryRepository();