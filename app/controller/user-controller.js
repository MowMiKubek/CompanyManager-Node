const {User} = require('../database/db-mongoose');

class UserController{
    showRegister = (req, res) => {
        res.render('pages/auth/register.ejs');
    }

    register = async (req, res) => {
        try{
            const newUser = new User({
                email: req.body.email,
                password: req.body.password
            });
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
                
            const isValidPass = true; //user.checkPassword(req.body.password);
            if(!isValidPass)
                throw new Error('');
            // login
            req.session.user = {
                email: user.email,
                _id: user._id
            }
            res.redirect('/');
        }catch(e){
            res.render('pages/auth/login', {
                form: req.body,
                errors: true
            });
            return;
        }
        
        
        
        
    }
}

module.exports = new UserController();