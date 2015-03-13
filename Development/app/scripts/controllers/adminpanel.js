'use strict';

function ngGridFlexibleHeightPlugin (opts) {
    var self = this;
    self.grid = null;
    self.scope = null;
    self.init = function (scope, grid, services) {
        self.domUtilityService = services.DomUtilityService;
        self.grid = grid;
        self.scope = scope;
        var recalcHeightForData = function () { setTimeout(innerRecalcForData, 1); };
        var innerRecalcForData = function () {
            var gridId = self.grid.gridId;
            var footerPanelSel = '.' + gridId + ' .ngFooterPanel';
            var extraHeight = self.grid.$topPanel.height() + $(footerPanelSel).height();
            var naturalHeight = self.grid.$canvas.height() + 1;
            if (opts != null) {
                if (opts.minHeight != null && (naturalHeight + extraHeight) < opts.minHeight) {
                    naturalHeight = opts.minHeight - extraHeight - 2;
                }
            }

            var newViewportHeight = naturalHeight + 3;
            if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !== newViewportHeight) {
                self.grid.$viewport.css('height', newViewportHeight + 'px');
                self.grid.$root.css('height', (newViewportHeight + extraHeight) + 'px');
                self.scope.baseViewportHeight = newViewportHeight;
                self.domUtilityService.RebuildGrid(self.scope, self.grid);
            }
        };
        self.scope.catHashKeys = function () {
            var hash = '',
                idx;
            for (idx in self.scope.renderedRows) {
                hash += self.scope.renderedRows[idx].$$hashKey;
            }
            return hash;
        };
        self.scope.$watch('catHashKeys()', innerRecalcForData);
        self.scope.$watch(self.grid.config.data, recalcHeightForData);
    };
}

angular.module('pinApp')
.controller('AdminPanelCtrl', function($scope, User,Article,$http, $location, $window ,$modal, Auth, $timeout) {


 $scope.setSearch = function(search){
  $location.search(search);
  
  $timeout(function() {
    $scope.mainPage = Object.keys($location.search())[0] || 'users';
    switch($scope.mainPage)
    {
      case 'users':
      User.query(function(users){
        $scope.gridData=users.users;
      });

      break;

      case 'articles':
        $http({ method: 'GET', url: 'api/articles?limit=5&pageno=01' }).
          success(function (data, status, headers, config) {
             $scope.gridData=data.articles;
          }).
        error(function (data, status, headers, config) {

        });

       break;

      default: 
      break;
    }
  }, 0);
  
  };
    $scope.gridData = { data: 'gridData' ,
                        showGroupPanel: true ,
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };
  

});
