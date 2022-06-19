const { nodeMongoInst, NodeMongoCls } = require('./connection/db');

const handleProcessAndAppErrors = (_app, _process) => {

    _app.on('error', (error, ctx) => {
        let data = {
            error: error,
            ctx: ctx
        }
        console.log('server.js - app error event', data);
    });

    _process.on('SIGINT', () => { // interrupt signal like ctrl + c //TODO: check can we get exception object
        console.log('server.js - process SIGINT event', {});
        NodeMongoCls.closeGlobalConnection();

        _process.exit(0);
    });

    _process.on('SIGTERM', () => { //on kill (not supported on windows) //TODO: check can we get exception object
        console.log('server.js - process SIGTERM event', {});
        NodeMongoCls.closeGlobalConnection();

    });
    _process.on('uncaughtException', (exception) => {
        console.log('server.js - process uncaughtException event', exception);
        NodeMongoCls.closeGlobalConnection();
    });

    _process.on('exit', (code) => { //nothing in event loop
        console.log('server.js - process exit event', code);
        NodeMongoCls.closeGlobalConnection();
    });

}

module.exports = {
    handleProcessAndAppErrors
}