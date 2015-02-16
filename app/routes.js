var redis = require("redis")
    , client = redis.createClient();

module.exports = function (app, passport) {


    app.get('/', function (req, res) {

        if (req.isAuthenticated()) {


            var obj = new Object();
            obj.name = "ozi";
            obj.age = "23";
            var jsonString = JSON.stringify(obj);
            client.set("firstjson", jsonString, function (err, reply) {
                console.log(reply.toString());
            });


            res.render('login.html');
        } else {
            res.render('index.html');
        }

    });

    app.get('/index', isLoggedIn, function (req, res) {
        res.render('index.html', {
            user: req.user
        });
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/login', function (req, res) {
        res.render('login.html', {message: req.flash('loginMessage')});
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', function (req, res) {
        res.render('signup.html', {message: req.flash('signupMessage')});
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/index',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/checklogin',function(req,res) {
        if (req.user)
            res.send(true);
        else
            res.send(false);
    });
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
};