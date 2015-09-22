/**
 * Created by utti on 18/09/2015.
 */
var beacon = require('../controllers/beacon.server.controller');

module.exports = function(app) {
    app.post('/beacons', beacon.addBeacon);
    app.get('/beacons', beacon.getAllBeacons);
};