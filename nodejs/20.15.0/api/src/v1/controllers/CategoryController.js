const express = require('express');
const categoryRepository = require('../repositories/CategoryRepository');
const router = express.Router();

const prefix = "/api/v1/product/category";

router.get(prefix, async (req, res) => {

    const { name } = req.query;

    const categories = await categoryRepository.find(name);

    res.status(200).json({ 
        message: 'success',
        count: categories.length,
        data: categories
    });
});

module.exports = router;