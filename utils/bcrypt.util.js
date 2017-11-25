const bcrypt = require('bcrypt');
const saltRounds = 10;

var bcryptUtil = {
    hashPassowrd: (password) => {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                return hash;
            });
        });
    }
};

module.exports = bcryptUtil;