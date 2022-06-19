const express = require('express')
const Routes = require("./routes").Routes;
const cors=require("cors");
const { handleProcessAndAppErrors } = require('./database/handler');

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let routesInst = new Routes().getRoutes();
app.use('/', routesInst);

app.listen(port, () => console.log(`node application demo app listening on port ${port}!`));
handleProcessAndAppErrors(app, process);
