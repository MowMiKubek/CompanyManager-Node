const Company = require('../database/db-mongoose.js');
const fs = require('fs');
const {Parser} = require('json2csv');


class PageController {
  homeRoute = (req, res) => {
    res.render('pages/home', {
      title: 'Strona główna',
      user: req.session.user
    });
  }

  truncateCompany = (company) => {
    const {slug, name, employeesCount} = company;
    return {slug, name, employeesCount};
  }

  companiesRoute = async (req, res) => {
    const page = req.query.page || 1;
    const perPage = 2;
   // const queryResult = await companyController.getCompanies(req.query, perPage);
    let { q, sort, countmin, countmax } = req.query || {}; 
    let queryParams = {};

    // sort
    if(q) { queryParams.name = {$regex: q, $options: 'i'}}

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

    const companies = await query.populate('user').exec(); // wypełnij pole user danymi danego użytkownika
    const resultsCount = await Company.find(queryParams).count();

    const pagesCount = Math.ceil(resultsCount / perPage);

    res.render('pages/companies/companies', { 
      companies,
      page,
      pagesCount,
      resultsCount
    });
  };


  companyRoute = async (req, res) => {
      const slug = req.params.name;
      const currentCompany = await Company.findOne({slug}); // name is company's slug
      res.render('pages/companies/company', {
        currentCompany,
        name: slug
      })
  }

  showAddCompany = (req, res) => {
    res.render('pages/companies/add');
  };

  addCompany = async (req, res) => {
    const newCompany = new Company({
      slug: req.body.slug,
      name: req.body.name,
      employeesCount: req.body.employeesCount,
      user: req.session.user._id
    });
    try{
      await newCompany.save();
      res.redirect('/firmy');
    }
    catch(err){
      res.render('pages/companies/add', {
        errors: err.errors,
        form: req.body
      });
    }
  }

  showEditCompany = async (req, res) => {
    let company = await Company.findOne({ slug: req.params.name}); // name as slug
    if(!company) {
      res.redirect('/firmy');
      return;
    }
    res.render('pages/companies/edit', {form: company});
  };

  editCompany = async (req, res) => {
    try{
      const company = await Company.findOne({slug: req.body.slug});
      company.name = req.body.name ? req.body.name : company.name;
      company.slug = req.body.slug ? req.body.slug : company.slug;
      company.employeesCount = req.body.employeesCount ? req.body.employeesCount : company.employeesCount;
      //await companyController.editCompany(req.params.name, req.body, req.file || {});
      
      if(req.file.filename)
        company.image = req.file.filename;
      await company.save();
      res.redirect('/firmy');
    }
    catch(err){
      console.log(err);
      res.render('pages/companies/edit', {
        errors: err.errors,
        form: req.body
      });
    }
  }

  deleteCompany = async (req, res) => {
    try{
      const slug = req.params.name;
      const company = await Company.findOne({slug});
      let image;
      if(company)
        image = company.image;
      if(image){
        fs.unlinkSync('public/upload/' + image);
      }
      await Company.findOneAndDelete({slug});
    }
    catch(err){
      console.log(err);
    }
    finally{
      res.redirect('/firmy');
    }
  }

  deleteImage = async (req, res) => {
    const name = req.params.name;
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
    finally{
      res.redirect('/');
    }
  }

  getCSV = async (req, res) => {
    const fields = [
      {
        label: "Nazwa firmy",
        value: 'name'
      },
      {
        label: "Skrót",
        value: "slug"
      },
      {
        label: "Liczba pracowników",
        value: "employeesCount"
      },
      {
        label: "Właściciel",
        value: "user.ceo"
      }
    ];
    const filename = 'companies.csv';
    const query = Company.find();
    const companies = await query.populate('user').exec();
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(companies);

    res.header({'Content-type': 'text/csv'});
    res.attachment(filename);
    res.send(csv);
  }

  errorRoute = (req, res) => {
      res.render('errors/404', { 
        title: 'Nie znaleziono',
        layout: 'layouts/minimalistic'
      });
  };

}

module.exports = new PageController();