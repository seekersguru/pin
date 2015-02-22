'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Artwork = mongoose.model('Artwork'),
    Schema = mongoose.Schema,
    cod = require('../controllers/cod') ;

var OrderSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'User'},
  orderIndex: {type:Number},
  name: {type:String, required:true},
  email: {type:String, required:true},
  phone: {type:String, required:true},
  address: {
    line1: {type:String, required:true},
    line2: String,
    city: {type:String, required:true},
    state: {type:String, required:true},
    pin: {type:Number, required:true}
  },
  additionalDetails :String,
  cart : [],
  paymentOption: String,
  orderedAt: {type: Date, default: Date.now},
  status: {type: String, required:true, default: 'new', 'enum': [
    'new',
    'unpaid',
    'failed',
    'cancelled',
    'paid',
    'refund',
    'codconfirm'
  ]},
  shipStatus: { type: String, required:true, default: 'onhold', 'enum':[
    'printing',
    'dispatched',
    'intransit',
    'delivered',
    'onhold'
  ]},
  pgResponse: {},
  amount: {type:Number},
  subtotal: {type:Number}
});
OrderSchema.virtual('orderId').get(function() {
  var pad2 = function(d) { return ('00' + d).slice(-2);};
  var d = new Date(this.orderedAt);
  return 'W'+[d.getFullYear(), d.getMonth()+1, d.getDate()].map(pad2).join('') + this.orderIndex;
}); 

OrderSchema.virtual('saleInfo').get(function(){
  return {
    cart: this.cart,
    orderedAt : this.orderedAt,
    amount: this.amount
  };
});

OrderSchema.virtual('all').get(function(){
  return{
    _id:this._id,
    user: this.user,
    orderIndex: this.orderIndex,
    name: this.name,
    email: this.email,
    phone: this.phone,
    address: this.address,
    additionalDetails :this.additionalDetails,
    cart : this.cart,
    paymentOption: this.paymentOption,
    orderedAt: this.orderedAt,
    status: this.status,
    pgResponse: this.pgResponse,
    amount: this.amount,
    subtotal: this.subtotal,
    orderId: this.orderId,
    shipStatus: this.shipStatus
  };
});

OrderSchema.pre('save', function(next) {
  if (this.orderIndex) return next();
  var self = this;
  var sd = new Date(self.orderedAt);
  sd.setHours(0,0,0);
  var ed = new Date(sd);
  ed.setDate(ed.getDate()+1);
  this.constructor.find({orderedAt:{ $gte: sd, $lt: ed}})
    .sort({orderIndex: -1})
    .limit(1)
    .exec(function(err, orders) {
      if (err) throw err;
      var oi = orders.length ? orders[0].orderIndex +1:1;
      self.orderIndex = oi;
      //console.log('successfull fillup of orderINdex', oi);
      return next();
    });
});

var priceCalc = function(cartItem, artwork) {
  //TODO look into this, was first done when addming discounts
  return cartItem.price;
  /*
  var merch = cartItem.merch,
      merch_data = artwork.merchs[merch],
      margin = merch_data.margin;
  var base;
  if (merch === 'tshirt' || merch === 'laptop') {
    base = merch_data.sizes[0].base;
  } else {
    base = _.find(merch_data.sizes, {'size': cartItem.size}).base;
  }
  var tax = 7.5, tax_factor = (100+tax)/100;
  var net = base + base*margin/100;
  console.log("awe", cartItem);
  return Math.ceil(net*tax_factor);
  */
};


OrderSchema.pre('save', function(next) {
  var self = this;
  var artwork_ids = _.pluck(self.cart, 'artwork');
  //console.log(artwork_ids);
  if (artwork_ids.length <1) {
    next(new Error('Cart Items cannot be empty'));
  }
  Artwork.find({_id : {$in : artwork_ids}}, 'merchs', function(err, artworks) {
    if (err) return next(err);
    
    var artwork_map = _.indexBy(artworks, '_id');
    //console.log('artworkmap', artwork_map);
    var dtg = 0, screen = 0; // for cod calculations
    var amounts = self.cart.map(function(cartItem) {
      var artwork = artwork_map[cartItem.artwork];
      if (!artwork) {
        return 0;
      }
      if (artwork.merchs[cartItem.merch].screen) {
        screen = 1;
      } else {
        dtg = 1;
      }
      return cartItem.quantity*priceCalc(cartItem, artwork);
    });
    //console.log('amounts', amounts);
    if (amounts.indexOf(0) > -1) {
      console.log('at least oone amount is zero');
      return next(new Error('One or more artworks in the cart items was not found'));
    }
    var total = amounts.reduce(function(prev, curr) { return prev +curr;});
    self.amount = self.subtotal = total;
    if (self.paymentOption === 'cod') {
      var cod_info = cod.checkCod(String(self.address.pin));
      if (cod_info.available) {
        var cod_amount = (dtg + screen) * cod_info.amount;
        self.amount += cod_amount;
      } else {
        return next(new Error('COD Order but COD not servicable in Pin code:'+self.address.pin));
      }
    }
    //console.log('Successfull presave amount, subtotal',total);
    next();
  });
});
mongoose.model('Order', OrderSchema);
