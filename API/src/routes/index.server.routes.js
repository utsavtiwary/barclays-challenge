/**
 * Created by utti on 18/09/2015.
 */

var index = require('../controllers/index.server.controller');

module.exports = function(app) {
    app.get('/', index.render);
};