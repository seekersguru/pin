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
        self.grid.$viewport.css('height', newViewportHeight +25+ 'px');
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

$scope.addFamily=function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'familymodal.html',
      controller: 'FamilyCtrl',
      size: size
      
  });
};



$scope.updateBand=function(data,band){
   data.band=band;
   console.log(data);
   $http({ method: 'PUT', url: '/api/users/'+data._id,data:{'band':band}}).
      success(function (data, status, headers, config) {
            
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
};

$scope.updateFamily=function(data,name){
   data.name=name;
   console.log(data);
   $http({ method: 'PUT', url: '/api/family/'+data._id,data:{'name':name}}).
      success(function (data, status, headers, config) {
            
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
};

$scope.updateExpert=function(data,name){
   data.name=name;
   console.log(data);
   $http({ method: 'PUT', url: '/api/expert/'+data._id,data:{'name':name}}).
      success(function (data, status, headers, config) {
            
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
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
  var popup=1;
  if(setStatus)
   {
    messageline="You are approving "+$scope.gridUserData[removeIndex].name+" a mail notification will be sent to  mail id "+$scope.gridUserData[removeIndex].email;
   }
  else
   {
    messageline="You are blocking "+$scope.gridUserData[removeIndex].name+" , email notification will be sent to him that , some problem in your account please contact admin";
    popup=0;
   }

  var yes=confirm(messageline);
  if(yes)
  {
      if(popup)
      {
        var modalInstance = $modal.open({
            templateUrl: 'familyoffice.html',
            controller: 'AssignRoleCtrl',
            resolve: {
                searchable: function () {
                    return $scope.gridUserData[removeIndex].searchable;
                },
                adminrole: function () {
                    return $scope.gridUserData[removeIndex].adminrole;
                },
                familyrole: function () {
                    return $scope.gridUserData[removeIndex].familyrole;
                },
                userid: function () {
                    return userId;
                },
                removeIndex: function () {
                    return removeIndex;
                },
                commentvisible: function () {
                    return $scope.gridUserData[removeIndex].commentvisible;
                },
                roletype: function () {
                    return $scope.gridUserData[removeIndex].company['roletype'];
                }
              }
        });

      }else{
        
        $http({ method: 'PUT', url: '/api/users/status/'+userId,data:{'status':setStatus}}).
            success(function (data, status, headers, config) {
               $scope.gridUserData[removeIndex].status=setStatus;   
            }).
            error(function (data, status, headers, config) {
              // ...
              // $scope.article={};
            });
      }   
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

$scope.eventStatus=function(eventId){
      var removeIndex = $scope.gridEventData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(eventId);

  var setStatus= !$scope.gridEventData[removeIndex].approve;
  $http({ method: 'PUT', url: '/api/events/'+eventId,data:{'public':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridEventData[removeIndex].approve=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });

};

$scope.companyStatus=function(eventId){
      var removeIndex = $scope.gridCompanyData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(eventId);

  var setStatus= !$scope.gridCompanyData[removeIndex].approve;
  $http({ method: 'PUT', url: '/api/companys/'+eventId,data:{'public':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridCompanyData[removeIndex].approve=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });

};

$scope.deleteCompany=function(articleId){
  var yes=confirm('Are you sure you want to delete this Company?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/companys/'+articleId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridCompanyData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(articleId);

      $scope.gridCompanyData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

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


$scope.deleteFamily=function(familyId){
  var yes=confirm('Are you sure you want to delete this Family Name ?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/family/'+familyId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridFamilyData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(familyId);

      $scope.gridFamilyData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };

$scope.deleteExpert=function(expertId){
  var yes=confirm('Are you sure you want to delete this Expert ?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/expert/'+expertId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridExpertData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(expertId);

      $scope.gridExpertData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };

 $scope.deleteEvent=function(expertId){
  var yes=confirm('Are you sure you want to delete this Event ?');
  if(yes)
  {
    $http({
      method:'DELETE',
      url:'/api/events/'+expertId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridEventData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(expertId);

      $scope.gridEventData.splice(removeIndex, 1);

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

     case 'family':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/family' }).
          success(function (data, status, headers, config) {
             $scope.gridFamilyData=data.familys;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;
     case 'expert':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/expert' }).
          success(function (data, status, headers, config) {
             $scope.gridExpertData=data.experts;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

    case 'event':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/events/basic' }).
          success(function (data, status, headers, config) {
             $scope.gridEventData=data.articles;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

  case 'company':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/companys/basic' }).
          success(function (data, status, headers, config) {
             $scope.gridCompanyData=data.company;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

      default: 
      break;
    }
  }, 0);

  $scope.filterOptions = {
    filterText: '',
    filterColumn: ''    };


  var editDeleteArticleTemplate = '<a ng-click="deleteArticle(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/articles/view/{{row.entity._id}}"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/articles/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.articleData = { data: 'gridArticleData' ,
                        enableCellSelection: true,
                        enableRowSelection: false,
                         filterOptions: $scope.filterOptions,

                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'author' ,displayName:'Author' },
                                    // { field: 'tags' ,displayName:'Tags' },
                                    { field: 'comments' ,displayName:'Comments' },
                                    { field: 'category' ,displayName:'Category' },
                                    { field: 'createdAt' ,displayName:'Created Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MMMM-yyyy"}}</span>' },
                                    { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="articleStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="articleStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'Action', cellTemplate: editDeleteArticleTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

  $scope.userData = { data: 'gridUserData' ,
                        // showGroupPanel: true ,
                         // enableCellSelection: true,
                         enableRowSelection: false,
                         filterOptions: $scope.filterOptions,
                         columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'name' ,displayName:'Name' },
                                    { field: 'createdAt' ,displayName:'Created Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MMMM-yyyy"}}</span>' },
                                    { field: 'email' ,displayName:'Email' },
                                    { field: 'band' ,displayName:'Band',cellTemplate : '<span ng-show="!row.entity.status" >{{ row.entity.band }}</span><span ng-show="row.entity.status"><input  type="text" ng-model="row.entity.band" ng-blur="updateBand(row.entity,row.entity.band)" ng-value="row.entity.band" /></span>'}, 
                                    { field: 'role' ,displayName:'Role'},
                                    { field: 'commentvisible' ,displayName:'Commentvisible'},
                                    { field: 'searchable' ,displayName:'Searchable'},
                                    { field: 'adminrole' ,displayName:'Adminrole'},
                                    { field: 'emailVerification' ,displayName:'EmailVerification',cellTemplate:'<span ng-if="row.entity.emailVerification" class="label label-success">Done</span><span ng-if="!row.entity.emailVerification" class="label label-danger" >Pending</span>' },
                                    { field: 'username' ,displayName:'Username' },
                                    { field: 'status' ,displayName:'Status',cellTemplate:'<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'},
                                    { field: 'action' ,displayName:'Action',cellTemplate:'<span ng-if="row.entity.status" class="btn btn-info" ng-click="userStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="btn btn-info" ng-click="userStatus(row.entity._id)">Approve</span> '}],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

  var editDeleteFamilyTemplate = '<a ng-click="deleteFamily(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a>';


 $scope.familyData = { data: 'gridFamilyData' ,
                        // showGroupPanel: true ,
                         // enableCellSelection: true,
                         enableRowSelection: false,
                         filterOptions: $scope.filterOptions,
                         columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'name' ,displayName:'Name',cellTemplate : '<input  type="text" ng-model="row.entity.name" ng-blur="updateFamily(row.entity,row.entity.name)" ng-value="row.entity.name" />' }],
                                    // { field: '',displayName:'Action', cellTemplate: editDeleteFamilyTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };


  var editDeleteExpertTemplate = '<a ng-click="deleteExpert(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a><a ng-href="/expert/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';


$scope.expertData = { data: 'gridExpertData' ,
// showGroupPanel: true ,
 // enableCellSelection: true,
 enableRowSelection: false,
 filterOptions: $scope.filterOptions,
 columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
             { field: 'media' ,displayName:'Profile',cellTemplate:'<img style="height:70px;width:70px;"ng-src="{{row.entity.media.path}}">'}, 
            { field: 'name' ,displayName:'Name',cellTemplate : '<input  type="text" ng-model="row.entity.name" ng-blur="updateExpert(row.entity,row.entity.name)" ng-value="row.entity.name" />' },
             { field: 'designation' ,displayName:'Designation'},
             { field: 'mail' ,displayName:'Mail'},
             { field: 'linkedin' ,displayName:'Linkedin'},
            { field: '',displayName:'Action', cellTemplate: editDeleteExpertTemplate, maxWidth: 100  }]
,
showFooter: true,
plugins: [new ngGridFlexibleHeightPlugin()]
};


 var editDeleteEventTemplate = '<a ng-click="deleteEvent(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/event/view/{{row.entity._id}}"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/event/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.eventData = { data: 'gridEventData' ,
                        enableCellSelection: true,
                        enableRowSelection: false,
                         filterOptions: $scope.filterOptions,

                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'author' ,displayName:'Author' },
                                    // { field: 'expert' ,displayName:'Expert' },
                                    // { field: 'comments' ,displayName:'Comments' },
                                    { field: 'category' ,displayName:'Category' },
                                    { field: 'eventdate' ,displayName:'Event Date',cellTemplate:'<span> {{row.entity.eventdate|date:"dd-MMMM-yyyy"}}</span>' },
                                    { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="eventStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="eventStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'Action', cellTemplate: editDeleteEventTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

 var editDeleteCompanyTemplate = '<a ng-click="deleteCompany(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/company/view/{{row.entity._id}}"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/company/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.companyData = { data: 'gridCompanyData' ,
                        enableCellSelection: true,
                        enableRowSelection: false,
                        filterOptions: $scope.filterOptions,

                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'firmsupertype' ,displayName:'SuperType' },
                                    { field: 'firmtype' ,displayName:'Type' },
                                    { field: 'firmsubtype' ,displayName:'Sub Type' },
                                    { field: 'createdAt' ,displayName:'Created Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MMMM-yyyy"}}</span>' },
                                    // { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="companyStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="copmanyStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'Action', cellTemplate: editDeleteCompanyTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

                       
  

});

angular.module('pinApp')
.controller('FamilyCtrl', function ($scope, $modalInstance,$rootScope,$http,$location,$window,$controller,$route,$templateCache) {

 $.extend(this, $controller('AdminPanelCtrl', {$scope: $scope}));

$scope.family={};
  $scope.saveFamily = function () {
    var familyname=$("#familyname").val();
    if(familyname)
    {      
       var family={name: familyname};  

    $http({ method: 'POST', url: '/api/family/',data:family }).
    success(function (data, status, headers, config) {
          // ...
          
          $modalInstance.close();

          console.log(data);
          
          // $scope.gridFamilyData.push(data.family);
               var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();

          
          
          
          // $scope.form.$setPristine();
      
        $modalInstance.close();
          
        }).
    error(function (data, status, headers, config) {
      $scope.family={};
      $modalInstance.dismiss('cancel');
    });



    }else{

      alert('please fill family name');
    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('pinApp')
.controller('AssignRoleCtrl', function ($scope, $modalInstance,$rootScope,$http,$location,$window,$controller,searchable,adminrole,familyrole,userid,removeIndex,commentvisible,roletype,$templateCache,$route) {
  $scope.userupdate={
    familyrole:familyrole,
    searchable:searchable,
    adminrole:adminrole,
    commentvisible:commentvisible,
    roletype:roletype
  };

 $.extend(this, $controller('AdminPanelCtrl', {$scope: $scope}));

 $http({ method: 'GET', url: 'api/family' }).
    success(function (data, status, headers, config) {
       $scope.familys=data.familys;
    }).
 error(function (data, status, headers, config) {

  });


$scope.roletypes=[
    'CEO/business head',
    'Management',
    'Sales/Marketing',
    'Investment/Product',  
    'RM/client facing',
    'Investment Mgmt"',
    'Product Mgmt'
    ];  


  $scope.saveRole = function () {
          $http({ method: 'PUT', url: '/api/users/status/'+userid,data:{'status':1,adminrole:$scope.userupdate.adminrole,familyrole:$scope.userupdate.familyrole,searchable:$scope.userupdate.searchable,commentvisible:$scope.userupdate.commentvisible}}).
            success(function (data, status, headers, config) {
               $modalInstance.close();
               var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();

            }).
            error(function (data, status, headers, config) {
             $scope.userupdate={};
             $modalInstance.dismiss('cancel');
            });
      };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});
