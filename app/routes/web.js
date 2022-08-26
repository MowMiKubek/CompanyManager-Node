const express = require('express');
const pageController = require('../controller/page-controller.js');

const router = new express.Router();

router.get('/', pageController.homeRoute);
router.get('/firmy/', pageController.companiesRoute);
router.get('/firmy/:name', pageController.companyRoute);
router.get('/admin/addcompany', pageController.showAddCompany);
router.post('/admin/addcompany', pageController.addCompany);
router.get('*', pageController.errorRoute);

module.exports = router;