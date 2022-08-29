const databaseQuery = require('../database/db-mongoose.js')

class PageController {
  homeRoute = (req, res) => {
    res.render('pages/home', {
      title: 'Strona główna'
    });
  }

  truncateCompany = (company) => {
    const {slug, name, employeesCount} = company;
    return {slug, name, employeesCount};
  }

  companiesRoute = async (req, res) => {
    const { q, sort, countmin, countmax } = req.query;
      let queryResult;
      queryResult = await databaseQuery.getCompanies(q, sort, countmin, countmax);
      const companies = queryResult.map(this.truncateCompany);
      res.render('pages/companies/companies', { 
        companies
      });
  };

  companyRoute = async (req, res) => {
      const queryResult = await databaseQuery.getCompanies();
      const companies = queryResult.map(this.truncateCompany);
      const name = req.params.name;
      console.log(name, companies);
      res.render('pages/companies/company', {
        companies,
        name
      })
  }

  showAddCompany = (req, res) => {
    res.render('pages/companies/add');
  };

  addCompany = async (req, res) => {
    try{
      await databaseQuery.addCompany(req.body);
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
    let result = await databaseQuery.getCompany(req.params.name); // name as slug
    if(!result) {
      res.redirect('/firmy');
      return;
    }
    const company = this.truncateCompany(result);
    console.log("edit", company);
    res.render('pages/companies/edit', {form: company});
  };

  editCompany = async (req, res) => {
    try{
      await databaseQuery.editCompany(req.params.name, req.body);
      res.redirect('/firmy');
    }
    catch(err){
      res.render('pages/companies/edit', {
        errors: err.errors,
        form: req.body
      });
    }
  }

  deleteCompany = async (req, res) => {
    try{
      databaseQuery.deleteCompany(req.params.name);
    }
    catch(err){
      console.log("Wystąpił jakiś nieszkodliwy błąd");
    }
    finally{
      res.redirect('/firmy');
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