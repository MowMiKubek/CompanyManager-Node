const {User} = require('../database/db-mongoose');

class UserController{
    showRegister = (req, res) => {
        res.render('pages/auth/register.ejs');
    }

    register = async (req, res) => {
        try{
            const newUser = new User(req.body);
            await newUser.save();
            res.redirect('/');
        }
        catch(e){
            res.render('pages/auth/register', {
                errors: e.errors,
                form: req.body
            });
        }
    }

    showLogin = (req, res) => {
        res.render('pages/auth/login.ejs');
    }

    login = async (req, res) => {
        try{
            const user = await User.findOne({ email: req.body.email });
            if(!user) 
                throw new Error('');
                
            const isValidPass = user.checkPassword(req.body.password);
            if(!isValidPass)
                throw new Error('');
            // login
            req.session.user = user;
            res.redirect('/');
        }catch(e){
            res.render('pages/auth/login', {
                form: req.body,
                errors: true
            });
            return;
        }
    }

    showEditProfile = (req, res) => {

        res.render('pages/auth/edit', {
            form: req.session.user
        });
    }

    editProfile = async (req, res) => {
        const user = await User.findById(req.session.user._id);
        user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        
        try{
            await user.save();
            req.session.user = user;
            res.redirect('/admin/profil');
        }catch(e){
            res.render('pages/auth/edit', {
                errors: e.errors,
                form: req.body
            });
        }
    }

    logout = (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}

module.exports = new UserController();