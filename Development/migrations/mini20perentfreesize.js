var imageFit = require('./freesize');
module.exports = function(mongoose, config, cb) {
  var Artwork = mongoose.model('Artwork');

  Artwork.find({$or: [{'merchs.poster.hasObject': true},{'merchs.canvas.hasObject': true}]}, function(err, artworks) {
    artworks.forEach(function(artwork) {
      ['poster','canvas'].forEach(function(merch) {
        var merchData = artwork.merchs[merch];
        if (!merchData.hasObject) {
          return;
        }
        var fabric = merchData.fabric,
            object = fabric.objects[0];
        if (merchData.sizes[0].realX === undefined) {
          console.log("Skipping since this artwork doesnt have realX infromation yet. Older than Freesizing");
          return;
        }
        var small_paper = [1800,2700],
            image_size = [object.width, object.height],
            fits = imageFit(image_size[0], image_size[1], small_paper[0], small_paper[1]);
        merchData.sizes.forEach(function(size, i) {
          if (fits[i]) {
            size.disabled = false;
            size.realX = fits[i][0][0]*12/1800;
            size.realY = fits[i][0][1]*12/1800;
          } else {
            if (size.disabled == false) {
              console.log("Changing ", merch, artwork.title, artwork._id);
            }
            size.disabled = true;
          }
        });
        artwork.markModified('merchs.'+merch+'.sizes');
      });
      artwork.save(function(err, aw,n) {
        if (err) {
          console.error('Error:',artwork._id, artwork.title, err);
          return cb(err);
        }
        console.info('Updated!', n);
      });
    });
  });
};
