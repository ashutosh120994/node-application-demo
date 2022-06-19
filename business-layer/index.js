const UserBL = require('./users'); 

class BusinessLayer {
    constructor() {
        this.userBL = new UserBL();
    }
}

let BL = new BusinessLayer();

module.exports = BL;