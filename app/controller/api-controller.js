const databaseQuery = require('../database/models/company');

class ApiController{
    async getCompanies(req, res) {
        const result = await databaseQuery.getAllCompanies();
        res.json(result);
    }

    async addCompany(req, res) {
        console.log(req.body);
        try{
            await databaseQuery.addCompany(req.body, req.body.user);
            const company = await databaseQuery.getCompany(req.body.slug);
            res.status(201).send(company);
        }catch(e){
            console.log(e.message);
            res.status(422).json(e.errors);
        }
    }
    async updateCompany(req, res) {
        const slug = req.params.slug;
        try{
            await databaseQuery.editCompany(slug, req.body, req.file || {});
            const company = await databaseQuery.getCompany(req.body.slug);
            res.status(202).send(company);
        }catch(e){
            console.log(e.message);
            res.status(422).json(e.errors);
        }
    }
    async deleteCompany(req, res) {
        const {slug} = req.params;
        try{
            await databaseQuery.deleteCompany(slug);
            res.sendStatus(204);
        }catch(e){
            res.sendStatus(422);
        }
    }
}

module.exports = new ApiController();