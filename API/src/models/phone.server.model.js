/**
 * Created by utti on 14/07/2015.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var phoneSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    beaconData: {
        type: [{type:String, ref: "BeaconData"}],
        default: []
    },
    currentRoomId: {
        type: String,
        default: 0
    }
});

module.exports = mongoose.model('PhoneData', phoneSchema);
