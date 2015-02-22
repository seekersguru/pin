'use strict';

var mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Artwork = mongoose.model('Artwork'),
    config = require('../config/config'),
    SalesEmail = require('../email').SalesEmail,
    OrderRecEmail = require('../email').OrderRecEmail,
    OrderConfirmationEmail = require('../email').OrderConfirmationEmail,
    crypto = require('crypto'),
    qs = require('querystring'),
    _ = require('lodash');

exports.update = function(req, res){
  var oid = req.params.id;
  var order_data = req.body;
  
  if(req.user.role !== 'admin'){
    return res.send(404);
  }
  
  delete order_data.oid;
  console.log(oid);
  console.log(order_data);
  
  Order.findOneAndUpdate({_id: oid}, order_data , function(err, order) {
      if(err){
        return res.send(400);
      }
      console.log(order);
      if (!order) return res.send(404);
      return res.send(200);
  });
};


exports.query = function(req, res){
  var q = Order.find({});
  
  q.exec(function(err, orders) {
    if (err) {
      console.log(err);
      return res.send(404);
    } else {
      for(var i =0 ;i<orders.length; i++){
        orders[i] = orders[i].all;
      }
      return res.json({orders:orders});
    }
  });
};

var base = function(merch_data, size) {
  var size_data;
  if (merch_data.sizes.length === 1 || !size) {
      size_data = merch_data.sizes[0];
  } else {
    for (var i=0; i <  merch_data.sizes.length; i++){
      if (merch_data.sizes[i].size === size) {
        size_data = merch_data.sizes[i];
      }
    }
  }
  return size_data.base;
};

exports.create = function(req, res) {
  var order = new Order(req.body);
  if (req.user) {
    order.user = req.user._id;
  }
  
  if (order.cart.length < 1) {
    return res.send(400, 'Cant create order of an empty cart');
  }
  var orderCartFiller = function(i) {    
    Artwork.findById(order.cart[i].artwork, function(err, artwork){
      order.cart[i].title  = artwork.title;
      order.cart[i].base = base(artwork.merchs[order.cart[i].merch], order.cart[i].size);
      order.cart[i].margin = artwork.merchs[order.cart[i].merch].margin;
    });
  };
  for(var i=0; i<order.cart.length; i++){
    orderCartFiller(i);
  }
  
  order.save(function(err, order) {
    if (err) return res.json(400, err);
    if (!order) res.json(404);
    console.log('Successfull Save', order);
    res.json(200, order);
  });
};
exports.show = function(req, res) {
  var oid = req.params.oid;
  Order.findById(oid, 'name email status amount orderedAt orderIndex paymentOption', function(err, order) {
    if (err) return res.json(400, err);
    if (!order) res.send(404);
    var order_object = order.toJSON();
    order_object.orderId = order.orderId;
    console.log(order_object);
    return res.json(order_object);
  });
};
var ccencrypt = function (plainText, workingKey) {
        var m = crypto.createHash('md5');
        m.update(workingKey);
        var key = m.digest('binary');
        var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';    
        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        var encoded = cipher.update(plainText,'utf8','hex');
        encoded += cipher.final('hex');
        return encoded;
};
var ccdecrypt = function (encText, workingKey) {
        var m = crypto.createHash('md5');
        m.update(workingKey);
        var key = m.digest('binary');
        var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';    
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(encText,'hex','utf8');
        decoded += decipher.final('utf8');
        return decoded;
};
exports.callback = function(req, res) {
  var secret_key = config.CITRUS_SECRET_ACCESS_KEY;
  var cc_secret_key = config.CCAVENUE_SECRET_ACCESS_KEY;
  var cb_data;
  var status;
  var oid;
  if (req.query.cod && req.query.orderId) {
    oid = req.query.orderId;
    status = 'new';
  } else  if (req.body.encResp) {
    //CCAve callback
    console.log('Callback payment : CCAVE');
    if (!cc_secret_key) return res.send(400, 'Key not there');
    cb_data = ccdecrypt(req.body.encResp, cc_secret_key);
    cb_data = qs.parse(cb_data);
    oid = cb_data.order_id;
    if (cb_data.order_status === 'Success') {
      status = 'paid';
    } else if (cb_data.order_status === 'Failure') {
      status = 'failed';
    } else { 
      status = 'cancelled';
    }
  } else {
    console.log('Callback payment : CITRUS');
    var keys = ['TxId','TxStatus','amount','pgTxnNo','issuerRefNo','authIdCode','firstName','lastName','pgRespCode','addressZip'];
    var data = '';
    keys.forEach(function(key) {
      if (req.body[key] !== undefined) {
        data += req.body[key];
      }
    });
    var my_sign = crypto.createHmac('sha1', secret_key).update(data).digest('hex');
    console.log(my_sign, req.body.signature);
    if (my_sign !== req.body.signature) return res.send(401, 'Signatures are different');
    cb_data = req.body;
    oid = cb_data.TxId;

    if (cb_data.TxStatus === 'SUCCESS') {
      status = 'paid';
    } else if (cb_data.TxStatus === 'FAILED') {
      status = 'failed';
    } else { 
      status = 'cancelled';
    }
  }
  console.log(cb_data, status, oid);
  var sd = new Date(Date.parse([20+oid.slice(1,3), oid.slice(3,5), oid.slice(5,7)].join('-')));
  sd.setHours(0,0,0);
  var ed = new Date(sd);
  ed.setDate(ed.getDate()+1);
  var index = +oid.slice(7);
  console.log(sd, ed, index);
  Order.findOne({orderedAt: {$gte: sd, $lt: ed}, orderIndex : index}, function(err, order) {
    if (err) return res.json(400, err);
    if (!order) return res.send(404, 'Order not found');
    console.log(order._id);
    order.status = status;
    order.pgResponse = cb_data;
    order.save(function(err, saved) {
      if (err) return res.json(400, err);
      res.redirect('/checkout/'+order._id);
      if (saved.status !== 'paid' && saved.paymentOption !== 'cod') {
        return;
      }
      (new OrderRecEmail({order: saved})).send(console.log);
      if (saved.status !== 'paid') {
        return;
      }
      (new OrderConfirmationEmail({order: saved})).send(console.log);

      var cart = saved.cart;
      var artworkCartGroup = _.groupBy(cart, 'artwork');
      var artworks = Object.keys(artworkCartGroup);
      return Artwork.find({_id : {'$in': artworks}}, '_id author')
      .populate('author', '_id name email')
      .exec(function(err, artworks) {
        var authorArtworkGroup = _.groupBy(artworks, function(a) { return a.author._id;});
        _.forEach(authorArtworkGroup,function(aw_list) {
          // Send email to each author
          var aw_ids = _.pluck(aw_list, '_id');
          var author_sales = _.flatten(_.values(_.pick(artworkCartGroup, aw_ids)));
          var author = aw_list[0].author;
          console.log('Sending email...',author.email, author.name, author_sales);
          (new SalesEmail(author, {sales:author_sales}).send(console.log));
          
        });
      });

    });
  });
  
};

var signccave = function(req, res) {
  var id = req.body.id;
  var mid = config.CCAVENUE_MID;
  var access_code = config.CCAVENUE_ACCESS_CODE;
  var secret_key = config.CCAVENUE_SECRET_ACCESS_KEY;
  console.log(config);
  console.log(access_code, secret_key,mid);
  if (!secret_key || !access_code) return res.send(400, 'Key Not Found');
  Order.findById(id, function(err, order) {
    if (err) return res.json(400,err);
    if (!order) return res.send(404);
    if (order.status !== 'new') return res.send(400, 'Old order');
    if (order.user && (!req.user || !req.user._id.equals(order.user))) return res.send(401);
    var amount = order.amount;
    var tid = order.orderId;
    var billing_address = order.address.line1 +' '+ (order.address.line2||'');
    while (!/^[a-z0-9]+$/i.test(billing_address.slice(-1)) && billing_address.length !==0) {
      billing_address = billing_address.slice(0,-1);
    }
    var data = {
      merchant_id: mid,
      order_id: tid,
      currency: 'INR',
      amount: amount,
      redirect_url: 'http://' + req.headers.host+ '/api/orders/callback',
      cancel_url: 'http://' + req.headers.host+ '/api/orders/callback',
      language: 'EN',
      billing_name: order.name,
      billing_address: billing_address,
      billing_city: order.address.city,
      billing_state: order.address.state,
      billing_zip: order.address.pin,
      billing_country: 'India',
      billing_tel: order.phone,
      billing_email: order.email
    };
    var data_serialized = qs.stringify(data);
    console.log('data_serialized', data_serialized);
    var enc_req = ccencrypt(data_serialized, secret_key);
    console.log(enc_req);
    var url = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id='+mid+
          '&encRequest='+enc_req+'&access_code='+access_code;
    res.send({
      postTo: 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
      form: {
        encRequest: enc_req,
        access_code: access_code
      }
    });
  });
};

var signcod = function (req, res) {
  console.log(req.body);
  Order.findById(req.body.id, function(err, order) {
    if (err) return res.json(400, err);
    if (!order) return res.send(404);
    if (order.status !== 'new') return res.send(400, 'Old order');
    if (order.user && (!req.user || !req.user._id.equals(order.user))) return res.send(401);
    return res.send({
      postTo: '/api/cod/codGateway',
      form : {
        orderId: order.orderId
      }
    });
  });
};
exports.sign = function(req, res) {
  if (req.body.payby === 'cod') return signcod(req, res);
//  if (req.body.payby !== 'nb') return signccave(req,res);
  var id = req.body.id;
  console.log('Req to sign', id);
  var vanity_url = config.CITRUS_VANITY;
  var secret_key = config.CITRUS_SECRET_ACCESS_KEY;
  console.log(secret_key);
  if (!secret_key) return res.send(400);  
  Order.findById(id, function(err, order) {
    if (err) return res.json(400, err);
    if (!order) return res.send(404);
    if (order.status !== 'new') return res.send(400, 'Old order');
    if (order.user && (!req.user || !req.user._id.equals(order.user))) return res.send(401);
    var amount = order.amount;
    var tid = order.orderId;
    var to_sign = vanity_url+amount+tid+'INR';
    return res.send({
      vanity: vanity_url,
      postTo: config.CITRUS_BASE_URL + vanity_url,
      form: {
        orderAmount: amount,
        merchantTxnId: tid,
        currency: 'INR',
        secSignature: crypto.createHmac('sha1', secret_key).update(to_sign).digest('hex'),
        returnUrl: 'http://' + req.headers.host+ '/api/orders/callback',
        firstName: order.name.split(' ')[0],
        lastName : order.name.split(' ')[1],
        email: order.email,
        addressStreet1: order.address.line1 +' '+ (order.address.line2||''),
        addressCity: order.address.city,
        addressZip: order.address.pin,
        addressState: order.address.state,
        phoneNumber: order.phone
      }
    });
  });
};








