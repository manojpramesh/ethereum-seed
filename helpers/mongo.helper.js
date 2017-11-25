const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = require('../config/mongo').url;

var mongoUtil = {

    insertDocument: (data, collection, callback) => {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection(collection).insertOne(data, function(err, result) {
                assert.equal(err, null);
                db.close();
                callback(null, result);
            });
        });
    },

    updateDocument: (condition, data, collection, callback) => {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection(collection).updateOne(condition, {
                $set: data,
                $currentDate: { "lastModified": true }
            }, function(err, results) {
                assert.equal(err, null);
                callback(null, results);
            });
        });
    },

    searchDocument: (field, exclude, collection, callback) => {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            var cursor = db.collection(collection).find(field, exclude || {});
            var result = [];
            cursor.each(function(err, doc) {
                assert.equal(err, null);
                if (doc != null) {
                    result.push(doc);
                } else {
                    db.close();
                    callback(null, result);
                }
            });
        });
    },

    deleteDocument: (field, collection, callback) => {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection(collection).remove(field);
            var result = "";
            assert.equal(err, null);
            db.close();
            callback(null, result);
        });
    },

    getDocumentCount: (collection, callback) => {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection(collection).count({}, function(error, numOfDocs) {
                assert.equal(err, null);
                count = numOfDocs;
                db.close();
                callback(null, numOfDocs);
            });
        });
    }
};

module.exports = mongoUtil;