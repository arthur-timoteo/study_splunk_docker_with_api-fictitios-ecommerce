const express = require('express');
const productRepository = require('../repositories/ProductRepository');
const reviewRepository = require('../repositories/ReviewRepository');
const router = express.Router();

const prefix = "/api/v1/product";

router.get(prefix, async (req, res) => {

    const { name, min_price, max_price, is_new, brand, location, specifications, count } = req.query;

    const products = await productRepository.find(name, min_price, max_price, is_new, brand, location, specifications, count);

    res.status(200).json({ 
        message: 'success',
        count: products.length,
        data: products
    });
});

router.get(prefix + '/:pk/detail/', async (req, res) => {

    const product_pk = req.params.pk;

    const product_detail = await productRepository.findDetail(product_pk);

    const product_reviews = await reviewRepository.find(product_pk, null, null, null);

    let rating_total = 0;
    for(let i = 0; i < product_reviews.length; i++) {
        rating_total += product_reviews[i].rating;
    }

    product_detail.rating = rating_total / product_reviews.length;

    res.status(200).json({ 
        message: 'success',
        data: product_detail
    });
});

module.exports = router;