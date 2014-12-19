//node server
var express = require('express');
port = process.env.PORT || 8080;
mongoose = require('mongoose');
passport = require('passport');
flash = require('connect-flash');
morgan = require('morgan');
cookieParser = require('cookie-parser');
bodyParser = require('body-parser');
session = require('express-session');
path = require('path');
configDB = require('./config/database.js');
app = express();


mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({secret: 'secret angular'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname, 'css'));
app.use(express.static(__dirname, 'js'));
app.use(express.static(__dirname, 'woff'));


require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);
