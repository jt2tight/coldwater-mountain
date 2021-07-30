const express = require('express');

const router = express.Router();
const { check } = require('express-validator/check')

const contactController = require('../controllers/contact');

router.get('/contact', contactController.getContact);

router.get('/about/volunteer', contactController.getVolunteer);
router.post('/about/volunteer-submit', check('email').isEmail().withMessage('That is not a valid e-mail'), contactController.postVolunteer);
router.get('/about/volunteer-submit', contactController.getVolunteerSubmit);

router.post('/contact', 
    check('email').isEmail().withMessage('Invalid E-mail'), 
    check('message').notEmpty().withMessage('Please Include a Message'), 
    contactController.postContact);

router.get('/message-sent', contactController.getMessageConfirmation);

module.exports = router; 