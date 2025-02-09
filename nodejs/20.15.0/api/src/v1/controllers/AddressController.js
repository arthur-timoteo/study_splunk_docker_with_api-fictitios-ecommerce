const express = require('express');
const addressRepository = require('../repositories/AddressRepository');
const router = express.Router();

const prefix = "/api/v1/address";

router.post(prefix, async (req, res) => {

    const pk_account = req.headers['authorization'];
    const { street, city, state, postal_code } = req.body;

    await addressRepository.create(pk_account, street, city, state, postal_code);

    res.status(201).json({ 
        message: 'success'
    });
});

module.exports = router;