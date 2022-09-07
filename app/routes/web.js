const express = require('express');
const pageController = require('../controller/page-controller.js');
const userController = require('../controller/user-controller');
const upload = require('../services/uploadimage');

const router = new express.Router();

router.get('/', pageController.homeRoute);
router.get('/firmy/', pageController.companiesRoute);
router.get('/firmy/:name', pageController.companyRoute);

router.get('/admin/addcompany', pageController.showAddCompany);
router.post('/admin/addcompany', pageController.addCompany);

router.get('/admin/:name/editcompany', pageController.showEditCompany);
router.post('/admin/:name/editcompany', upload.single('image'), pageController.editCompany);

router.get('/admin/:name/deletecompany', pageController.deleteCompany);

router.get('/admin/:name/deleteimage', pageController.deleteImage);

router.get('/zarejestruj', userController.showRegister);
router.post('/zarejestruj', userController.register);

router.get('/zaloguj', userController.showLogin);
router.post('/zaloguj', userController.login);

router.get('/admin/profil', userController.showEditProfile);
router.post('/admin/profil', userController.editProfile);

router.get('/wyloguj', userController.logout);

router.get('/getcsv', pageController.getCSV);

router.get('*', pageController.errorRoute);

module.exports = router;