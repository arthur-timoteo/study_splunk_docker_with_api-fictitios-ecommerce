const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: success
 *       400:
 *         description: error to try login
 */
router.post('/', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'error to try login'
        });
    }

    const account = await accountRepository.findOne(null, null, email, password);

    res.status(200).json({ 
        message: 'success',
        data: {
            account_pk: account.pk
        }
    });
});

module.exports = router;