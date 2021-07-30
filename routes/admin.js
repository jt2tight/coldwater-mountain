const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/admin', adminController.getAddProduct);
router.post('/admin/add-product', adminController.postAddProduct);



module.exports = router; 