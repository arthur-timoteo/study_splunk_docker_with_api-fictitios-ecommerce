const database = require('../database/database_connection');
const categoryRepository = require('./CategoryRepository');
const specificationProductRepository = require('./SpecificationProductRepository');

class ProductRepository {

    async find(filter) {
        const result = await database.query(
            `SELECT tb_prod.pk, tb_prod.product_name, tb_prod.price 
            FROM product tb_prod
            INNER JOIN category tb_categ
            ON tb_prod.fk_category = tb_categ.pk
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

    async findDetail(productPk) {
        const productResult = await database.query(
            `SELECT *
            FROM product tb_prod
            WHERE tb_prod.pk = $1`, 
            [productPk]
        );

        const categoryResult = await categoryRepository.findOne(productResult.rows[0]['fk_category']);

        const specificationsProductResult = await specificationProductRepository.findAll(productResult.rows[0]['pk']);

        const result = {
            pk_product: productResult.rows[0]['pk'],
            product_name: productResult.rows[0]['product_name'],
            product_description: productResult.rows[0]['product_description'],
            price: productResult.rows[0]['price'],
            is_new: productResult.rows[0]['is_new'],
            brand: productResult.rows[0]['brand'],
            product_location: productResult.rows[0]['product_location'],
            created_at: productResult.rows[0]['created_at'],
            updated_at: productResult.rows[0]['updated_at'],
            category: {
                pk_category: categoryResult.pk,
                category_name: categoryResult.category_name
            },
            specifications: specificationsProductResult
        };

        return result;
    }
}
  
module.exports = new ProductRepository();