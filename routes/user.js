const express = require('express');
const passport = require('passport');
const userModel = require('../models/user.model');
const router = express.Router();
const mailDelivery = require('../utils/email');
const { isAuthenticated } = require('../utils/user.util');
const ethereum = {
    personal: require('../ethereum/personal'),
    eth: require('../ethereum/eth')
};
const config = {
    ethereum: require('../config/ethereum'),
    cryptoConfig: require('../config/crypto')
};


// @dev Emty route
router.get('/', function(req, res, next) {
    res.json('You found me!! ;)');
});

// @dev: Sign in 
router.post('/signIn', passport.authenticate('local', {
    failureRedirect: '/api/users/signInError'
}), (req, res) => {
    res.json(req.user);
});

router.get('/signInError', (req, res) => {
    res.status(400).send('Error logging in. Please check your username and password.');
});

// @dev: get signed in user data
router.get('/profile', isAuthenticated, (req, res, next) => {
    res.json(req.user);
});

// @dev: user registration
router.post('/signUp', (req, res, next) => {

    let userObj = new userModel.user(
        req.body.name,
        req.body.email,
        req.body.company,
        req.body.role || 'User',
        req.body.password,
        "0x"
    );

    userModel.searchUser({ email: userObj.email }, {}, (err, result) => {
        if (result.length == 0) {
            userModel.addUser(userObj, (err, result) => {
                if (userObj.address === "0x") {
                    let data = ethereum.personal.newAccountWithPK(userObj.password);
                    userObj.address = data.address;
                    let getUserquery = { "email": userObj.email };
                    userModel.editUser(getUserquery, data, (err, result) => {
                        ethereum.eth.sendRawTransaction(config.ethereum.accounts[0].address, config.ethereum.accounts[0].privateKey, data.address, 100);
                        mailDelivery.welcomeEmail(userObj.email, userObj.name);
                        res.json(result);
                    });
                }
            });
        } else
            res.status(400).send('User email is already used by some other account!');
    });

});

// @dev: get all users
router.get('/allUsers', (req, res, next) => {
    userModel.searchUser({}, { password: 0 }, (err, result) => {
        res.json(result);
    });
});


let errorHandler = error => {
    console.error(error.toString());
    res.status(500).send(error.toString());
};

module.exports = router;