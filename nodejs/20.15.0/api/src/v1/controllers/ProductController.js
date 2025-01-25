const express = require('express');
const router = express.Router();

const prefix = "api/v1/product";

router.get(prefix, async (req, res) => {

    res.status(200).json({ message: 'ok' });
});

module.exports = router;