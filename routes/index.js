var express = require('express');
var request = require('request');
var app = express();
var router = express.Router();
var axios = require('axios');
var querystring = require('querystring')
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyD9FGZt9Iqa22A1u_pn7pReIjOz7WAcLYA'
});
var slat=0;
var slong=0;
var dlat =0;
var dlong =0;

app.set('view engine', 'ejs');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('home', { title: 'Book Taxi' });
});

//url for geo location API
//https://maps.googleapis.com/maps/api/geocode/json?address=sap+center+san+jose&key=AIzaSyD9FGZt9Iqa22A1u_pn7pReIjOz7WAcLYA

//url for distance matrix API
//https://maps.googleapis.com/maps/api/distancematrix/json?origins=sjsu&destinations=alameda&key=AIzaSyD9FGZt9Iqa22A1u_pn7pReIjOz7WAcLYA

router.post('/confirm_ride',function (req,res,next) {

    var source = encodeURI(req.body.source)
    var destination = encodeURI(req.body.destination)


    // Geocode source address.
    googleMapsClient.geocode({
        address: req.body.source

    }, function(err, response) {
        if (!err) {
            console.log(JSON.stringify(response.json.results[0].geometry.location.lat))
            slat = response.json.results[0].geometry.location.lat
            slong = response.json.results[0].geometry.location.lng
            //console.log(JSON.stringify(response1.json.results[0].geometry.location.lat))
            console.log(response.json.results);
        }
    });

    // Geocode destination address.
    googleMapsClient.geocode({
        address: req.body.destination

    }, function(err, response) {
        if (!err) {
            console.log('inside dest',JSON.stringify(response.json.results[0].geometry.location.lat))
            dlat = response.json.results[0].geometry.location.lat
            console.log('dlat:',dlat)
            dlong = response.json.results[0].geometry.location.lng
            //console.log(JSON.stringify(response1.json.results[0].geometry.location.lat))
            console.log(response.json.results);
        }
    });
    //console.log(source)
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+source+"&destinations="+destination+"&key=AIzaSyD9FGZt9Iqa22A1u_pn7pReIjOz7WAcLYA"
    //console.log(url)

        axios.get(url).then(
        response => {
            //console.log(response.data.results[0].geometry.location.lat);
            var distance = response.data.rows[0].elements[0].distance.text
            var time = response.data.rows[0].elements[0].duration.text
            // console.log(slat+" "+slong)
            // console.log(distance)
            // console.log(time)
            //var latitude = response.data.results[0].geometry.location.lat
            res.render('confirm_ride',{
                travel_time : time,
                distance : distance,
                slat : slat,
                slong : slong,
                dlat : dlat,
                dlong : dlong

            })
        })
        .catch(error => {
                console.log(error);
            }
        )
})



module.exports = router;
