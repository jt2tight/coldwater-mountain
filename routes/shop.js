const express = require('express');

const router = express.Router();
const { check } = require('express-validator/check')

const shopController = require('../controllers/shop');

router.get('/shop', shopController.getShop);

router.post('/post-cart', shopController.postCart);

router.get('/cart', shopController.getCart);

router.post('/cart-delete-item', shopController.postDeleteItem);

router.get('/cart/checkout', shopController.getCheckout);

router.get('/cart/shipping-info', shopController.getShipping);

router.post('/post-shipping', 
    check('first_name').notEmpty().withMessage('Please include your First name'), 
    check('last_name').notEmpty().withMessage('Please include your Last name'),             
    check('email').isEmail().withMessage('Please provide a valid E-mail'),
    check('address1').notEmpty().withMessage('Please include your Street Address'),
    check('city').notEmpty().withMessage('Please include your City'),  
    check('state').notEmpty().withMessage('Please include your State'), 
    check('zipcode').isAlphanumeric().withMessage('Please include a valid Zipcode'),  
    check('zipcode').isLength({ min: 5}).withMessage('Please include a valid Zipcode'),  

    shopController.postShipping);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout)



module.exports = router; 