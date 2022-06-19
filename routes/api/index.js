const express = require('express')
const router = express.Router();
const UserRoutes = require("./userRoutes");

class ApiRoutes {
    constructor() {
        this.route = router;
		this.setRoutes();
    }

    setRoutes() {
        this.route.get('/', this.getdefaultApi);
        let userRoutesInst = new UserRoutes().getRoutes();
        this.route.use('/users', userRoutesInst);
    }

    getRoutes() {
        return this.route;
    }

	getdefaultApi = (req, res) => {
		res.json(
			 {		
				 path: "/api",
			 }
		 );
	 }
}



module.exports = ApiRoutes;