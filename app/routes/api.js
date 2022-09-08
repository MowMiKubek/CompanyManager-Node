const express = require('express');
const apiController = require('../controller/api-controller');

const router = express.Router();

router.get('/companies', apiController.getCompanies);
router.post('/companies', apiController.addCompany);
router.put('/companies/:slug', apiController.updateCompany);
router.delete('/companies/:slug', apiController.deleteCompany);

module.exports = router;