const {companyController} = require('../database/db-mongoose.js');

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
    const queryResult = await companyController.getCompanies(req.query, perPage);
    
    // get results from DB. Last is number how many records there are
    const resultsCount = queryResult[queryResult.length-1];
    queryResult.pop();

    const pagesCount = Math.ceil(resultsCount / perPage);

    res.render('pages/companies/companies', { 
      companies: queryResult,
      page,
      pagesCount,
      resultsCount
    });
  };

  companyRoute = async (req, res) => {
      const name = req.params.name;
      const currentCompany = await companyController.getCompany(name); // name is company's slug
      res.render('pages/companies/company', {
        currentCompany,
        name
      })
  }

  showAddCompany = (req, res) => {
    res.render('pages/companies/add');
  };

  addCompany = async (req, res) => {
    try{
      await companyController.addCompany(req.body, req.session.user._id);
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
    let result = await companyController.getCompany(req.params.name); // name as slug
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
      await companyController.editCompany(req.params.name, req.body, req.file);
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
      companyController.deleteCompany(req.params.name);
    }
    catch(err){
      console.log("Wystąpił jakiś nieszkodliwy błąd");
    }
    finally{
      res.redirect('/firmy');
    }
  }

  deleteImage = async (req, res) => {
    const name = req.params.name;
    await companyController.deleteImage(name);
    res.redirect('/');
  }

  errorRoute = (req, res) => {
      res.render('errors/404', { 
        title: 'Nie znaleziono',
        layout: 'layouts/minimalistic'
      });
  };

}

module.exports = new PageController();