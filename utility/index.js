const jwt = require('./jwt'); 
const apiResponse = require('./response'); 

class UtilityLayer {
    constructor() {
        this.jwt = new jwt();
        this.apiResponse = new apiResponse();
    }
}

let UL = new UtilityLayer();

module.exports = UL;