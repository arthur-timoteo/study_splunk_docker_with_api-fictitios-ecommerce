const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// v1
const productController = require('./v1/controllers/ProductController');
const authController = require('./v1/controllers/AuthController');
const addressController = require('./v1/controllers/AddressController');
const purchaseController = require('./v1/controllers/PurchaseController');
const accountController = require('./v1/controllers/AccountController');
const categoryController = require('./v1/controllers/CategoryController');
const reviewController = require('./v1/controllers/ReviewController');

const router = express.Router();

// v1
router.use(productController);
router.use(authController);
router.use(addressController);
router.use(purchaseController);
router.use(accountController);
router.use(categoryController);
router.use(reviewController);

// Swagger basic setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-COMMERCE',
      version: '1.0.0',
    },
  },
    apis: [path.resolve(__dirname, './v1/controllers/*.js')], // caminhos dos arquivos onde estão suas rotas/documentações
  };

// Swagger generate docs
const swaggerSpec = swaggerJsdoc(options);

// Swagger endpoint
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));

module.exports = router;