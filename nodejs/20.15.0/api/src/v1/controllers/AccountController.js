const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

const prefix = "/api/v1/account";

router.post(prefix, async (req, res) => {

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

router.get(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];

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

router.put(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { name, email } = req.body;

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