const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

const prefix = "/api/v1/auth";

router.post(prefix + '/register', async (req, res) => {

    const { name, email, password } = req.body;

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

router.post(prefix + '/login', async (req, res) => {

    const { email, password } = req.body;

    const account = await accountRepository.findOne(null, null, email, password);

    res.status(200).json({ 
        message: 'success',
        data: {
            account_pk: account.pk
        }
    });
});

module.exports = router;