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

class CompanyController {
    
addCompany = async (data, _id) => {
    const newCompany = new Company({
      slug: data.slug,
      name: data.name,
      employeesCount: data.employeesCount,
      user: _id
    });
    try{
    await newCompany.save();
    }
    catch(err){
      throw err;
    }
  }
  
editCompany = async (slug, update, file) => {
    const company = await Company.findOne({slug: slug});
    company.name = update.name;
    company.slug = update.slug;
    company.employeesCount = update.employeesCount;

    if(file?.filename && company.image){
      fs.unlinkSync('public/upload/' + company.image);
      company.image = file.filename;
    }
    try{
      await company.save();
    }
    catch(err){
      throw err;
    }
  }
  
deleteCompany = async (slug) => {
    try{
      const company = await Company.findOne({slug});
      const image = company.image;
      if(image){
        fs.unlinkSync('public/upload/' + image);
      }
      await Company.findOneAndDelete({slug});
    }catch (err){
      throw err;
    }
  }
  
deleteImage = async (slug) => {
  try{
    const company = await Company.findOne({slug});
    const filename = company.image;
    fs.unlinkSync('public/upload/' + filename);
    company.image = '';
    await company.save();
  }
  catch(e){
    console.log(e);
  }
}
getCompanies = async (params, perPage = 2) => {
    let { q, sort, countmin, countmax, page } = params || {};
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
    const result = await query.populate('user').exec(); // wypełnij pole user danymi danego użytkownika
    const resultsCount = await Company.find(queryParams).count();
    result.push(resultsCount)
    return result;
  }
  getAllCompanies = async () => {
    try{
      const query = Company.find();
      const result = await query.populate('user').exec();
      return result;
    }
    catch(e){
      console.log("getAllCompanies error");
      return {};
    }
  }
getCompany = async (companyName) => {
    const result = await Company.findOne({slug: companyName});
    return result;
  }
  
}

const Company = mongoose.model('Company', companySchema);
const companyController = new CompanyController();
module.exports = companyController;