module.exports = function(mongoose, config, cb) {
  var Artwork = mongoose.model('Artwork');
  var sys = require('sys');
  var _ = require('lodash');
  
  Artwork.find({}).populate('author', 'username name').exec(function(err, artworks) {
  if (err) return cb(err);
  var n_artworks  = artworks.length;
  var n_completed = 0;
  console.info('Found ' + n_artworks + '');
  if (n_artworks === 0) {
    return cb(null);
  }
  
  artworks.forEach(function (artwork) {
    var keyWordsFromTags = getKeyWords(artwork.tags, 0);
    var keyWordsFromTitle= getKeyWords(artwork.title, 4);
    var keyWordsFromUsername= getKeyWords(artwork.author.username, 3);
    var keyWordsFromName = getKeyWords(artwork.author.name, 4);
    
    artwork.keywords = _.uniq(keyWordsFromTags.concat(keyWordsFromTitle, keyWordsFromUsername, keyWordsFromName), false);
    
    
    
    artwork.markModified('keywords');
    artwork.save(function(err, aw, n) {
      if (err) {
        console.error('Error', aw);
        return cb(err);
      }
      sys.print('Updated!', n_completed + 1 + '\n');
    
      n_completed++;
      if (n_completed === n_artworks) {
        cb(null);
      }
    });
  });
});
};

function getKeyWords(string, length){
  
  if(typeof string == 'object' && string){
    string = string.join(' ');
  }
  var keywords = [];
  if(string){
    var arr = string.toLowerCase().replace(/(\b(\w{1,2})\b(\s|$))/g,'').split(' ');
    var str;
    for(var i=0;i<arr.length; i++){
      str = ''
      for(var j=0;j<arr[i].length; j++){
        if(length != 0){
          str += arr[i][j];
          if(str.length >= length){
            keywords.push(str);
          }
        }else{
          keywords.push(arr[i]);
          break;
        }
      }
    }    
  }
  return keywords;
}