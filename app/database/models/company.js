const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {checkForbidenString} = require('../validators.js');

// Company model
const companySchema = new Schema({
    slug: {
      type: String,
      required: [true, 'Pole slug jest wymagane'],
      minLength: [2, 'Minimalna liczba znaków dla pola slug to 2'],
      validate: value => checkForbidenString(value, 'slug'),
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Pole name jest wymagane'],
      minLength: [3, 'Minimalna liczba znaków dla pola name to 3']
    },
    employeesCount: {
      type: Number,
      min: [1, "Liczba pracowników musi być dodatnia"],
      default: 1,
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    image: String
}, {collection: "companies"});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;