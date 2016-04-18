var cluster = require('cluster');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var errors = require('express-stackman');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errors());

//session
var options = {
    path: "./tmp/sessions/",
    useAsync: true,
    reapInterval: 5000,
    maxAge: 10000
};
app.use(session({
    store: new FileStore(options),
    secret: 'kskw2016qwe123',
    resave: true,
    saveUninitialized: true
}));

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/users', require('./routes/users'));
app.use('/tasks', require('./routes/tasks'));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // error handlers
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: err
//     });
// });

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    if (cluster.isWorker) {
        console.log('worker #%d up, app server listening at http://%s:%s', cluster.worker.id, host, port);
    }
});

module.exports = app;