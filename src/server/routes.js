(function () {
    'use strict';

    var redis = require('redis');
    var redisClient = redis.createClient();
    var User = require('./user');
    var _ = require('lodash');

    module.exports = function (app, passport) {

        app.get('/', function (req, res) {

            if (req.isAuthenticated()) {
                res.render('editor/index.html', {
                    user: req.user
                });
            } else {
                res.render('editor/login.html');
            }
        });

        app.get('/index', isLoggedIn, function (req, res) {
            res.render('editor/index.html', {
                user: req.user
            });
        });

        app.get('/api/userEmail', isLoggedIn, function (req, res) {
            res.json(req.user.local.email);
        });

        app.get('/api/requestNumber', isLoggedIn, function (req, res) {
            redisClient.get('requestNumber', function (err, reply) {

                if (err)
                    console.log(err);
                else
                    res.json(reply);
            });
        });

        app.get('/api/rooms/:room', isLoggedIn, function (req, res) {
            redisClient.hkeys(req.params.room, function (err, reply) {

                if (err)
                    console.log(err);
                else
                    res.json(reply);
            });
        });

        app.get('/api/rooms', isLoggedIn, function (req, res) {
            redisClient.hkeys('rooms', function (err, reply) {

                if (err)
                    console.log(err);
                else
                    res.json(reply);
            });
        });

        app.get('/api/users', isLoggedIn, function (req, res) {
            User.find({}, 'local.email', function (err, reply) {
                res.json(
                    _.chain(reply).map(function (item) {
                        return item.local.email;
                    })
                );
            });
        });

        app.get('/logout', function (req, res) {
            req.logout();
            res.redirect('/');
        });

        app.get('/login', function (req, res) {
            res.render('editor/login.html', {message: req.flash('loginMessage')});
        });

        app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));

        app.get('/signup', function (req, res) {
            res.render('editor/signup.html', {message: req.flash('signupMessage')});
        });

        app.get('/dashboard', isLoggedIn, function (req, res) {
            res.render('dashboard/index.html');
        });

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/index',
            failureRedirect: '/signup',
            failureFlash: true
        }));

        function isLoggedIn(req, res, next) {

            if (req.isAuthenticated())
                return next();
            res.redirect('/');
        }
    };
})();