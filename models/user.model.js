const mongoHelper = require('../helpers/mongo.helper');
const mongoConfig = require('../config/mongo');

module.exports = {

    user: function(name, email, company, role, password, address, privatekey) {
        this.name = name;
        this.email = email;
        this.password = password || null;
        this.company = company;
        this.role = role;
        this.address = address;
    },

    addUser: (data, cb) => {
        mongoHelper.insertDocument(data, mongoConfig.userCollection, cb);
    },

    editUser: (condition, data, cb) => {
        mongoHelper.updateDocument(condition, data, mongoConfig.userCollection, cb);
    },

    searchUser: (condition, exclude, cb) => {
        mongoHelper.searchDocument(condition, exclude, mongoConfig.userCollection, cb);
    },

    deleteUser: (condition, cb) => {
        mongoHelper.deleteDocument(condition, mongoConfig.userCollection, cb);
    },

    searchRoles: (condition, exclude, cb) => {
        mongoHelper.searchDocument(condition, exclude, mongoConfig.roleCollection, cb);
    }
};