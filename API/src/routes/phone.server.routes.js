/**
 * Created by utti on 18/09/2015.
 */

var phones = require('../controllers/phones.server.controller');

module.exports = function(app) {
    app.post('/phones', phones.addPhone);
    app.get('/phones', phones.getAllPhones);

    app.delete('/phones/:phoneId', phones.deletePhone);

    app.put('/phones/:phoneId/beaconData', phones.updatePhoneBeaconData);

    app.get('/phones/:phoneId/currentRoom')
};