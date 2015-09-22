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
    }
});

module.exports = mongoose.model('Beacon', beaconSchema);
