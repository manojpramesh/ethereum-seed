let isAuthenticated = (req, res, next) => {

    if (req.user) next();
    return res.status(401).send('Unauthorized!');
};

module.exports = { isAuthenticated };