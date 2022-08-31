const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const checkForbidenString = require('../validators.js');

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
    }
}, {collection: "companies"});

class CompanyController {
    
addCompany = async (data) => {
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
  
editCompany = async (slug, update) => {
    const company = await Company.findOne({slug: slug});
    company.name = update.name;
    company.slug = update.slug;
    company.employeesCount = update.employeesCount;
    try{
      await company.save();
    }
    catch(err){
      throw err;
    }
  }
  
deleteCompany = async (slug) => {
    try{
      await Company.findOneAndDelete({slug: slug});
    }catch (err){
      throw err;
    }
  }
  
getCompanies = async (params, perPage) => {
    const { q, sort, countmin, countmax, page } = params;
    let queryParams = {};
  
    // search
    if(q) { queryParams.name = {$regex: q, $options: 'i'}; }
  
    // sort
    if(sort) { queryParams.sort = sort; }
  
    // filter
    if(countmin || countmax){
      queryParams.employeesCount = {};
      if(countmin) { queryParams.employeesCount.$gte = countmin; }
      if(countmax) { queryParams.employeesCount.$lte = countmax; }
    }
  
    // pagination
    let query = Company.find(queryParams);
    query.skip((page-1) * perPage);
    query = query.limit(perPage);
  
    if(sort){
      const s = sort.split('|');
      query = query.sort({ [s[0]]: s[1] });
    }
  
    // exec
    const result = await query.exec();
    const resultsCount = await Company.find(queryParams).count();
    result.push(resultsCount)
    return result;
  }
  
getCompany = async (companyName) => {
    const result = await Company.findOne({slug: companyName});
    return result;
  }
  
}

const Company = mongoose.model('Company', companySchema);
const companyController = new CompanyController();
module.exports = {
    companyController
}