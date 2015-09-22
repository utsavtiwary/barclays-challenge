/**
 * Created by utti on 18/09/2015.
 */
var Beacon = require('../models/beacon.server.model');

exports.addBeacon = function(req, res, next) {
    var newBeacon = new Beacon(req.body);
    Beacon.findById(req.body._id, function(err, beacon) {
        if (err) return next(err);
        if (beacon) {
            res.status(400).end();
        } else {
            newBeacon.save(function (err) {
                if (err) return next(err);
                res.status(200).end();
            })
        }
    })
};

exports.getAllBeacons = function(req, res, next) {
    Beacon.find({}, function(err, beacons) {
        if (err) return next(err);
        res.json(beacons);
    })
};