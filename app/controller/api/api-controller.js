const Company = require('../../database/models/company');

class ApiController{
    async getCompanies(req, res) {
        const result = await Company.find();
        res.json(result);
    }

    async addCompany(req, res) {
        console.log(req.body);
        try{
            const newCompany = new Company({
                slug: req.body.slug,
                name: req.body.name,
                employeesCount: req.body.employeesCount,
                user: req.user
              });
            //const company = await databaseQuery.getCompany(req.body.slug);
            await newCompany.save();
            res.status(201).send(newCompany);
        }catch(e){
            console.log(e.message);
            res.status(422).json(e.errors);
        }
    }
    async updateCompany(req, res) {
        const slug = req.params.slug;
        const file = req.file || '';
        try{
            const company = await Company.findOne({slug});
            company.name = req.body.name ? req.body.name : company.name;
            company.slug = req.body.slug ? req.body.slug : company.slug;
            company.employeesCount = req.body.employeesCount ? req.body.employeesCount : company.employeesCount;
    
            if(file.filename && company.image){
                fs.unlinkSync('public/upload/' + company.image);
            }
            if(file.filename)
                company.image = file.filename;
            await company.save();
            res.status(202).send(company);
        }catch(e){
            console.log(e.message);
            res.status(422).json(e.errors);
        }
    }
    async deleteCompany(req, res) {
        const {slug} = req.params;
        try{
            await Company.findOneAndDelete({slug});
            res.sendStatus(204);
        }catch(e){
            res.sendStatus(422);
        }
    }
}

module.exports = new ApiController();