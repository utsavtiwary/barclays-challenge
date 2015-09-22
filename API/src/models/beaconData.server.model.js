/**
 * Created by utti on 18/09/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var beaconDataSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        default: 10000000
    },
    beaconId: {
        type: String,
        ref: 'Beacon',
        required: true
    }
});

module.exports = mongoose.model('BeaconData', beaconDataSchema);
