
var express = require('express');
var app = express();
// const url = require("url");
var router = express.Router();
app.set('view engine', 'ejs');
//taxi_model is the name of the schema generated
var taxi = require('../models/taxi_model')
var mongoose = require('mongoose');
//connect to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/nosql');
var db = mongoose.connection;
db.once('open', function () {
    console.log('connected to MongoDB');
});

//check for db errors
db.on('error',function (err) {
    console.log('error in db conncetion '+ err);
});

var conn = mongoose.connection;
// conn.collection('kc').insert(user);
/* GET home page. */
router.get('/', function (req, res, next) {
    conn.collection('taxi').findOne({},function (err, ride) {

        if (err) {
            console.log(err);
            res.send(err)
        }
        else {
            //console.log('inside index');
            console.log(ride)
            res.render('index.jade', {
                title: 'ride booked for',
                ride_history:ride
            });
        }
    });
});

router.get('/book',function (req,res,next) {

        console.log('inside index');
        //console.log(ride)
        res.render('book.jade');

});

router.post('/book',function (req, res) {
    console.log('inside /book');
    let book_ride = new taxi();
    book_ride.pickup_location.coordinates = [req.body.p_long,req.body.p_lat];
    book_ride.drop_location.coordinates = [req.body.d_long,req.body.d_lat];
    book_ride.user_id = req.body.userid;
       book_ride.save(function (err, val) {
        if(err)
        {
            console.log('error while persist into db');
            return;
        }
        else{
            console.log("here",val)
            res.redirect('/');
            console.log( req.body.p_long);
        }

    });

});



module.exports = router;
