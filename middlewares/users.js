const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const checkParams = (req, res, next) => {
    console.log('checkParams');
    return next();
};

module.exports = {
    checkParams,
};