const express = require('express');
const addressRepository = require('../repositories/AddressRepository');
const purchaseRepository = require('../repositories/PurchaseRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/address:
 *   get:
 *     tags:
 *      - Address
 *     summary: List
 *     security:
 *       - AccountPk: []
 *     parameters:
 *       - in: query
 *         name: pk
 *         required: false
 *         schema:
 *           type: string
 *         description: address identifier
 *     responses:
 *       200:
 *         description: success
 *       403:
 *         description: Request denied
 */
router.get('/', async (req, res) => {

    const account_pk = req.headers['authorization'];
    const address_pk = req.query.pk;

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    const addresses = await addressRepository.find(address_pk, account_pk);

    res.status(200).json({ 
        message: 'success',
        count: addresses.length,
        data: addresses
    });
}); 

/**
 * @swagger
 * /api/v1/address:
 *   post:
 *     tags:
 *      - Address
 *     summary: Address
 *     security:
 *       - AccountPk: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postal_code:
 *                 type: string
 *     responses:
 *       201:
 *         description: success
 *       400:
 *         description: error to try register address
 *       403:
 *         description: Request denied
 */
router.post('/', async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { street, city, state, postal_code } = req.body;

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    if (!street || !city || !state || !postal_code) {
        return res.status(400).json({ 
            message: 'error to try register address'
        });
    }

    await addressRepository.create(account_pk, street, city, state, postal_code);

    const address = await addressRepository.findOne(null, account_pk, street, city, state, postal_code, 'created_at', 'DESC');

    res.status(201).json({ 
        message: 'success',
        data: {
            address_pk: address.pk
        }
    });
});

/**
 * @swagger
 * /api/v1/address/{pk}:
 *   delete:
 *     tags:
 *      - Address
 *     summary: Delete
 *     security:
 *       - AccountPk: []
 *     parameters:
 *       - in: path
 *         name: pk
 *         required: true
 *         schema:
 *           type: string
 *         description: address identifier
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: error to try delete address
 *       403:
 *         description: Request denied
 */
router.delete('/:pk', async (req, res) => {

    const address_pk = req.params.pk;
    const account_pk = req.headers['authorization'];

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    const address = await purchaseRepository.find(null, account_pk, address_pk, null, null);

    if(address.length != 0) {
        return res.status(400).json({ 
            message: 'error to try delete address'
        });
    }

    await addressRepository.delete(address_pk, account_pk);

    res.status(200).json({ 
        message: 'success'
    });
});

module.exports = router;