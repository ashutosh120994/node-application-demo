const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const UL = require('../utility')

const verifyToken = (req, res, next) => {
  let apiResponse = UL.apiResponse;		
  const token = req.headers.authorization;

  console.log('token', token);

  if (!token) {
    apiResponse.error = "A token is required for authentication";
    return res.status(403).json(apiResponse);
  }
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token.split(' ')[1], jwtSecretKey);
    console.log('decoded', decoded);
    req.user = decoded;

  } catch (err) {
    apiResponse.error = "Invalid Token";
    return res.status(401).json(apiResponse);
  }
  return next();
};



module.exports = {
    verifyToken,
};