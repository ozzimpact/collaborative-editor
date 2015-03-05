var redis = require('redis'),
    redisClient = redis.createClient();

module.exports = function (app, passport) {
    app.get('/', function (req, res) {

        if (req.isAuthenticated()) {
            res.render('index.html', {
                user: req.user
            });
        } else {
            res.render('login.html');
        }

    });

    app.get('/index', isLoggedIn, function (req, res) {
        res.render('index.html', {
            user: req.user
        });
    });


    app.get('/api', isLoggedIn, function (req, res) {
        redisClient.hgetall('frameworks', function (err, object) {
            res.json(object);
        });
    });

    app.post('/api', function (req, res) {
        redisClient.hmset('try1', {
            'userEmail': req.user.local.email,
            'password': req.user.local.password,
            'text': 'this is an example of redis post with hmset.'
        }, function (reply, err) {
            console.log(reply);
        });

    });
    app.get('/userEmail', isLoggedIn, function (req, res) {
        res.json(req.user.local.email);
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


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
};