const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

const prefix = "/api/v1/auth";

router.post(prefix + '/login', async (req, res) => {

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