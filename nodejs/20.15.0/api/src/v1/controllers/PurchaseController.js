const express = require('express');
const purchaseRepository = require('../repositories/PurchaseRepository');
const purchaseItemRepository = require('../repositories/PurchaseItemRepository');
const productRepository = require('../repositories/ProductRepository');
const router = express.Router();

const prefix = "/api/v1/purchase";

router.post(prefix, async (req, res) => {

    const account_pk = req.headers['authorization'];
    const { address_pk, itens } = req.body;
    let total_amount = 0;

    for(let i = 0; i < itens.length; i++){
        const product = await productRepository.findDetail(itens[i].product_pk);
        total_amount += parseFloat(product.price) * itens[i].quantity;
        itens[i].price = parseFloat(product.price);
    }

    const purchase_pk = await purchaseRepository.create(account_pk, address_pk, total_amount);

    for(let i = 0; i < itens.length; i++){
        await purchaseItemRepository.create(purchase_pk, itens[i].product_pk, itens[i].quantity, itens[i].price);
    }

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

router.get(prefix + '/:pk', async (req, res) => {

    const purchase_pk = req.params.pk;
    const account_pk = req.headers['authorization'];

    const purchase = await purchaseRepository.find(purchase_pk, account_pk, null, null, null);

    if(purchase.length == 0) {
        return res.status(400).json({ 
            message: 'error to try get info purchase'
        });
    }

    const purchase_itens = await purchaseItemRepository.find(null, purchase.pk, null, null, null);

    res.status(200).json({ 
        message: 'success',
        data: {
            ...purchase[0],
            purchase_itens: purchase_itens.map(item => ({
                purchase_item_pk: item.pk,
                fk_product: item.fk_product,
                quantity: item.quantity,
                price: parseFloat(item.price),
            }))
        }
    });
});

module.exports = router;