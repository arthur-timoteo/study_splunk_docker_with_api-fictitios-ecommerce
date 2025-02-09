const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

const prefix = "/api/v1/auth";

router.post(prefix + '/register', async (req, res) => {

    const { name, email, password } = req.body;

    await accountRepository.create(name, email, password);

    res.status(201).json({ 
        message: 'success'
    });
});

router.post(prefix + '/login', async (req, res) => {

    const { email, password } = req.body;

    const account = await accountRepository.findOne(null, email, password);

    res.status(200).json({ 
        message: 'success',
        data: {
            user_key: account.pk
        }
    });
});

module.exports = router;