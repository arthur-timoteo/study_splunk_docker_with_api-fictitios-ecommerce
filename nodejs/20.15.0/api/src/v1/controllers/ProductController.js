const express = require('express');
const productRepository = require('../repositories/ProductRepository');
const ProductFilterDTO = require('../dto/productFilterDTO');
const router = express.Router();

const prefix = "/api/v1/product";

router.get(prefix, async (req, res) => {

    const { name, min_price, max_price, is_new, brand, location, specifications, count } = req.query;

    const filter = new ProductFilterDTO(name, min_price, max_price, is_new, brand, location, specifications, count);

    const products = await productRepository.find(filter);

    res.status(200).json({ 
        message: 'success',
        count: products.length,
        data: products
    });
});

router.get(prefix + '/:pk/detail/', async (req, res) => {

    const productPk = req.params.pk;

    const productDetail = await productRepository.findDetail(productPk);

    res.status(200).json({ 
        message: 'success',
        data: productDetail
    });
});

module.exports = router;