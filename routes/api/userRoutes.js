const express = require('express')
const router = express.Router();
const BL = require("../../business-layer");
const UL = require("../../utility");

const { authMiddleware: { verifyToken }, usersMiddleware} = require('../../middlewares')

const ApiResponse = require('../../utility/response');
class UserRoutes {
	constructor() {
        this.route = router;
		this.setRoutes();
    }

    setRoutes() {
        this.route.post('/login', this.login);
		this.route.get('/profile', verifyToken, this.getProfile);
		this.route.post('/profile', verifyToken, this.updateProfile);
    }

    getRoutes() {
        return this.route;
    }

	login = async (req, res) => {

		let apiResponse = new ApiResponse();
		try {

			const { username, password } = req.body;

			let promObj = BL.userBL.login(username, password);
			promObj.then(data => {
				return data;
			})
			apiResponse.data = await promObj;
		} catch (err) {
			console.log('userRoutes.js login() api failed', err);
			apiResponse.error = err;
		}

		res.json(apiResponse);
		
    }

	getProfile = async (req, res) => {
		let apiResponse = new ApiResponse();
		try {
			const { userId } = req.user;		
			let promObj = BL.userBL.getProfile(userId);
			promObj.then(data => {
				return data;
			})
			apiResponse.data = await promObj;
		} catch (err) {
			console.log('userRoutes.js updateProfile() api failed', err);
			apiResponse.error = err;
		}
		res.json(apiResponse);
	}

	updateProfile = async (req, res) => {
		let apiResponse = new ApiResponse();

		try {
			const { userId } = req.user;
			const { selectedTheme } = req.body;
			let promObj = BL.userBL.updateProfile(userId, selectedTheme);
			
			apiResponse.data = await promObj;
		} catch (err) {
			console.log('userRoutes.js updateProfile() api failed', err);
			apiResponse.error = err;
		}
		res.json(apiResponse);
	}

}
 
module.exports = UserRoutes;