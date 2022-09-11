const express = require('express');
const upload = require('../services/uploadimage');
const apiController = require('../controller/api/api-controller');
const authMiddleware = require('../middleware/is-auth-api');
const userController = require('../controller/api/user-controller');

const router = express.Router();

router.get('/companies', apiController.getCompanies);
router.post('/companies', authMiddleware, apiController.addCompany);
router.put('/companies/:slug', authMiddleware, upload.single('image'), apiController.updateCompany);
router.delete('/companies/:slug', authMiddleware, apiController.deleteCompany);

router.post('/login', userController.login);

module.exports = router;