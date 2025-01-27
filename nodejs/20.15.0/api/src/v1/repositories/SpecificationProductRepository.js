const database = require('../database/database_connection');

class SpecificationProductRepository {

    async findAll(productPk) {
        const result = await database.query(
            `SELECT 
                tb_spec.pk, tb_spec.specification_name, tb_spec_prod.specification_value
            FROM specification_product tb_spec_prod
            INNER JOIN specification tb_spec
            ON tb_spec_prod.fk_specification = tb_spec.pk
            WHERE tb_spec_prod.fk_product = $1`, 
            [productPk]
        );

        return result.rows;
    }
}
  
module.exports = new SpecificationProductRepository();