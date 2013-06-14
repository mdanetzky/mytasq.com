/* 
 * Copyright 2013 MyTasq.com
 * Author: Matthias Danetzky
 */

var passport = require('passport')
        , util = require('util')
        , LocalStrategy = require('passport-local').Strategy
        , FacebookStrategy = require('passport-facebook').Strategy
        , User = require('../models/user')
        , log = require('../lib/mt.logger')(module)
        ;

var FACEBOOK_APP_ID = "383872208397187";
var FACEBOOK_APP_SECRET = "8ab65e5a243166b7e3807de0167b6e39";

// Passport session serializers
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://mytasq.com/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {

    // asynchronous verification, for effect...
    process.nextTick(function() {
        User.findOne({'facebook.uid': profile.id}, function(err, user) {
            if (err) {
                done(err);
            }
            if (user) {
                log.info('User: ' + user.firstname + ' ' + user.lastname + ' found and logged in!');
                done(null, user);
            } else {
                var newuser = new User();
                var account = {'facebook.uid': profile.id};
                newuser.accounts.push(account);
                newuser.firstname = profile.name.givenName;
                newuser.lastname = profile.name.familyName;
                newuser.email = "TBD...";

                newuser.save(function(err) {
                    if (err) {
                        done(err);
                    }
                    log.info('New user: ' + newuser.firstname + ' ' + newuser.lastname + ' created and logged in!');
                    done(null, newuser);
                });
            }
        });
    });
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, User.authenticate()));
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


module.exports = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
    app.get('/auth/facebook',
            passport.authenticate('facebook'),
            function(req, res) {
                // The request will be redirected to Facebook for authentication, so this
                // function will not be called.
            });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
    app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};