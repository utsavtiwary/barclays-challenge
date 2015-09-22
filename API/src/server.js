process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/app'),
    http = require('http');


var db = mongoose();
var app = express();

var server = http.createServer(app);

server.listen(config.port);

module.exports = server;
console.log(process.env.NODE_ENV  + ' server running at http://localhost:' + config.port);