module.exports = url_pass = (req, res, next) => {
    res.locals.url = req.url;
    res.locals.errors = null;
    res.locals.form = null;
    res.locals.query = req.query;
    next();
}
