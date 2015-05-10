'use strict';
// filter to show raw HTML
angular.module('pinApp')
.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);

angular.module('pinApp')
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});