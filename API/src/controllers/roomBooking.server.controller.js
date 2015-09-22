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
    var startTime = new Date();
    var endTime = new Date(startTime.getTime() + duration * 60000);
    console.log("Start Time:", startTime, "End Time:", endTime);
    var deferred = Q.defer();
    location['booked'] = false;
    var query1 = {
        city: location.city, buildingId: location.buildingId, floor: location.floor, booked: false,
        "capacity": { $gt: capacity }};
    Beacon.find(query1, function(err, rooms) {
        if(err) deferred.reject(err);
        if (rooms.length > 2) {
            deferred.resolve(rooms.slice(0, 2));
        } else {
            var query2 = {city: location.city, buildingId: location.buildingId, booked: false,
                        "capacity": { $gt: capacity }}
            Beacon.find(query2, function(err, newRooms) {
                if (err) deferred.reject(err);
                if (newRooms.length > 2) {
                    deferred.resolve(orderRooms(newRooms.slice(0, 2), location));
                } else {
                    deferred.resolve(orderRooms(newRooms, location));
                }
            });
        }
    });
    return deferred.promise;
}

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

function orderRooms(rooms, location) {
    if (rooms.length > 1) {
        var orderedRooms = [];
        if (getDistance(rooms[0], location) < getDistance(rooms[1], location)) {
            orderedRooms.push(rooms[0]);
            orderedRooms.push(rooms[1]);
        }
        else {
            orderedRooms.push(rooms[1]);
            orderedRooms.push(rooms[0]);
        }
        return orderedRooms;
    } else return rooms;
}