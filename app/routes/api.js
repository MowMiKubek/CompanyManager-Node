const express = require('express');
const upload = require('../services/uploadimage');
const apiController = require('../controller/api-controller');

const router = express.Router();

router.get('/companies', apiController.getCompanies);
router.post('/companies', apiController.addCompany);
router.put('/companies/:slug', upload.single('image'), apiController.updateCompany);
router.delete('/companies/:slug', apiController.deleteCompany);

module.exports = router;