module.exports = url_pass = (req, res, next) => {
    res.locals.url = req.url;
    next();
}
