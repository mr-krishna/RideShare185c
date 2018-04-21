var mongoose = require('mongoose');
//taxi schema
var taxischema = mongoose.Schema({
  user_id: Number,
  taxi_id: Number,
  trip_date: {type : Date, default: Date.now},
  trip_start_timestamp : Date,
  trip_end_timestamp: Date,
  trip_seconds:Number,
  trip_miles:Number,
  pickup_census_tract:Number,
  dropoff_census_tract:Number,
  pickup_community_area:Number,
  dropoff_community_area:Number,
  fare:Number,
  tips:Number,
  tolls:Number,
  extras:Number,
  trip_total:Number,
  payment_type:String,
  company:String,
  pickup_location:{
    type:{type : String},
    coordinates:[Number]},
  drop_location:{
    type:{type : String},
    coordinates:[Number]},
  status : String
});
module.exports = mongoose.model('taxi',taxischema, 'taxi');
