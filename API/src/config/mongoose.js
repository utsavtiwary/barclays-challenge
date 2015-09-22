/**
 * Created by utti on 09/07/2015.
 */
var Q = require('q');

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    require('../models/phone.server.model');
    require('../models/beacon.server.model');
    require('../models/beaconData.server.model');

    return db;
};