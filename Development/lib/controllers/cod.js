var fs = require('fs');
var pins = require('./pin').pins;
console.log('Loaded ' + pins.length + ' pin codes for cod');
exports.checkCod = function(pin) {
  if (pins.indexOf(pin.trim()) !== -1) {
    return {amount: 50, available: true};
  } else {
    return {available:false};
  }
};
exports.codAvailable = function(req, res) {
  var pin = req.body.pin;
  if (!pin) return res.send(400);
  return res.send(exports.checkCod(pin));
};
exports.codGateway = function(req, res) {
  console.log(req.body);
  return res.redirect('/api/orders/callback?cod=true&orderId='+req.body.orderId);
};
