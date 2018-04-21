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


app.use('/home', homeRouter);
app.use('/users', usersRouter);
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
    // set locals, only providing error in developmentjhjgg
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
