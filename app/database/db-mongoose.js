const mongoose = require('mongoose');
const {dbURL} = require('../config.js');
const Schema = mongoose.Schema;

const checkForbidenString = (value, forbidenString) => {
  if (value === forbidenString) {
    throw new Error('Nazwa "slug" jest zakazana'); 
  }
}

mongoose.connect(dbURL)
  .then(console.log("Polaczono z baza"));

// model
const companySchema = new Schema({
  slug: {
    type: String,
    required: [true, 'Pole slug jest wymagane'],
    minLength: [3, 'Minimalna liczba znaków to 3'],
    validate: value => checkForbidenString(value, 'slug'),
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'Pole name jest wymagane'],
  },
  employeesCount: {
    type: Number,
    min: 1,
    default: 1,
  }
}, {collection: "companies"});

const Company = mongoose.model('Company', companySchema);

async function insert() {
  const company = new Company({
    name: 'Probox',
    slug: '   ProBox  ',
  });

  try {
    await company.save();
  } catch (e) {
    console.log('Coś poszło nie tak...');
    for (const key in e.errors) {
      console.log(e.errors[key].message);
    }
  }
}

const getCompanies = async () => {
  const result = await Company.find({});
  return result;
}

const getCompany = async (companyName) => {
  const result = await Company.find({slug: companyName});
  return result;
}

//insert();
//exports.getCompanies = getCompanies;

module.exports = {
  getCompanies,
  getCompany
}