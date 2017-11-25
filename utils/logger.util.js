const express = require('express');
const loggerModel = require('../models/logger.modal');
const chalk = require('chalk');
const log = console.log;


let logError = (err, route) => {
    if (err) {
        data = {
            "error": err,
            "route": route,
            "timeStamp": new Date().toUTCString()
        };
        log(chalk.bold.red(JSON.stringify(data)));
        loggerModel.WriteLog(data, () => {});
    }
    return true;
};

let printWarn = (err, methodName, address) => {
    if (err) {
        data = {
            "error": err,
            "timeStamp": new Date().toUTCString(),
            "methodName": methodName,
            "address": address
        };
        log(chalk.bold.yellow(JSON.stringify(data)));
        loggerModel.WriteLog(data, () => {});
    }
    return true;
};

module.exports = { logError };