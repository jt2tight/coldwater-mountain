const express = require('express');

const router = express.Router();

const bookingController = require('../controllers/booking');

router.get('/book', bookingController.getCampsiteBooking);

module.exports = router; 