module.exports = function (app, passport) {


    app.get('/', function (req, res) {

        if (req.isAuthenticated()) {
            res.render('index.html');
        } else {
            res.render('login.ejs');
        }

    });

    app.get('/index', isLoggedIn, function (req, res) {
        res.render('index.html', {
            //user: req.user
        });
    });


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/index',
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