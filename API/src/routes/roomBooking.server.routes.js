/**
 * Created by utsavtiwary on 22/09/2015.
 */
var roomBookings = require('../controllers/roomBooking.server.controller');

module.exports = function(app) {
    app.post('/phones/:phoneId/roomNow/', roomBookings.getFreeRooms);
};