var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('tradeassist:server');
var http = require('http');

var express_app = express();



var index = require(__dirname + '/routes/index');
var users = require(__dirname + '/routes/users');
// var trade = require('./routes/trade');

console.log("HEYY");
// view engine setup
express_app.set('views', path.join(__dirname, '/views'));
express_app.locals.basedir = __dirname + '/views';
express_app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//express_app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
express_app.use(logger('dev'));
express_app.use(bodyParser.json());
express_app.use(bodyParser.urlencoded({ extended: false }));
express_app.use(cookieParser());
express_app.use(express.static(path.join(__dirname, '/public')));

express_app.use(__dirname + '/', index);
express_app.use(__dirname + '/users', users);

// catch 404 and forward to error handler
express_app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
express_app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

//////

// module.exports = express_app;
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
express_app.set('port', port);

express_app.use(function (req, res) {
    res.send({ msg: "hello" });
});

/**
 * Create HTTP server.
 */

var server = http.createServer(express_app);

// require in the WebSocketServer module which sets up the websocket backend server
//  WebSocketServer() also implements the back-end client servers which pull data from exchanges
//  all data is routed through WebSocketServer before it is either parsed 
var WSS = require(__dirname + '/socket.js');
const wss = new WSS.WebSocketServer();

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

let router = express.Router();
console.log("Okay");
router.get('/', function(req, res, next) {
	console.log("UHHH OKAY");
  	res.render(__dirname + '/views/pages/index.jade', { title: 'Trade Assist UI' });
  	// res.render('lol');
});