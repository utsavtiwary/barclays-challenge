/**
 * Created by utsavtiwary on 22/09/2015.
 */
var Phone = require('../models/phone.server.model');
var request = require('request');
var Beacon = require('../models/beacon.server.model');
var Q = require('q');

exports.getFreeRooms = function(req, res, next) {
    var capacity = req.body.capacity;
    var duration = req.body.duration;
    var location = req.body.location;

    getRoomsFromExternal(capacity, duration, location)
        .then(function(rooms) {
            res.json(rooms);
        })
        .catch(function(err) {
            return next(err);
        })

};

function getRoomsFromExternal(capacity, duration, location) {
    var deferred = Q.defer();
    Beacon.find(location, function(err, rooms) {
        if(err) deferred.reject(err);
        if (rooms.length > 2) {
            deferred.resolve(rooms.slice(0, 2));
        } else {
            Beacon.find({city: location.city, buildingId: location.buildingId}, function(err, newRooms) {
                if (err) deferred.reject(err);
                if (newRooms.length > 2) {
                    deferred.resolve(newRooms.slice(0, 2));
                } else {
                    deferred.resolve(newRooms);
                }
            });
        }
    });
    return deferred.promise;
}