var express = require('express'),
  port = process.env.PORT || 8000,
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  http = require('http'),
  morgan = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  path = require('path'),
  configDB = require('./src/server/dbconfig'),
  cluster = require('cluster'),
  socketio = require('./src/server/socketio');

mongoose.connect(configDB.url);

var isWin = /^win/.test(process.platform),
num_processes = require('os').cpus().length;

var app = express();

app.set('view engine', 'ejs');
app.set('editorModels', __dirname + '/views/editor');
app.set('dashboardModels', __dirname + '/views/dashboard');
app.engine('html', require('ejs').renderFile);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'secret angular'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));



require('./src/server/routes.js')(app, passport);

if (!isWin) {
    if (cluster.isMaster) {
        console.log(num_processes);
        for (var i = 0; i < num_processes; i++) {
            cluster.fork();
        }
    }
    else
        bootstrap();

} else bootstrap();
function bootstrap(){

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);

  var sio = socketio.attach(server);
  require('./src/server/passport')(sio, passport);
});
}
