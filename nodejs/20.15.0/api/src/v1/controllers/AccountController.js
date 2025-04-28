const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/account:
 *   post:
 *     tags:
 *      - Account
 *     summary: Register account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: success
 *       400:
 *         description: error to try register account
 */
router.post('/', async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ 
            message: 'error to try register account'
        });
    }

    const existingAccount = await accountRepository.findOne(null, null, email, null);

    if (existingAccount) {
        return res.status(400).json({ 
            message: 'error to try register account'
        });
    }

    await accountRepository.create(name, email, password);

    const { pk } = await accountRepository.findOne(null, null, email, null);

    res.status(201).json({ 
        message: 'success',
        data: {
            account_pk: pk
        }
    });
});

/**
 * @swagger
 * /api/v1/account:
 *   get:
 *     tags:
 *      - Account
 *     summary: Detail
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

    const account = await accountRepository.findOne(account_pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        data: {
            pk: account.pk,
            user_name: account.user_name,
            email: account.email,
            created_at: account.created_at,
            updated_at: account.updated_at
        }
    });
}); 

/**
 * @swagger
 * /api/v1/account:
 *   put:
 *     tags:
 *      - Account
 *     summary: Edit
 *     security:
 *       - AccountPk: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 *       403:
 *         description: Request denied
 */
router.put('/', async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { name, email } = req.body;

    if (!account_pk) {
        return res.status(403).json({ 
            message: 'Request denied'
        });
    }

    if (!name && !email) {
        return res.status(400).json({ 
            message: 'error to try edit account'
        });
    }

    await accountRepository.updateOne(account_pk, name, email);

    const account = await accountRepository.findOne(account_pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        data: {
            pk: account.pk,
            user_name: account.user_name,
            email: account.email,
            created_at: account.created_at,
            updated_at: account.updated_at
        }
    });
}); 

module.exports = router;