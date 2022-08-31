const mongoose = require('mongoose');
const {dbURL} = require('../config.js');
const companyController = require('./models/company');
const User = require('./models/user');


mongoose.connect(dbURL)
  .then(console.log("Polaczono z baza"));


module.exports = {
  companyController,
  User
};