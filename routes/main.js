const express = require('express');

const router = express.Router();

const mainController = require('../controllers/main');

router.get('/', mainController.getIndex);

router.get('/trail-system', mainController.getTrails);

router.get('/visit', mainController.getVisit);

router.get('/about', mainController.getAbout);



module.exports = router; 