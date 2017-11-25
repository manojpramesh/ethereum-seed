const passport = require('passport');
const userModel = require('../models/user.model')
const localStrategy = require('passport-local').Strategy;

module.exports = () => {
    passport.use(new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        (email, password, cb) => {
            let user = {
                email: email,
                password: password
            }
            let exclude = {
                password: 0
            }
            userModel.searchUser(user, exclude, (err, result) => {
                if (result.length === 0)
                    cb("Incorrect username or password", null);
                cb(null, result);
            });
        }));
};