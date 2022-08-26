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
  }
}, {collection: "companies"});

const Company = mongoose.model('Company', companySchema);


const addCompany = async (data) => {
  const newCompany = new Company({
    slug: data.slug,
    name: data.name,
    employeesCount: data.employeesCount
  });
  try{
  await newCompany.save();
  }
  catch(err){
    throw err;
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

module.exports = {
  getCompanies,
  getCompany,
  addCompany,
}