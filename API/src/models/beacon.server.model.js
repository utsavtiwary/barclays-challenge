/**
 * Created by utti on 18/09/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var beaconSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        default: "Unknown"
    },
    buildingId: {
        type: Number,
        default: 0
    },
    floor: {
        type: Number,
        default: -25
    },
    booked: {
        type: Boolean,
        default: false
    },
    capacity: {
        type: Number,
        default: 0
    },
    facilities: {
        type: {
            whiteboard: {
                type: Boolean
            },
            screen: {
                type: Boolean
            },
            phones: {
                type: Boolean
            }
        },
        default: {
            videoCon: false,
            wheelChairAccess: false,
            projector: false
        }
    }
});

module.exports = mongoose.model('Beacon', beaconSchema);
