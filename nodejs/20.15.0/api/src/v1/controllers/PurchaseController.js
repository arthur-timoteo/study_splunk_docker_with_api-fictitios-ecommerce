const express = require('express');
const purchaseRepository = require('../repositories/PurchaseRepository');
const productRepository = require('../repositories/ProductRepository');
const router = express.Router();

const prefix = "/api/v1/purchase";

router.post(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { address_pk, itens } = req.body;
    let total_amount = 0;

    for(let i = 0; i < itens.length; i++){
        const product = await productRepository.findDetail(itens[i].product_pk);
        total_amount += parseFloat(product.price);
    }

    const purchase_pk = await purchaseRepository.create(account_pk, address_pk, total_amount);

    res.status(201).json({ 
        message: 'success',
        data: {
            pk: purchase_pk,
        }
    });
});

router.get(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];
    const purchase_list = await purchaseRepository.find(null, account_pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        count: purchase_list.length,
        data: purchase_list
    });
});

module.exports = router;