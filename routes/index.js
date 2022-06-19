const express = require('express')
const router = express.Router();
const ApiRoutes = require('./api');

class Routes {
    constructor() {
        this.route = router;
        this.setRoutes();
    }

    setRoutes() {
        this.route.get('/', this.getDefaultRoute);
        this.route.get('/testRoute', this.getDefaultRoute);
        let apiRoutesInst = new ApiRoutes().getRoutes();
        this.route.use('/api', apiRoutesInst);
    }

    getRoutes() {
        return this.route;
    }
 
    getDefaultRoute = (req, res) => {
       res.json(
            {
                response: "/testRoute",
            }
        );
    }
}
 
module.exports = {
    Routes,
} 