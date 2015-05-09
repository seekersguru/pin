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


module.exports = function(mongoose, config, cb) {
  var Artwork = mongoose.model('Artwork');
  var Order = mongoose.model('Order');

  Order.find({}, function(err, orders){
      if(err) cb(err);
      
      
      
      for(var j=0; j<orders.length; j++){
      
        for(var i=0; i<orders[j].cart.length; i++){        
      
          (function(i, order, j, length){    
            
            Artwork.findById(order.cart[i].artwork, function(err, artwork){
                if(err) cb(err);
                
                order.cart[i].title  = artwork.title;
                order.cart[i].base = base(artwork.merchs[order.cart[i].merch], order.cart[i].size);
                order.cart[i].margin = artwork.merchs[order.cart[i].merch].margin;
                
                order.markModified("cart");
                
                order.save(function(err, aw, n){
                  if(err) cb(err);
                  
                  if(i == order.cart.length-1 && j == length-1) {
                    console.log("end reached");
             //       cb(null);
                  } 
                  
                });
            });
            
            
          
          })(i, orders[j], j, orders.length);
          
          
        }
        
        
      }
  });
};
