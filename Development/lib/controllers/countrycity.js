'use strict';

var mongoose = require('mongoose'),
passport = require('passport'),
_ = require('lodash'),


exports.getCountry = function(req, res){
  
      return res.json({'countries':Object.keys(CountryCity)});
  
};

exports.getCity = function(req, res){

      return res.json({'cities':CountryCity[req.params.country]});
  
};
