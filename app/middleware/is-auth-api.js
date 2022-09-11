const User = require('../database/models/user');

module.exports = async function(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await User.find({apiToken: token});
    if(!token || !user) {
        return res.sendStatus(403);
    }
    req.user = user;
    next();
}