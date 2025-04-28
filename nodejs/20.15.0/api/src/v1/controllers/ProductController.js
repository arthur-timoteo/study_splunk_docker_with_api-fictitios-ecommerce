const express = require('express');
const productRepository = require('../repositories/ProductRepository');
const reviewRepository = require('../repositories/ReviewRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     tags:
 *      - Product
 *     summary: List
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: product name
 *       - in: query
 *         name: min_price
 *         required: false
 *         schema:
 *           type: number
 *         description: minimum price
 *       - in: query
 *         name: is_new
 *         required: false
 *         schema:
 *           type: string
 *         description: is product new
 *       - in: query
 *         name: brand
 *         required: false
 *         schema:
 *           type: string
 *         description: product brand
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *         description: product location
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: array
 *         description: specifications
 *       - in: query
 *         name: count
 *         required: false
 *         schema:
 *           type: number
 *         description: quantity of products
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', async (req, res) => {

    const { name, min_price, max_price, is_new, brand, location, specifications, count } = req.query;

    const products = await productRepository.find(name, min_price, max_price, is_new, brand, location, specifications, count);

    res.status(200).json({ 
        message: 'success',
        count: products.length,
        data: products
    });
});

/**
 * @swagger
 * /api/v1/product/{pk}/detail:
 *   get:
 *     tags:
 *       - Product
 *     summary: Detail
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: product identifier
 *     responses:
 *       200:
 *         description: success
 */
router.get('/:pk/detail/', async (req, res) => {

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