const express = require('express');
const productRepository = require('../repositories/ProductRepository');
const router = express.Router();

const prefix = "/api/v1/product";

router.get(prefix, async (req, res) => {

    const { name, min_price, max_price, is_new, brand, location, specifications, count } = req.query;

    const products = await productRepository.find(name, min_price, max_price, is_new, brand, location, specifications, count );

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