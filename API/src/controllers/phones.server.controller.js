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
    var phoneId = req.params.phoneId;
    var sensorDistances = req.body;

    updateBeaconData(phoneId, sensorDistances)
        .then(function() {
            Phone.findOne({_id: phoneId})
                .populate('beaconData')
                .exec(function (err, phone) {
                    console.log(phone);
                    if (err) return next(err);
                    findClosestBeacon(phone, phone.beaconData).then(function () {
                        res.status(200).end();
                    })
                })
        })
        .catch(function(err) {
            return next(err);
        });
};

function findClosestBeacon(phone, sensorDistances) {
    var promises = [];
    var closestDistance = -500;
    var i = 0;
    for (i; i < sensorDistances.length; i++) {
        if (sensorDistances[i].distance > closestDistance) {
            var promise = Q.defer();
            promises.push(promise);
            closestDistance = sensorDistances[i].distance;
            phone.currentRoomId = sensorDistances[i].beaconId;
            promise.resolve();
        }
    }
    phone.save();
    return Q.all(promises);
}

function updateBeaconData(phoneId, sensorDistances) {
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

exports.getCurrentLocation = function(req, res, next) {
    var phoneId = req.params.phoneId;
    Phone.findOne({_id: phoneId})
        .populate('currentRoomId')
        .select('currentRoomId -_id')
        .exec(function(err, phoneLocation) {
            if (err) return next(err);
            res.json(phoneLocation.currentRoomId);
        })
};

function getDistance(loc1, loc2) {
    var dist = 0;
    if(loc1.city != loc2.city){
        dist += 12*60;
    }
    if(loc2.buildingId != loc1.buildingId){
        dist += 30;
    }
    if(loc1.floor != loc2.floor){
        dist += 10;
    }
    return dist;
}