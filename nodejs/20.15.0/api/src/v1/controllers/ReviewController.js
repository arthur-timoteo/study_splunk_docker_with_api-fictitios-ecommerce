const express = require('express');
const reviewRepository = require('../repositories/ReviewRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/product/{pk}/review:
 *   post:
 *     tags:
 *       - Review
 *     summary: Add
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: product identifier 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               review_comment:
 *                 type: string 
 *     security:
 *       - AccountPk: [] 
 *     responses:
 *       201:
 *         description: success
 *       400:
 *         description: error to try register review
 *       403:
 *         description: Request denied
 */
router.post('/:pk/review', async (req, res) => {
console.log(req);
    const product_pk = req.params.pk;
    const account_pk = req.headers['authorization'];
    const { rating, review_comment } = req.body;

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    if (!rating) {
        return res.status(400).json({ 
            message: 'error to try register review'
        });
    }

    const review_this_product_account_exists = await reviewRepository.find(product_pk, account_pk, rating, review_comment);

    if(review_this_product_account_exists.length != 0) {
        return res.status(400).json({ 
            message: 'error to try register review'
        });
    }

    await reviewRepository.create(product_pk, account_pk, rating, review_comment);

    const review = await reviewRepository.find(product_pk, account_pk, rating, review_comment);

    res.status(200).json({ 
        message: 'success',
        data: {
            review_pk: review[0].pk
        }
    });
});

/**
 * @swagger
 * /api/v1/product/{pk}/review:
 *   get:
 *     tags:
 *      - Review
 *     summary: List
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
router.get('/:pk/review', async (req, res) => {

    const product_pk = req.params.pk;

    const reviews = await reviewRepository.find(product_pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        data: {
            count: reviews.length,
            reviews: reviews
        }
    });
});

module.exports = router;