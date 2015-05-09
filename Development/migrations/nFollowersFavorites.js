/**
 Issue: #43
 Description: This resets all the number of follower and favorite to correct value
**/
module.exports = function(mongoose, config, cb) {
  var User = mongoose.model('User'),
      Artwork = mongoose.model('Artwork');
  function setNFollowers (cb) {
    console.info('Setting the nFollowers');
    User.find({}, function(err, users) {
      if (err) return cb(err);
      var n_users = users.length,
          n_users_completed = 0;
      console.log('Updating ' + n_users + ' users');
      users.forEach(function(user) {
        User.count({following: user._id}, function (err, count) {
          user.nFollowers = count;
          user.save(function(err, user, n) {
            if (err) return cb(err);
            if (n) {
              console.info('Updated ' + user._id + ' : ' + user.nFollowers + ' followers');
            }
            n_users_completed++;
            if (n_users_completed === n_users) {
              cb(null);
            }
          });
        });
      });
    });
  };
  function setNFavorites (cb) {
    console.info('Setting the nFavorites');
    Artwork.find({}, function(err, artworks) {
      if (err) return cb(err);
      var n_aw = artworks.length,
          n_aw_completed = 0;
      console.log('Updating ' + n_aw + ' artworks');
      artworks.forEach(function(artwork) {
        User.count({favorites: artwork._id}, function (err, count) {
          artwork.nFavorites = count;
          artwork.save(function(err, artwork, n) {
            if (err) return cb(err);
            if (n) {
              console.info('Updated ' + artwork._id + ' : ' + artwork.nFavorites + ' favorites');
            }
            n_aw_completed++;
            if (n_aw_completed === n_aw) {
              cb(null);
            }
          });
        });
      });
    });
  };
  setNFollowers(function(err) {
    if (err) return cb(err);
    setNFavorites(cb);
  });
};
