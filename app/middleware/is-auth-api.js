const User = require('../database/models/user');

module.exports = async function(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await User.findOne({apiToken: token});
    if(!user) {
        console.log("Api token not found");
        return res.sendStatus(403);
    }
    req.user = user;
    next();
}