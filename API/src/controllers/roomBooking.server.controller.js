/**
 * Created by utsavtiwary on 22/09/2015.
 */
var Phone = require('../models/phone.server.model');
var request = require('request');
var Beacon = require('../models/beacon.server.model');

exports.bookRoomNow = function(req, res, next) {
    var capacity = req.body.capacity;
    var duration = req.body.duration;
    var location = req.body.location;

    var freeRoomList = getRoomsFromExternal(capacity, duration, location);
    var roomList;

    roomList = requestMockAPI(location, capacity, duration);

    orderRooms(roomList);

    replyPhone(roomList);
};

function getRoomsFromExternal(capacity, duration, location) {
    Beacon.findOne(location, function(err, rooms) {
        if (rooms.length > 2) {
            return(rooms.slice(0, 2));
        } else {
            Beacon.findOne({city: location.city, buildingId: location.buildingId}, function(err, rooms) {
                if (rooms.length > 2) {
                    return(rooms.slice(0, 2));
                } else {
                    return rooms;
                }
            });
        }
    });
}