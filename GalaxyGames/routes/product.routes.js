const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');

router.get('/', ProductController.getAll);
router.post('/', ProductController.create);
router.put('/:id/stock', ProductController.updateStock);
router.delete('/:id', ProductController.delete);

module.exports = router;