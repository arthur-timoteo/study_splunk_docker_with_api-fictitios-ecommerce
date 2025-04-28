const express = require('express');
const categoryRepository = require('../repositories/CategoryRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/product/category:
 *   get:
 *     tags:
 *      - Product Category
 *     summary: List
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *         description: address identifier
 *     responses:
 *       200:
 *         description: success
 */
router.get('/', async (req, res) => {

    const { name } = req.query;

    const categories = await categoryRepository.find(name);

    res.status(200).json({ 
        message: 'success',
        count: categories.length,
        data: categories
    });
});

module.exports = router;