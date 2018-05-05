
var express = require('express');
var app = express();
// const url = require("url");
var router = express.Router();
app.set('view engine', 'ejs');
//taxi_model is the name of the schema generated
var User = require('../models/user');
var taxi = require('../models/taxi_model')
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
//connect to mongodb
//mongoose.connect('mongodb://127.0.0.1:27017/nosql');
//var db = mongoose.connection;
// db.once('open', function () {
//     console.log('connected to MongoDB');
// });
//
// //check for db errors
// db.on('error',function (err) {
//     console.log('error in db conncetion '+ err);
// });

var conn = mongoose.connection;
//  conn.collection('kc').insert(user);
// /* GET home page. */
//  router.get('/', function (req, res, next) {
//      conn.collection('taxi').findOne({},function (err, ride) {
//
//         if (err) {
//              console.log(err);
//              res.send(err)
//          }
//          else {
//              //console.log('inside index');
//              console.log(ride)
//              res.render('index.jade', {
//                  title: 'ride booked for',
//                  ride_history:ride
//              });
//          }
//     });
//  });

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
    console.log("password:",req.body);
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/home');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
      console.log("inLogin");
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
          console.log(error, user);
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/home');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})
router.get('/analytics',function (req,res,next) {
    res.render('analytics', { title: 'Taxi Analytics' });
})
router.get('/usersQuery',function (req,res,next) {
    MongoClient.connect('mongodb://127.0.0.1:27017/nosql', function(err, db) {
        var dbo = db.db("nosql");
        var userQuery = dbo.collection('users').find().toArray(function(err, results) {
            //override report incoming data with results from mongo
            req.userdata = results;
            res.render('usersQuery', { users:  req.userdata});
        });
        // var hotspotMapR=dbo.collection('taxi').mapReduce(function() { emit(this.pickup_community_area,1);},function(communityId, sum) {  return Array.sum(sum);  },{out:"pickupHotZone"});
        // var hotspot=dbo.collection('taxi').find().sort({value:-1}).limit(1).toArray(function(err, results) {
        //     console.log(results);
        //     res.render("hotspot",{ hotspots:  results});
        // });
    });
})

router.get('/hotspotPickUp',function (req,res,next) {
    MongoClient.connect('mongodb://127.0.0.1:27017/nosql', function(err, db) {
        var dbo = db.db("nosql");
        var hotspotMapR=dbo.collection('taxi').mapReduce(function() { emit(this.pickup_community_area,1);},function(communityId, sum) {  return Array.sum(sum);  },{out:"pickupHotZone"});
        var hotspot=dbo.collection('pickupHotZone').find().sort({value:-1}).limit(1).toArray(function(err, results) {
            console.log(results);
            res.render("hotspotPickUp",{ hotspots:  results});
        });
    });
})
router.get('/hotspotDropOff',function (req,res,next) {
    MongoClient.connect('mongodb://127.0.0.1:27017/nosql', function(err, db) {
        var dbo = db.db("nosql");
        var hotspotMapR=dbo.collection('taxi').mapReduce(function() { emit(this.dropoff_community_area,1); }, function(communityId, sum) {  return Array.sum(sum);  },{out:"dropHotZone"});
        var hotspot=dbo.collection('dropHotZone').find().sort({value:-1}).limit(1).toArray(function(err, results) {
            console.log(results);
            res.render("hotspotPickUp",{ hotspots:  results});
        });
    });
})
// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
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
