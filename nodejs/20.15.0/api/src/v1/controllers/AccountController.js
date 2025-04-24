const express = require('express');
const accountRepository = require('../repositories/AccountRepository');
const router = express.Router();

const prefix = "/api/v1/account";

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

module.exports = router;