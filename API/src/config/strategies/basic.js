/**
 * Created by utti on 01/09/2015.
 */

/**
 * Created by utti on 30/07/2015.
 */

var passport = require('passport'),
    BasicStrategy = require('passport-http').BasicStrategy,
    User = require('mongoose').model('User');

module.exports = function () {
    passport.use(new BasicStrategy(
        function (userid, password, done) {
            User.findOne({username: userid, deleted: false}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                if (!user.authenticate(password)) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }));
};