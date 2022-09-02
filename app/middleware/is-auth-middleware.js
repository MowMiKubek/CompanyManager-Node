module.exports = (req, res, next) => {
    if(!req.session.user){
        res.redirect('/zaloguj');
    }
    else
        next();
}
