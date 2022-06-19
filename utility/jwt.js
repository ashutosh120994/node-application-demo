const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

class Jwt {
    constructor() {
    }

    generateToken(_data) {
        let token = null;
        let _jwtSecretKey = process.env.JWT_SECRET_KEY;
    
        if (_data && _data._id && _jwtSecretKey) {
            let _payLoad = {
                userId: _data._id.toString(),
            };
            let _jwtOptions = {
                expiresIn: (24 * 60 * 60),
            }
            console.log('_payLoad', _data._id.toString());
            token = jwt.sign(_payLoad, _jwtSecretKey, _jwtOptions);
        }
        return token;
    }
}

module.exports = Jwt;

