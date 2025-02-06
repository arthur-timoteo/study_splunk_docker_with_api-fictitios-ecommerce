const express = require('express');

// v1
const productController = require('./v1/controllers/ProductController');
const authController = require('./v1/controllers/AuthController');

const router = express.Router();

// v1
router.use(productController);
router.use(authController);

module.exports = router;