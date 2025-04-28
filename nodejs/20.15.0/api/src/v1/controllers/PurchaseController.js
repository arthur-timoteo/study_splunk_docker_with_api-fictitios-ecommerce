const express = require('express');
const purchaseRepository = require('../repositories/PurchaseRepository');
const purchaseItemRepository = require('../repositories/PurchaseItemRepository');
const productRepository = require('../repositories/ProductRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/purchase:
 *   post:
 *     tags:
 *       - Purchase
 *     summary: Add
 *     security:
 *       - AccountPk: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_pk:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_pk:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                 minItems: 1   
 *     responses:
 *       201:
 *         description: success
 *       400:
 *         description: error to try register purchase
 *       403:
 *         description: Request denied
 */
router.post('/', async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { address_pk, itens } = req.body;
    let total_amount = 0;

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    if (!address_pk || !itens ) {
        return res.status(400).json({ 
            message: 'error to try register purchase'
        });
    }

    for(let i = 0; i < itens.length; i++){
        const product = await productRepository.findDetail(itens[i].product_pk);
        total_amount += parseFloat(product.price) * itens[i].quantity;
        itens[i].price = parseFloat(product.price);
    }

    const purchase_pk = await purchaseRepository.create(account_pk, address_pk, total_amount);

    for(let i = 0; i < itens.length; i++){
        await purchaseItemRepository.create(purchase_pk, itens[i].product_pk, itens[i].quantity, itens[i].price);
    }

    res.status(201).json({ 
        message: 'success',
        data: {
            pk: purchase_pk,
        }
    });
});

/**
 * @swagger
 * /api/v1/purchase:
 *   get:
 *     tags:
 *      - Purchase
 *     summary: List
 *     security:
 *       - AccountPk: []
 *     responses:
 *       200:
 *         description: success
 *       403:
 *         description: Request denied
 */
router.get('/', async (req, res) => {

    const account_pk = req.headers['authorization'];

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    const purchase_list = await purchaseRepository.find(null, account_pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        count: purchase_list.length,
        data: purchase_list
    });
});

/**
 * @swagger
 * /api/v1/purchase/{pk}:
 *   get:
 *     tags:
 *      - Purchase
 *     summary: Detail
 *     security:
 *       - AccountPk: []
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: purchase identifier
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: error to try get info purchase
 *       403:
 *         description: Request denied
 */
router.get('/:pk', async (req, res) => {

    const purchase_pk = req.params.pk;
    const account_pk = req.headers['authorization'];

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    const purchase = await purchaseRepository.find(purchase_pk, account_pk, null, null, null);

    if(purchase.length == 0) {
        return res.status(400).json({ 
            message: 'error to try get info purchase'
        });
    }

    const purchase_itens = await purchaseItemRepository.find(null, purchase[0].pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        data: {
            ...purchase[0],
            purchase_itens: purchase_itens.map(item => ({
                purchase_item_pk: item.pk,
                fk_product: item.fk_product,
                quantity: item.quantity,
                price: parseFloat(item.price),
            }))
        }
    });
});

module.exports = router;