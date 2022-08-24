const databaseQuery = require('../database/db-mongoose.js')

exports.homeRoute = (req, res) => {
    res.render('pages/home', {
      title: 'Strona główna'
    });
  }

exports.companiesRoute = async (req, res) => {
    console.log(req.url);
    const queryResult = await databaseQuery.getCompanies();
    const companies = queryResult.map((company) => {
      const {slug, name} = company;
      return {slug, name};
    });
    res.render('pages/companies', { 
      companies
    });
};

exports.companyRoute = async (req, res) => {
    const queryResult = await databaseQuery.getCompanies();
    const companies = queryResult.map((company) => {
      const {slug, name} = company;
      return {slug, name};
    });
    const name = req.params.name;
    console.log(name, companies);
    res.render('pages/company', {
      companies,
      name
    })
}

exports.errorRoute = (req, res) => {
    res.render('errors/404', { 
      title: 'Nie znaleziono',
      layout: 'layouts/minimalistic'
    });
};
