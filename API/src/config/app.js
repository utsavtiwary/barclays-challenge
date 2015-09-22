var express = require('express'),
    bodyParser = require('body-parser');


module.exports = function() {
    var app = express();


    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
        next();
    });

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    require('../routes/index.server.routes')(app);
    require('../routes/phone.server.routes')(app);
    require('../routes/beacon.server.routes')(app);

    return app;
};

