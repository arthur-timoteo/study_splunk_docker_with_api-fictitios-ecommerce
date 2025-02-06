const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

const prefix = "/api/v1/auth/register";

router.post(prefix, async (req, res) => {

    const { name, email, password } = req.body;

    await accountRepository.create(name, email, password);

    res.status(201).json({ 
        message: 'success'
    });
});

module.exports = router;