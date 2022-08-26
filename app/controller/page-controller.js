const databaseQuery = require('../database/db-mongoose.js')

class PageController {
  homeRoute = (req, res) => {
    res.render('pages/home', {
      title: 'Strona główna'
    });
  }

  companiesRoute = async (req, res) => {
      console.log(req.url);
      const queryResult = await databaseQuery.getCompanies();
      const companies = queryResult.map((company) => {
        const {slug, name} = company;
        return {slug, name};
      });
      res.render('pages/companies/companies', { 
        companies
      });
  };

  companyRoute = async (req, res) => {
      const queryResult = await databaseQuery.getCompanies();
      const companies = queryResult.map((company) => {
        const {slug, name} = company;
        return {slug, name};
      });
      const name = req.params.name;
      console.log(name, companies);
      res.render('pages/companies/company', {
        companies,
        name
      })
  }

  showAddCompany = (req, res) => {
    res.render('pages/companies/addcompany');
  };

  addCompany = async (req, res) => {
    try{
      await databaseQuery.addCompany(req.body);
      res.redirect('/firmy');
    }
    catch(err){
      res.render('pages/companies/addcompany', {
        errors: err.errors,
        form: req.body
      });
    }
  }

  errorRoute = (req, res) => {
      res.render('errors/404', { 
        title: 'Nie znaleziono',
        layout: 'layouts/minimalistic'
      });
  };

}

module.exports = new PageController();