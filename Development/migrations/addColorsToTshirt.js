/**
 Issue: #39
 Description: Add color informtion to merchs.tshirt according
              to new colorpicker and colorselector
**/
var tshirtColors = [
  {key: 'white', name: 'White', hex: '#fff',selected:true},
  {key: 'black', name: 'Black', hex: '#111', selected:true},
  {key: 'red',   name: 'Red',   hex: '#9f0110',selected:true},
  {key: 'green', name: 'Green', hex: '#1e6b0b',selected:true},
  {key: 'blue',  name: 'Blue',  hex: '#1a2f78',selected:true}
];
var keyToColor = {},
    hexToColor = {};
tshirtColors.forEach(function (c) {
  keyToColor[c.key] = c;
  hexToColor[c.hex] = c;
});
module.exports = function(mongoose, config, cb) {
  var Artwork = mongoose.model('Artwork');
  console.info('Finding Tshirts with old Color configuration');
  Artwork.find(
    { $or : [{'merchs.tshirt.color': /^#/},
             {'merchs.tshirt.color': {$exists: false}},
             {'merchs.tshirt.colors': {$exists: false}}]
    },
    function(err, artworks) {
      if (err) return cb(err);
      var n_artworks  = artworks.length;
      var n_completed = 0;
      console.info('Found ' + n_artworks + ' tshirts');
      if (n_artworks === 0) {
        return cb(null);
      }
      artworks.forEach(function (artwork) {
        console.info('Updating: ' + artwork._id);
        var old_color = artwork.merchs.tshirt.color;
        if (old_color && old_color.indexOf('#')!==-1) {
          artwork.merchs.tshirt.color = hexToColor[old_color].key;
        } else {
          artwork.merchs.tshirt.color = 'white';
        }
        artwork.merchs.tshirt.colors = tshirtColors;
        artwork.markModified('merchs.tshirt');
        artwork.save(function(err, aw, n) {
          if (err) {
            console.error('Error', aw);
            return cb(err);
          }
          console.info('Updated!', n);
          n_completed++;
         if (n_completed === n_artworks) {
           cb(null);
         }
       });
      });
    });
};
