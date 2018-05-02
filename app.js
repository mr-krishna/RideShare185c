var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var kcRouter = require('./routes/loaddb');
//var bookRouter = require('./routes/bookride');
var bodyParser = require('body-parser');
var homeRouter = require('./routes/index');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/nosql');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});



// db.once('open', function () {
//     console.log('connected to MongDB');
// });
//
// //check for db errors
// db.on('error',function (err) {
//     console.log('error in db conncetion '+ err);
// });


// taxi.find({"user_id" : 1417},function (err, all) {
//     console.log(all);
// })


var app = express();

//use sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));
app.listen(3000, function () {
    console.log('server started on 3000')
});
// console.log('server started on port 3000...')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// serve static files from template
app.use(express.static(__dirname + '/templateLogReg'));

app.use('/home', homeRouter);
// include routes
//var routes = require('./routes/router');
//app.use('/', routes);
//app.use('/users', usersRouter);
app.use('/', kcRouter);

//app.use('/book',bookRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
