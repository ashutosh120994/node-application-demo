const UserDL = require('./users');

class ServiceLayer {
    constructor() {
        this.userDL = new UserDL();
    }
}

let SL = new ServiceLayer();

module.exports = SL;