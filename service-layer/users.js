const { nodeMongoInst } = require('../database/connection/db');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
let ObjectId = require('mongodb').ObjectId;
const UL = require("../utility");

class UserDL {
    async login(_username, _password) {
        try {
            const collection = 'users';

            const filter = {};
            filter.username = _username;
            filter.password = _password;

            const limit = 1;

            const user = await nodeMongoInst.find(collection, filter, {}, limit);

            if (!user.length) {
                throw 'user not found';
            }

            const token = await UL.jwt.generateToken(user[0]);
            
            if (!token) {
                throw 'There was some internal error while login';
            }

            return Promise.resolve({ user, token });
        } catch (error) {
            console.log("error", error)
            return Promise.reject(error);
        }

    }
    async getProfile(_userId) {
        try {
            const collection = 'profiles';

            const filter = {};
            filter.user_id = typeof _userId == 'string' ? ObjectId(_userId) : _userId;

            const limit = 1;
            console.log('filter', filter);
            const projection = {
                "username": 1,
            };

            const profile = await nodeMongoInst.find(collection, filter, {}, limit);

            if (!profile.length) {
                throw 'Profile not found';
            }

            return Promise.resolve({ profile: profile[0] });
        } catch (error) {
            console.log("error", error)
            return Promise.reject(error);
        }
    }

    async updateProfile(_userId, _selectedTheme) {
        try {
            const collection = 'profiles';

            const filter = {};
            filter.user_id = typeof _userId == 'string' ? ObjectId(_userId) : _userId;
            const limit = 1;
            const updateProps = {
                theme: _selectedTheme
            }
            
            const profile = await nodeMongoInst.find(collection, filter, {}, limit);
            let updateProfile;
            
            if(!profile.length){
                updateProps.user_id = typeof _userId == 'string' ? ObjectId(_userId) : _userId;
                updateProfile = await nodeMongoInst.insertOne(collection, null, updateProps);
                console.log('insertOne', updateProfile)
                return Promise.resolve({ profile: updateProfile, updateProfile });
            } else {
                
                updateProfile = await nodeMongoInst.updateOne(collection, filter, {$set: updateProps})
                .catch((dbError)=> {
                    if (dbError && dbError.data && !(dbError.data.n === 1) && !(dbError.data.nModified === 0)) {
                        throw dbError;
                    }
                });
                
                if(!updateProfile) {
                    throw 'Profile update failed';
                }

                console.log('updateOne', updateProfile)
                return Promise.resolve(true);
            }

        } catch (error) {
            console.log("error", error)
            return Promise.reject(error);
        }
    }
}

module.exports = UserDL;