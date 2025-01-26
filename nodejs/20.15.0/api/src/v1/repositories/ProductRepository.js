const database = require('../database/database_connection');

class ProductRepository {

    async find(filter) {
        const result = await database.query(
            `SELECT tb_prod.pk, tb_prod.product_name, tb_prod.price 
            FROM product tb_prod
            INNER JOIN categorie tb_categ
            ON tb_prod.fk_categorie = tb_categ.pk
            INNER JOIN specification_product tb_spec_prod
            ON tb_prod.pk = tb_spec_prod.fk_product
            INNER JOIN specification tb_spec
            ON tb_spec_prod.fk_specification = tb_spec.pk
            WHERE (tb_prod.product_name = $1 OR $1 IS NULL)
            AND (tb_prod.price >= $2 OR $2 IS NULL)
            AND (tb_prod.price <= $3 OR $3 IS NULL)
            AND (tb_prod.is_new = $4 OR $4 IS NULL)
            AND (tb_prod.brand = $5 OR $5 IS NULL)
            AND (tb_prod.product_location = $6 OR $6 IS NULL)
            GROUP BY tb_prod.pk, tb_prod.product_name, tb_prod.price
            LIMIT $7`, 
            [filter.product_name, filter.min_price, filter.max_price, filter.is_new, filter.brand, filter.product_location, filter.count]
        );

        return result.rows;
    }
}
  
module.exports = new ProductRepository();