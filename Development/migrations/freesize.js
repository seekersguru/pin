'use strict';
var scaleBy = function(i, j) {
  return function(img, paper) {
    var l = ['width', 'height'];
    // console.info("Trying to fit image's " + l[i] + " by papers's " + l[j]);
    var new_img = false,
        wastage = false;
    if (img[i] < paper[j]) {
      // console.error("Images's " + l[i] + " is less than paper's " + l[j] + ". Failing");
      return [false, false];
    }
    new_img = Array(2);
    new_img[i] = paper[j];
    new_img[1-i] = Math.floor(img[1-i] * (paper[j] / img[i]));

    wastage = (paper[1-j] - new_img[1-i])*paper[j];
    // console.log('wastage', wastage, new_img);
    if (wastage < 0) {
      // console.error("Couldn't fit. Image's " + l[1-i] + " exceeded paper's " + l[1-j]);
      return [false, false];
    }
    // console.info("Image will fit with wastage of " + wastage);
    return [wastage, new_img];
  };
};

var bestFit = function (img, paper) {
  // console.info("Trying to fit image[" + img + "] on paper[" + paper + "]");
  if (Math.max.apply(null, img) < Math.min.apply(null, paper)) {
    // console.error("Image is too small for this paper");
    return false;
  }
  var min_w, img_fit, scale_by;
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      var result = scaleBy(i,j)(img, paper);
      if (result[0] !== false) {
        if (!min_w || (result[0] < min_w)) {
          min_w = result[0];
          img_fit = result[1];
          scale_by = [i,j];
        }
      }
    }
  }
  // console.info("Best fit for paper[" + paper + "] is " + img_fit);
  return [img_fit,scale_by];
};

var imageFit = function(w, h, W, H, min_inc) {
  min_inc = min_inc || 20;
  if (w < W) {
    return [];
  }
  var last_area;
  return [[W,H], [H,2*W], [2*W,2*H]].map(function(paper) {
    return bestFit([w,h], paper);
  }).filter(function(fit, i) {
    if (!fit || !fit[0]) return false;
    if (i == 0) {
      last_area = fit[0][0] * fit[0][1];
      return true;
    }
    var area = fit[0][0] * fit[0][1];
    if ((area - last_area)*100 / last_area > min_inc) {
      last_area = area;
      return true;
    }
    return false;
  });
  
};
// console.log(typeof process);
if (typeof process !== 'undefined' && process.argv.length == 4) {
  // console.log('imageFit:', imageFit(Number(process.argv[2]), Number(process.argv[3]), 1800, 2700));
} else if (typeof angular !== 'undefined') {
  angular.module('paintcollarcomApp')
    .service('Freesize', function () {
      this.imageFit = imageFit;
    });
} else {
  module.exports = imageFit;
}


