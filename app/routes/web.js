const express = require('express');
const { homeRoute, companiesRoute, companyRoute, errorRoute } = require('../controller/page-controller.js');

const router = new express.Router();

router.get('/', homeRoute);
router.get('/firmy/', companiesRoute);
router.get('/firmy/:name', companyRoute);
router.get('*', errorRoute);

module.exports = router;