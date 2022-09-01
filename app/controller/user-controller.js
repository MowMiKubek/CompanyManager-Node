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
            if (e?.name === 'MongoServerError' && e?.code === 11000) {
                const error = {email: {message: "Podany email jest zajęty"}};
                console.log(error.email);
                res.render('pages/auth/register',{
                    errors: error
                });
                return;
            };
            res.render('pages/auth/register', {
                errors: e.errors,
                form: req.body
            });
        }
    }
}

module.exports = new UserController();