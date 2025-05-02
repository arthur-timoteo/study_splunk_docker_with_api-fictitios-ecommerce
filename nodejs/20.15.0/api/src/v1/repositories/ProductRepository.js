const database = require('../database/database_connection');
const categoryRepository = require('./CategoryRepository');
const specificationProductRepository = require('./SpecificationProductRepository');

class ProductRepository {

    async find(product_name, min_price, max_price, is_new, brand, product_location, specifications, count) {
        
        let query_specifications_filter = '';
        let query_specifications_pks = '';
        let query_specifications = '';

        if (specifications) {
            for (let i = 0; i < specifications.length; i++) {
                query_specifications_filter += `(UPPER(tb_spec.specification_name) LIKE UPPER('${specifications[i].key}')
                    AND UPPER(tb_spec_prod.specification_value) LIKE UPPER('${specifications[i].value}') )`;

                if(i != specifications.length - 1) {
                    query_specifications_filter += ' OR ';
                }
            }

            query_specifications = `
            SELECT tb_spec_prod.fk_product FROM specification_product AS tb_spec_prod
            INNER JOIN specification AS tb_spec
            ON tb_spec_prod.fk_specification = tb_spec.pk
            WHERE 
            ${query_specifications_filter}
            GROUP BY tb_spec_prod.fk_product`;
        }

        query_specifications_pks = query_specifications ? `AND tb_prod.pk IN(${query_specifications})` : '';

        let query = 
            `SELECT tb_prod.pk, tb_prod.product_name, tb_prod.price 
            FROM product tb_prod
            INNER JOIN category tb_categ
            ON tb_prod.fk_category = tb_categ.pk
            INNER JOIN specification_product tb_spec_prod
            ON tb_prod.pk = tb_spec_prod.fk_product
            INNER JOIN specification tb_spec
            ON tb_spec_prod.fk_specification = tb_spec.pk
            WHERE (UPPER(tb_prod.product_name) = UPPER($1) OR $1 IS NULL)
            AND (tb_prod.price >= $2 OR $2 IS NULL)
            AND (tb_prod.price <= $3 OR $3 IS NULL)
            AND (tb_prod.is_new = $4 OR $4 IS NULL)
            AND (UPPER(tb_prod.brand) = UPPER($5) OR $5 IS NULL)
            AND (UPPER(tb_prod.product_location) = UPPER($6) OR $6 IS NULL)
            ${query_specifications_pks}
            GROUP BY tb_prod.pk, tb_prod.product_name, tb_prod.price
            LIMIT $7`;

        const result = await database.query(
            query, 
            [product_name, min_price, max_price, is_new, brand, product_location, count]
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