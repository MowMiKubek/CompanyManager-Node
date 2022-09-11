const User = require('../../database/models/user');

class UserController{
    async login(req, res) {
        try{
            const user = await User.findOne({ email: req.body.email });
            if(!user)
                throw new Error("user not found");
            
            const isValidPassword = user.checkPassword(req.body.password);
            if(!isValidPassword)
                throw new Error("user not found");
            
            // login
            req.session.user = user;
            res.status(200).json({apiToken: user.apiToken});
            
        }catch(e){
            console.log(e.message);
            res.sendStatus(401);
        }
        
    }
}

module.exports = new UserController();