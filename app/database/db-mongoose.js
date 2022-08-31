const mongoose = require('mongoose');
const {dbURL} = require('../config.js');
const {companyController} = require('./models/company');


mongoose.connect(dbURL)
  .then(console.log("Polaczono z baza"));


module.exports = companyController;