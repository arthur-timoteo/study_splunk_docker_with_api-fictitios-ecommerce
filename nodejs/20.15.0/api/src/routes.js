const express = require('express');

// v1
const productController = require('./v1/controllers/ProductController');

const router = express.Router();

// v1
router.use(productController);

module.exports = router;