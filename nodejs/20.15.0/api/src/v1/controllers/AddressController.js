const express = require('express');
const addressRepository = require('../repositories/AddressRepository');
const purchaseRepository = require('../repositories/PurchaseRepository');
const router = express.Router();

const prefix = "/api/v1/address";

router.get(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];
    const address_pk = req.query.pk;

    const addresses = await addressRepository.find(address_pk, account_pk);

    res.status(200).json({ 
        message: 'success',
        count: addresses.length,
        data: addresses
    });
}); 

router.post(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { street, city, state, postal_code } = req.body;

    await addressRepository.create(account_pk, street, city, state, postal_code);

    const address = await addressRepository.find(null, account_pk, street, city, state, postal_code);

    res.status(201).json({ 
        message: 'success',
        data: {
            address_pk: address.pk
        }
    });
});

router.delete(prefix + '/:pk', async (req, res) => {

    const address_pk = req.params.pk;
    const account_pk = req.headers['authorization'];

    const address = await purchaseRepository.find(null, account_pk, address_pk, null, null);

    if(address.length > 0) {
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