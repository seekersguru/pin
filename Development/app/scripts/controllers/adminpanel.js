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

$scope.viewArticle=function(articleId){
  window.open('/articles/view/'+articleId,'_blank');
};

$scope.editArticle=function(articleId){
  window.open('/articles/edit/'+articleId,'_blank');
};

$scope.userStatus=function(userId){
      var removeIndex = $scope.gridUserData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(userId);

  var setStatus= !$scope.gridUserData[removeIndex].status,
  messageline="";

  if(setStatus)
    messageline="You are approving "+$scope.gridUserData[removeIndex].name+" a mail notification will be sent to  mail id "+$scope.gridUserData[removeIndex].email;
  else
    messageline="You are blocking "+$scope.gridUserData[removeIndex].name+" , email notification will be sent to him that , some problem in your account please contact admin";

  var yes=confirm(messageline);
  if(yes)
  {
  $http({ method: 'PUT', url: '/api/users/status/'+userId,data:{'status':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridUserData[removeIndex].status=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
  }
  else{

  }

};
$scope.articleStatus=function(articleId){
      var removeIndex = $scope.gridArticleData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(articleId);

  var setStatus= !$scope.gridArticleData[removeIndex].approve;
  $http({ method: 'PUT', url: '/api/articles/'+articleId,data:{'public':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridArticleData[removeIndex].approve=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });

};

$scope.deleteArticle=function(articleId){
  var yes=confirm('Are you sure you want to delete this Article?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/articles/'+articleId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridArticleData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(articleId);

      $scope.gridArticleData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };


 $scope.setSearch = function(search){
  $location.search(search);

  };

  $timeout(function() {
    $scope.mainPage = Object.keys($location.search())[0] || 'users';
    switch($scope.mainPage)
    {
      case 'users':
      $scope.gridUserData={};
      User.query(function(users){
        $scope.gridUserData=users.users;
      });

      break;

      case 'articles':
      $scope.gridArticleData={};
        $http({ method: 'GET', url: 'api/articles/basic' }).
          success(function (data, status, headers, config) {
             $scope.gridArticleData=data.articles;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

      default: 
      break;
    }
  }, 0);
  

  var editDeleteArticleTemplate = '<a ng-click="deleteArticle(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-click="viewArticle(row.entity._id)"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-click="editArticle(row.entity._id)"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.articleData = { data: 'gridArticleData' ,
                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'ID'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'author' ,displayName:'Author' },
                                    { field: 'tags' ,displayName:'Tags' },
                                    { field: 'comments' ,displayName:'Comments' },
                                    { field: 'category' ,displayName:'Category' },
                                    { field: 'createdAt' ,displayName:'Created Date'},
                                    { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="articleStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="articleStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'', cellTemplate: editDeleteArticleTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

  $scope.userData = { data: 'gridUserData' ,
                        // showGroupPanel: true ,
                         columnDefs: [{ field: '_id' ,displayName:'ID'},
                                    { field: 'name' ,displayName:'Name' },
                                    { field: 'createdAt' ,displayName:'Created Date' },
                                    { field: 'email' ,displayName:'Email' },
                                    { field: 'emailVerification' ,displayName:'EmailVerification',cellTemplate:'<span ng-if="row.entity.emailVerification" class="label label-success">Done</span><span ng-if="!row.entity.emailVerification" class="label label-danger" >Pending</span>' },
                                    { field: 'username' ,displayName:'Username' },
                                    { field: 'status' ,displayName:'Status',cellTemplate:'<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'},
                                    { field: 'action' ,displayName:'Action',cellTemplate:'<span ng-if="row.entity.status" class="btn btn-info" ng-click="userStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="btn btn-info" ng-click="userStatus(row.entity._id)">Approve</span>'}],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

                       
  

});
