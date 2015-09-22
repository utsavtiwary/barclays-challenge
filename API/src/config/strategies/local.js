/**
 * Created by utti on 30/07/2015.
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');

module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne(
            {username: username, deleted: false},
            function(err, user) {
                console.log("It gets here!");
                if (err) {
                    console.log("An Error occured");
                    return done(err);
                }

                if (!user) {
                    console.log("No user of this kind exists");
                    return done(null, false, {message: 'Unknown user'});
                }

                if (!user.authenticate(password)) {
                    console.log("Password did not match");
                    return done(null, false, {message: 'Invalid password'});
                }

                return done(null, user);
            }
        );
    }));
};