var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const mongodb = {
    dbIPAddress: 'localhost',
    dbPort: 27017,
    // dbUserName: '',
    // dbPassword: '',
    dbName: 'test'
}

class NodeMongoCls {

    setConnectionURL() {
        let promObj = new Promise((resolve, reject) => {
            let con = mongodb;
            if (this.connectionURL) {
                resolve();
            }
            else if (con && con.dbIPAddress && con.dbPort) {
                this.dbName = con.dbName;

                if (con.dbUserName && con.dbPassword) {
                    con.dbUserName = encodeURIComponent(con.dbUserName);
                    con.dbPassword = encodeURIComponent(con.dbPassword);
                    this.connectionURL = `mongodb://${con.dbUserName}:${con.dbPassword}@${con.dbIPAddress}:${con.dbPort}/?authSource=admin`;
                    //authSource = db to validate credentials
                } else {
                    this.connectionURL = `mongodb://${con.dbIPAddress}:${con.dbPort}`;
                }
                resolve();
            }
            else {
                reject('db params failed');
            }
        });


        promObj = promObj.catch((err) => {
            console.log('err', err)
            throw err;
        })

        return promObj;

    }

    getConnection() {
        var promObj = new Promise((resolve, reject) => {

            if (NodeMongoCls.globalConnection && NodeMongoCls.globalDB) {
                let client = NodeMongoCls.globalConnection;
                let db = NodeMongoCls.globalDB;
                resolve(db, client);
            } else {
                let conPromObj = this.setConnectionURL();

                conPromObj.then(() => {
                    MongoClient.connect(this.connectionURL, {
                        useNewUrlParser: true
                    })
                        .then((client) => {
                            let db = client.db(this.dbName);
                            console.log('node-mongo ', 'Connected successfully to DB server');

                            NodeMongoCls.globalConnection = client;
                            NodeMongoCls.globalDB = db;

                            resolve(db, client);
                        })
                        .catch((err) => {
                            reject(err);
                        });

                })
                    .catch((err) => {
                        reject(err);
                    });

            }

        });


        promObj = promObj.catch((err) => {
            console.log(err);
            throw err;
        })

        return promObj;
    }

    closeConnection(_client) {
        if (_client) {
            // _client.close();
            console.log("Disconnected from DB server");
        }
    }
    static closeGlobalConnection() {
        if (NodeMongoCls.globalConnection) {
            NodeMongoCls.globalConnection.close();
            NodeMongoCls.globalConnection = null;
            NodeMongoCls.globalDB = null;
            console.log('node-mongo closeGlobalConnection()', "Disconnected from DB server");
        }
    }

    find(_collectionName, _filter, _projection, _limit, _sort) {

        var promObj = new Promise((resolve, reject) => {
            if (_collectionName) {
                let collation = {};
                if (!_filter) {
                    _filter = {}
                }
                if (!_projection) {
                    _projection = {}
                }
                if (!_limit) {
                    _limit = 50;
                }
                if (!_sort) {
                    _sort = {}
                } else if (Object.keys(_sort).length) {
                    collation = {
                        'locale': 'en'
                    };
                }

                this.getConnection().
                    then((db, client) => {
                        db.collection(_collectionName)
                            .find(_filter)
                            .collation(collation)
                            .sort(_sort)
                            .limit(_limit)
                            .project(_projection)
                            .toArray()
                            .then((data) => {
                                // this.closeConnection(client);
                                resolve(data);
                            })
                            .catch((err) => {
                                // this.closeConnection(client);
                                reject(err);
                            })

                    })
                    .catch((err) => {
                        reject(err);
                    })
            } else {
                reject("Input params validation failed!");
            }
        })

        promObj = promObj.catch((err) => {
            console.log('err', err);
            throw err;
        })

        return promObj;
    }


    insertOne(_collectionName, _keyName, _document) {

        var promObj = new Promise((resolve, reject) => {
            if (_collectionName && _document) {
                _document['_id'] = new ObjectId();
                if (_keyName) {
                    _document[_keyName] = _document['_id'];
                }

                this.getConnection().
                    then((db, client) => {
                        db.collection(_collectionName)
                            .insertOne(_document)
                            .then((res) => {
                                // this.closeConnection(client);

                                if (res && res.insertedCount == 1) {
                                    resolve(res.insertedId);
                                } else {
                                    reject(res);
                                }
                            })
                            .catch((err) => {
                                //  this.closeConnection(client);
                                reject(err);
                            })

                    })
                    .catch((err) => {
                        reject(err);
                    })

            } else {
                reject("Input params validation failed!");
            }

        });

        promObj = promObj.catch((err) => {
            //high
            console.log('err', err);
            throw err;
        })

        return promObj;
    }

    updateOne(_collectionName, _filter, _updateProp) {

        var promObj = new Promise((resolve, reject) => {

            if (_collectionName && _filter && _updateProp) {

                this.getConnection().
                    then((db, client) => {

                        db.collection(_collectionName)
                            .updateOne(_filter, _updateProp)
                            .then((res) => {
                                // this.closeConnection(client);

                                if (res && res.modifiedCount == 1) {
                                    resolve(res.modifiedCount);
                                } else {
                                    reject(res);
                                }
                            })
                            .catch((err) => {
                                //  this.closeConnection(client);
                                reject(err);
                            })

                    })
                    .catch((err) => {
                        reject(err);
                    })

            } else {
                reject("Input params validation failed!");
            }

        });

        promObj = promObj.catch((err) => {
            console.log('err', err);
            throw err;
        })

        return promObj;
    }
}

NodeMongoCls.globalConnection = null;
NodeMongoCls.globalDB = null;


let nodeMongoInst = new NodeMongoCls();


module.exports = {
    nodeMongoInst,
    NodeMongoCls
};