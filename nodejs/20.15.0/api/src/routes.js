const express = require('express');

// v1
const productController = require('./v1/controllers/ProductController');
const authController = require('./v1/controllers/AuthController');
const addressController = require('./v1/controllers/AddressController');
const purchaseController = require('./v1/controllers/PurchaseController');
const accountController = require('./v1/controllers/AccountController');
const categoryController = require('./v1/controllers/CategoryController');

const router = express.Router();

// v1
router.use(productController);
router.use(authController);
router.use(addressController);
router.use(purchaseController);
router.use(accountController);
router.use(categoryController);

module.exports = router;