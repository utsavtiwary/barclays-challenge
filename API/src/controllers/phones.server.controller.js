/**
 * Created by utti on 18/09/2015.
 */
var Phone = require('../models/phone.server.model');
var BeaconData = require('../models/beaconData.server.model');
var Beacon = require('../models/beacon.server.model');
var Q = require('q');

exports.addPhone = function(req, res, next) {
    var newPhone = new Phone(req.body);
    Phone.findById(newPhone._id, function(err, phone) {
        if (err) return next(err);
        if (phone) {
            res.status(400).end();
        } else {
            Beacon.find({}, function(err, beacons) {
                if (err) return next(err);
                saveBeacons(beacons, newPhone).then(function(){
                    newPhone.save(function(err) {
                        if (err)
                            return next(err);
                        else {
                            res.status(200).end();
                        }
                    });
                });
            });
        }
    })
};

function saveBeacons(beacons, newPhone) {
    var promises = [];
    beacons.map(function(beacon) {
        promises.push(Q.defer());
        var phoneBeaconId = newPhone.id + ":" + beacon.id;
        newPhone.beaconData.push(phoneBeaconId);
        new BeaconData({_id: phoneBeaconId, beaconId: beacon.id}).save();
        promises[promises.length-1].resolve();
    });

    return Q.all(promises);
}

exports.getAllPhones = function(req, res, next) {
    Phone.find({})
        .populate('beaconData')
        .exec(function(err, phones) {
            if (err) return next(err);
            res.json(phones);
        });
};

exports.deletePhone = function(req, res, next){
    var phoneId = req.params.phoneId;
    Phone.remove({_id: phoneId}, function(err) {
        if (err) return next(err);
        res.status(200).end();
    })
};

exports.updatePhoneBeaconData = function(req, res, next) {
    console.log("Entering Update phone baecon data")
    var phoneId = req.params.phoneId;
    var sensorDistances = req.body;

    Phone.findById(phoneId)
        .populate('beaconData')
        .exec(function(err, phone) {
            if (err) return next(err);
            var oldPosition = phone.currentRoomId;
            var closest = {sensorId: 0, distance: -1000};
            var secondClosest = {sensorId: 0, distance: -1000};
            sensorDistances.map(function(sensorDist) {
                if (sensorDist.distance > closest.distance) {
                    secondClosest = {sensorId: closest.sensorId, distance: closest.distance};
                    closest = {sensorId: sensorDist.sensorId, distance: sensorDist.distance};
                } else if (sensorDist.distance > secondClosest.distance){
                    secondClosest = {sensorId: sensorDist.sensorId, distance: sensorDist.distance};
                }
                if ((closest.distance - secondClosest.distance) > 5) {
                    phone.currentRoomId = closest.sensorId;
                } else {
                    phone.currentRoomId = oldPosition;
                }
            });
            if (phone.currentRoomId !== oldPosition) {
                updateBeaconData(phoneId, sensorDistances, next)
                    .then(function() {
                        phone.save(function(err) {
                            if (err) return next(err);
                            else {
                                res.status(200).end();
                            }
                        });
                    })
                    .fail(function() {
                        return next(err);
                    });
            }
            else {
                res.status(200).end();
            }
        })
};

function updateBeaconData(phoneId, sensorDistances, next) {
    var promises = [];
    sensorDistances.map(function(sensor) {
        var promise = Q.defer();
        promises.push(promise);


        var beaconDataId = phoneId + ":" + sensor.sensorId;
        var query = {_id: beaconDataId};
        var update = {_id: beaconDataId, distance: sensor.distance, beaconId: sensor.sensorId};
        var options = {};
        BeaconData.update(query, update, options, function(err) {
            if (err) promise.reject(new Error(err));
            else {
                promise.resolve();
            }
        })
    });
    return Q.all(promises);
}