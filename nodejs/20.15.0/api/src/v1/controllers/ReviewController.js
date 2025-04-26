const express = require('express');
const reviewRepository = require('../repositories/ReviewRepository');
const router = express.Router();

const prefix = "/api/v1/product/:pk/review/";

router.post(prefix, async (req, res) => {

    const product_pk = req.params.pk;
    const account_pk = req.headers['authorization'];
    const { rating, review_comment } = req.body;

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

router.get(prefix, async (req, res) => {

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