'use strict';

function ngGridFlexibleHeightPlugin(opts) {
  var self = this;
  self.grid = null;
  self.scope = null;
  self.init = function(scope, grid, services) {
    self.domUtilityService = services.DomUtilityService;
    self.grid = grid;
    self.scope = scope;
    var recalcHeightForData = function() {
      setTimeout(innerRecalcForData, 1);
    };
    var innerRecalcForData = function() {
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
      if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !==
        newViewportHeight) {
        self.grid.$viewport.css('height', newViewportHeight + 25 + 'px');
        self.grid.$root.css('height', (newViewportHeight + extraHeight) +
          'px');
        self.scope.baseViewportHeight = newViewportHeight;
        self.domUtilityService.RebuildGrid(self.scope, self.grid);
      }
    };
    self.scope.catHashKeys = function() {
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
  .controller('AdminPanelCtrl', function($scope, User, MMIUser,Article, $http,
    $location, $window, $modal, Auth, $timeout) {
      $scope.ranges = {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1,'days'), moment().subtract(1,'days')],
        'Last 7 days': [moment().subtract(7,'days'), moment()],
        'Last 30 days': [moment().subtract(30,'days'), moment()],
        'This month': [moment().startOf('month'), moment().endOf('month')]
      };
      // function cb(start, end) {
      //     $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      // }
      // cb(moment().subtract(29, 'days'), moment());
      //
      // $('#reportrange').daterangepicker({
      //     ranges: {
      //        'Today': [moment(), moment()],
      //        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      //        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      //        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      //        'This Month': [moment().startOf('month'), moment().endOf('month')],
      //        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      //     }
      // }, cb);

    $scope.viewArticle = function(articleId) {
      window.open('/articles/view/' + articleId, '_blank');
    };

    $scope.editArticle = function(articleId) {
      window.open('/articles/edit/' + articleId, '_blank');
    };

    $scope.addFamily = function(size) {

      var modalInstance = $modal.open({
        templateUrl: 'familymodal.html',
        controller: 'FamilyCtrl',
        size: size

      });
    };

    $scope.approves={
      true:"Approve",
      false:"Not Approve"
    }
    //variable define for getting the total no of items to be displayed
    $scope.totalServerItems = 0;

    //these are the paging(pagination) options
    $scope.pagingOptions = {
         //no of records that need to be displayed per page will be depend on pagesizes
         pageSizes: [1,2,3],
         pageSize: 1,
         //this is for the page no that is selected
         currentPage: 1
    };

    $scope.articleFilter={createdAt:{ endDate: moment(),startDate:moment()}};
    $scope.mmiFilter={createdAt:{ endDate: moment(),startDate:moment()}};
    $scope.pinFilter={createdAt:{ endDate: moment(),startDate:moment()}};
    $scope.setArticlePagingData=function(){
    $scope.gridArticleData = data.articles;
             if (!$scope.$$phase) {
                 $scope.$apply();
             }
    }
    $scope.filterArticle=function(){
      var data;
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;
      var searchText=$scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
      var ft = searchText.toLowerCase();
      $http({
        method: 'GET',
        url: 'api/articles/basic?filter='+ JSON.stringify($scope.articleFilter)
      }).
      success(function(data, status, headers, config) {
          //with data must send the total no of items as well
          $scope.totalServerItems=data.totalElement;
          //here's the list of data to be displayed
          data.articles = data.articles.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
          });
          $scope.gridArticleData = data.articles;
          // $scope.setArticlePagingData(data,page,pageSize);
      }).
      error(function(data, status, headers, config) {

      });
    }else{
      $http({
        method: 'GET',
        url: 'api/articles/basic?filter='+ JSON.stringify($scope.articleFilter)
      }).
      success(function(data, status, headers, config) {
        $scope.gridArticleData = data.articles;
        // $scope.totalServerItems=data.totalElement;
        // $scope.setArticlePagingData(data,page,pageSize);

      }).
      error(function(data, status, headers, config) {

      });
    }
    }

    $scope.filterMMIUsers=function(){
      var data;
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;
      var searchText=$scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
      var ft = searchText.toLowerCase();
      $http({
        method: 'GET',
        url: 'api/mmiusers?filter='+ JSON.stringify($scope.mmiFilter)
      }).
      success(function(users, status, headers, config) {
          //with data must send the total no of items as well
          // $scope.totalServerItems=data.totalElement;
          //here's the list of data to be displayed
          users.users = users.users.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
          });
          $scope.gridMMIUserData = users.users;
          // $scope.setArticlePagingData(data,page,pageSize);
      }).
      error(function(data, status, headers, config) {

      });
    }else{
      $http({
        method: 'GET',
        url: 'api/mmiusers?filter='+ JSON.stringify($scope.mmiFilter)
      }).
      success(function(users, status, headers, config) {
        $scope.gridMMIUserData = users.users;
        // $scope.totalServerItems=data.totalElement;
        // $scope.setArticlePagingData(data,page,pageSize);

      }).
      error(function(data, status, headers, config) {

      });
    }
    }
    $scope.filterPINUsers=function(){
      var data;
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;
      var searchText=$scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
      var ft = searchText.toLowerCase();
      $http({
        method: 'GET',
        url: 'api/users?filter='+ JSON.stringify($scope.pinFilter)
      }).
      success(function(users, status, headers, config) {
          //with data must send the total no of items as well
          // $scope.totalServerItems=data.totalElement;
          //here's the list of data to be displayed
          users.users = users.users.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
          });
          $scope.gridUserData = users.users;
          // $scope.setArticlePagingData(data,page,pageSize);
      }).
      error(function(data, status, headers, config) {

      });
    }else{
      $http({
        method: 'GET',
        url: 'api/users?filter='+ JSON.stringify($scope.pinFilter)
      }).
      success(function(users, status, headers, config) {
        $scope.gridUserData = users.users;
        // $scope.totalServerItems=data.totalElement;
        // $scope.setArticlePagingData(data,page,pageSize);

      }).
      error(function(data, status, headers, config) {

      });
    }
    }

    $scope.updateBand = function(data, band) {
      data.band = band;
      console.log(data);
      $http({
        method: 'PUT',
        url: '/api/users/' + data._id,
        data: {
          'band': band
        }
      }).
      success(function(data, status, headers, config) {

      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });
    };

    $scope.updateFamily = function(data, name) {
      data.name = name;
      console.log(data);
      $http({
        method: 'PUT',
        url: '/api/family/' + data._id,
        data: {
          'name': name
        }
      }).
      success(function(data, status, headers, config) {

      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });
    };

    $scope.updateExpert = function(data, name) {
      data.name = name;
      console.log(data);
      $http({
        method: 'PUT',
        url: '/api/expert/' + data._id,
        data: {
          'name': name
        }
      }).
      success(function(data, status, headers, config) {

      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });
    };

$scope.mmiuserStatus=function(userId){
      var removeIndex = $scope.gridMMIUserData
      .map(function(item)
      {
        return item._id;
      })
      .indexOf(userId);

  var setStatus= !$scope.gridMMIUserData[removeIndex].status,
  messageline="";
  var popup=1;
  if(setStatus)
   {
    messageline="You are approving "+$scope.gridMMIUserData[removeIndex].firstname+" a mail notification will be sent to  mail id "+$scope.gridMMIUserData[removeIndex].email;
   }
  else
   {
    messageline="You are blocking "+$scope.gridMMIUserData[removeIndex].firstname+" , email notification will be sent to him that , some problem in your account please contact admin";
    popup=0;
   }

  var yes=confirm(messageline);
  if(yes)
  {
      if(popup)
      {
        var modalInstance = $modal.open({
            templateUrl: 'familyofficemmi.html',
            controller: 'AssignRoleMMICtrl',
            resolve: {
                searchable: function () {
                    return $scope.gridMMIUserData[removeIndex].searchable;
                },
                adminrole: function () {
                    return $scope.gridMMIUserData[removeIndex].adminrole;
                },
                familyrole: function () {
                    return $scope.gridMMIUserData[removeIndex].familyrole;
                },
                userid: function () {
                    return userId;
                },
                removeIndex: function () {
                    return removeIndex;
                },
                commentvisible: function () {
                    return $scope.gridMMIUserData[removeIndex].commentvisible;
                },
                roletype: function () {
                    return $scope.gridMMIUserData[removeIndex].company['roletype'];
                }
              }
        });

      }else{

        $http({ method: 'PUT', url: '/api/mmiusers/status/'+userId,data:{'status':setStatus}}).
            success(function (data, status, headers, config) {
               $scope.gridMMIUserData[removeIndex].status=setStatus;
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

    $scope.userStatus = function(userId) {
      var removeIndex = $scope.gridUserData
        .map(function(item) {
          return item._id;
        })
        .indexOf(userId);

      var setStatus = !$scope.gridUserData[removeIndex].status,
        messageline = "";
      var popup = 1;
      if (setStatus) {
        if(!$scope.gridUserData[removeIndex].madebyadmin){
          messageline = "You are approving " + $scope.gridUserData[
            removeIndex].name +
          " a mail notification will be sent to  mail id " + $scope.gridUserData[
            removeIndex].email;
          }else{
            messageline = "You are approving " + $scope.gridUserData[
              removeIndex].name +" but you made this account so mail will not send to this user";
          }
      } else {
        if(!$scope.gridUserData[removeIndex].madebyadmin){
        messageline = "You are blocking " + $scope.gridUserData[removeIndex]
          .name +
          " , email notification will be sent to him that , some problem in your account please contact admin";
        }else{

          messageline = "You are blocking " + $scope.gridUserData[removeIndex]
            .name +
            " but you made this account so mail will not send to this user";

        }
        popup = 0;
      }

      var yes = confirm(messageline);
      if (yes) {
        if (popup) {
          var modalInstance = $modal.open({
            templateUrl: 'familyoffice.html',
            controller: 'AssignRoleCtrl',
            resolve: {
              searchable: function() {
                return $scope.gridUserData[removeIndex].searchable;
              },
              adminrole: function() {
                return $scope.gridUserData[removeIndex].adminrole;
              },
              familyrole: function() {
                return $scope.gridUserData[removeIndex].familyrole;
              },
              userid: function() {
                return userId;
              },
              removeIndex: function() {
                return removeIndex;
              },
              commentvisible: function() {
                return $scope.gridUserData[removeIndex].commentvisible;
              }
            }
          });

        } else {

          $http({
            method: 'PUT',
            url: '/api/users/status/' + userId,
            data: {
              'status': setStatus
            }
          }).
          success(function(data, status, headers, config) {
            $scope.gridUserData[removeIndex].status = setStatus;
          }).
          error(function(data, status, headers, config) {
            // ...
            // $scope.article={};
          });
        }
      } else {

      }

    };
    $scope.articleStatus = function(articleId) {
      var removeIndex = $scope.gridArticleData
        .map(function(item) {
          return item._id;
        })
        .indexOf(articleId);

      var setStatus = !$scope.gridArticleData[removeIndex].approve;
      $http({
        method: 'PUT',
        url: '/api/articles/' + articleId,
        data: {
          'public': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridArticleData[removeIndex].approve = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.articlePin = function(articleId) {
      var removeIndex = $scope.gridArticleData
        .map(function(item) {
          return item._id;
        })
        .indexOf(articleId);

      var setStatus = !$scope.gridArticleData[removeIndex].pin;
      $http({
        method: 'PUT',
        url: '/api/articles/' + articleId,
        data: {
          'pin': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridArticleData[removeIndex].pin = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.articleMoney = function(articleId) {
      var removeIndex = $scope.gridArticleData
        .map(function(item) {
          return item._id;
        })
        .indexOf(articleId);

      var setStatus = !$scope.gridArticleData[removeIndex].money;
      $http({
        method: 'PUT',
        url: '/api/articles/' + articleId,
        data: {
          'money': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridArticleData[removeIndex].money = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.articleHans = function(articleId) {
      var removeIndex = $scope.gridArticleData
        .map(function(item) {
          return item._id;
        })
        .indexOf(articleId);

      var setStatus = !$scope.gridArticleData[removeIndex].hans;
      $http({
        method: 'PUT',
        url: '/api/articles/' + articleId,
        data: {
          'hans': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridArticleData[removeIndex].hans = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.articleMMIBanner = function(articleId) {
      var removeIndex = $scope.gridArticleData
        .map(function(item) {
          return item._id;
        })
        .indexOf(articleId);

      var setStatus = !$scope.gridArticleData[removeIndex].mmibanner;
      $http({
        method: 'PUT',
        url: '/api/articles/' + articleId,
        data: {
          'mmibanner': setStatus,
          'banner': 1
        }
      }).
      success(function(data, status, headers, config) {
        if (setStatus) {
          angular.forEach($scope.gridArticleData, function(val, key) {
            $scope.gridArticleData[key].mmibanner = !setStatus;
          });
        }

        $scope.gridArticleData[removeIndex].mmibanner = setStatus;

      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.eventStatus = function(eventId) {
      var removeIndex = $scope.gridEventData
        .map(function(item) {
          return item._id;
        })
        .indexOf(eventId);

      var setStatus = !$scope.gridEventData[removeIndex].approve;
      $http({
        method: 'PUT',
        url: '/api/events/' + eventId,
        data: {
          'public': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridEventData[removeIndex].approve = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.eventPin = function(eventId) {
      var removeIndex = $scope.gridEventData
        .map(function(item) {
          return item._id;
        })
        .indexOf(eventId);

      var setStatus = !$scope.gridEventData[removeIndex].pin;
      $http({
        method: 'PUT',
        url: '/api/events/' + eventId,
        data: {
          'pin': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridEventData[removeIndex].pin = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };
    $scope.eventMoney = function(eventId) {
      var removeIndex = $scope.gridEventData
        .map(function(item) {
          return item._id;
        })
        .indexOf(eventId);

      var setStatus = !$scope.gridEventData[removeIndex].money;
      $http({
        method: 'PUT',
        url: '/api/events/' + eventId,
        data: {
          'money': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridEventData[removeIndex].money = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.eventHans = function(eventId) {
      var removeIndex = $scope.gridEventData
        .map(function(item) {
          return item._id;
        })
        .indexOf(eventId);

      var setStatus = !$scope.gridEventData[removeIndex].hans;
      $http({
        method: 'PUT',
        url: '/api/events/' + eventId,
        data: {
          'hans': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridEventData[removeIndex].hans = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };

    $scope.deleteArticle = function(articleId) {
      var yes = confirm('Are you sure you want to delete this Article?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/articles/' + articleId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridArticleData
              .map(function(item) {
                return item._id;
              })
              .indexOf(articleId);

            $scope.gridArticleData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };


    $scope.deleteFamily = function(familyId) {
      var yes = confirm(
        'Are you sure you want to delete this Family Name ?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/family/' + familyId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridFamilyData
              .map(function(item) {
                return item._id;
              })
              .indexOf(familyId);

            $scope.gridFamilyData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };

    $scope.deleteExpert = function(expertId) {
      var yes = confirm('Are you sure you want to delete this Expert ?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/expert/' + expertId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridExpertData
              .map(function(item) {
                return item._id;
              })
              .indexOf(expertId);

            $scope.gridExpertData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };

    $scope.deleteEvent = function(expertId) {
      var yes = confirm('Are you sure you want to delete this Event ?');
      if (yes) {
        $http({
          method: 'DELETE',
          url: '/api/events/' + expertId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridEventData
              .map(function(item) {
                return item._id;
              })
              .indexOf(expertId);

            $scope.gridEventData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };

    $scope.companyStatus = function(eventId) {
      var removeIndex = $scope.gridCompanyData
        .map(function(item) {
          return item._id;
        })
        .indexOf(eventId);

      var setStatus = !$scope.gridCompanyData[removeIndex].approve;
      $http({
        method: 'PUT',
        url: '/api/companys/' + eventId,
        data: {
          'public': setStatus
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridCompanyData[removeIndex].approve = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });

    };


    $scope.deleteCompany = function(articleId) {
      var yes = confirm('Are you sure you want to delete this Company?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/companys/' + articleId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridCompanyData
              .map(function(item) {
                return item._id;
              })
              .indexOf(articleId);

            $scope.gridCompanyData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };

    $scope.setSearch = function(search) {
      $location.search(search);

    };

    $timeout(function() {
      $scope.mainPage = Object.keys($location.search())[0] || 'users';
      switch ($scope.mainPage) {
        case 'users':
          $scope.gridUserData = {};
          $http({
            method: 'GET',
            url: 'api/family'
          }).
          success(function(data, status, headers, config) {
            $scope.basicFamilys = data.familys;

          }).
          error(function(data, status, headers, config) {

          });
          User.query(function(users) {
            $scope.gridUserData = users.users;
            $scope.originalPINUsersData= angular.copy(users.users);

          });
          break;

        case 'mmiusers':
          $scope.gridMMIUserData = {};
          $http({
            method: 'GET',
            url: 'api/companys/basic?verybasic=1'
          }).
          success(function(data, status, headers, config) {
            $scope.basicCompanies = data.company;

          }).
          error(function(data, status, headers, config) {

          });
          MMIUser.query(function(users) {
            $scope.gridMMIUserData = users.users;
            $scope.originalMMIUsersData= angular.copy(users.users);
          });
          break;

        case 'articles':
          $scope.gridArticleData = {};
          $http({
            method: 'GET',
            url: 'api/articles/basic'
          }).
          success(function(data, status, headers, config) {
            $scope.gridArticleData = data.articles;
            $scope.originalArticalData= angular.copy(data.articles);

          }).
          error(function(data, status, headers, config) {

          });

          break;

        case 'family':
          $scope.gridFamilyData = {};
          $http({
            method: 'GET',
            url: 'api/family'
          }).
          success(function(data, status, headers, config) {
            $scope.gridFamilyData = data.familys;

          }).
          error(function(data, status, headers, config) {

          });

          break;
        case 'expert':
          $scope.gridFamilyData = {};
          $http({
            method: 'GET',
            url: 'api/expert'
          }).
          success(function(data, status, headers, config) {
            $scope.gridExpertData = data.experts;

          }).
          error(function(data, status, headers, config) {

          });

          break;

        case 'event':
          $scope.gridFamilyData = {};
          $http({
            method: 'GET',
            url: 'api/events/basic'
          }).
          success(function(data, status, headers, config) {
            $scope.gridEventData = data.articles;

          }).
          error(function(data, status, headers, config) {

          });

          break;

        case 'company':
          $scope.gridFamilyData = {};
          $http({
            method: 'GET',
            url: 'api/companys/basic'
          }).
          success(function(data, status, headers, config) {
            $scope.gridCompanyData = data.company;

          }).
          error(function(data, status, headers, config) {

          });

          break;

        default:
          break;
      }
    }, 0);

    $scope.filterOptions = {
      filterText: '',
      filterColumn: ''
    };
    //according to the data coming from server side,pagination will be set accordingly
       $scope.setPagingData = function(data, page, pageSize){
           $scope.myData = data;
           if (!$scope.$$phase) {
               $scope.$apply();
           }
       };

       //watch for pagination option.here pagingOptions will be watched each time value changes and then set the data accordingly
       $scope.$watch('pagingOptions', function (newVal, oldVal) {
           if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
             $scope.filterArticle($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
           }
       }, true);

       $scope.$watch('filterOptions', function (newVal, oldVal) {
           if (newVal !== oldVal) {
             if($scope.mainPage === 'articles'){
               $scope.filterArticle($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }else  if($scope.mainPage === 'mmiusers'){
              $scope.filterMMIUsers($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }else  if($scope.mainPage === 'pinusers'){
              $scope.filterPINUsers($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
           }
       }, true);

    var editDeleteArticleTemplate =
      '<a ng-click="deleteArticle(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/articles/view/{{row.entity._id}}"  id="view"  class="label label-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/articles/edit/{{row.entity._id}}"  id="view"  class="label label-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

    $scope.articleData = {
      data: 'gridArticleData',
      enablePaging: true,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      // pagingOptions: $scope.pagingOptions,
      enableColumnResize : true,
      enableCellSelection: true,
      enableRowSelection: false,
      showFilter: true,
      filterOptions: $scope.filterOptions,

      // showGroupPanel: true ,
      columnDefs: [
        {
          field: '_id',
          displayName: 'SN',
          cellTemplate: '<span> {{row.rowIndex+1}}</span>',
          cellClass: 'grid-align',
          width: '30px'
        },
         {
          field: 'title',
          displayName: 'Title',
          width: '440px',
        cellClass: 'grid-align'
        }, {
          field: 'author',
          displayName: 'Author',
          width: '110px',
        cellClass: 'grid-align'
        },
        // { field: 'tags' ,displayName:'Tags' },
        // {
        //   field: 'comments',
        //   displayName: 'Comment'
        // },
        //  {
        //   field: 'category',
        //   displayName: 'Category'
        // },
        { field: 'createdAt' ,displayName:'Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',cellClass: 'grid-align' },
        {
          field: 'approve',
          displayName: 'Approve',
          width: '100px',
          cellTemplate: '<span ng-if="row.entity.approve" class="label label-success" ng-click="articleStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="articleStatus(row.entity._id)">NOT APPROVED</span>'
        }, {
          field: 'pin',
          displayName: 'PIN',
          cellTemplate: '<span ng-if="row.entity.pin" class="label label-success" ng-click="articlePin(row.entity._id)">SHOW</span><span ng-if="!row.entity.pin" class="label label-danger" ng-click="articlePin(row.entity._id)">NOT SHOW</span>'
        },

        {
          field: 'money',
          displayName: 'MMI',
          cellTemplate: '<span ng-if="row.entity.money" class="label label-success" ng-click="articleMoney(row.entity._id)">SHOW</span><span ng-if="!row.entity.money" class="label label-danger" ng-click="articleMoney(row.entity._id)">NOT SHOW</span>'
        },

        {
          field: 'hans',
          displayName: 'TMH',
          cellTemplate: '<span ng-if="row.entity.hans" class="label label-success" ng-click="articleHans(row.entity._id)">SHOW</span><span ng-if="!row.entity.hans" class="label label-danger" ng-click="articleHans(row.entity._id)">NOT SHOW</span>'
        },

        {
          field: 'mmibanner',
          displayName: 'MMI Banner',
          cellTemplate: '<span ng-if="row.entity.mmibanner" class="label label-success" ng-click="articleMMIBanner(row.entity._id)">YES</span><span ng-if="!row.entity.mmibanner" class="label label-danger" ng-click="articleMMIBanner(row.entity._id)">NOT</span>'
        },

        {
          field: '',
          displayName: 'Action',
          cellTemplate: editDeleteArticleTemplate,
          maxWidth: 100
        }
      ],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.userData = {
      data: 'gridUserData',
      // showGroupPanel: true ,
      // enableCellSelection: true,
      enableRowSelection: false,
        showFilter: true,
      filterOptions: $scope.filterOptions,
      columnDefs: [{
        field: '_id',
        displayName: 'SN',
        cellTemplate: '<span> {{row.rowIndex+1}}</span>',
        cellClass: 'grid-align',
        width: '30px'
      }, {
        field: 'name',
        displayName: 'Name',
        cellClass: 'grid-align'
      }, {
        field: 'email',
        displayName: 'Email',
        width:'200px',
        cellClass: 'grid-align'
      },
      //  {
      //   field: 'band',
      //   displayName: 'Band',
      //   cellTemplate: '<span ng-show="!row.entity.status" >{{ row.entity.band }}</span><span ng-show="row.entity.status"><input  type="text" ng-model="row.entity.band" ng-blur="updateBand(row.entity,row.entity.band)" ng-value="row.entity.band" /></span>'
      // },
      //  {
      //   field: 'role',
      //   displayName: 'Role'
      // },
       {
        field: 'familyrole.name',
        displayName: 'FamilyRole',
        cellClass: 'grid-align'
      },
      {
       field: 'createdAt',
       displayName: 'Date',
       cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
       cellClass: 'grid-align'
     },
      //  {
      //   field: 'commentvisible',
      //   displayName: 'Commentvisible'
      // },
      //  {
      //   field: 'searchable',
      //   displayName: 'Searchable'
      // }, {
      //   field: 'adminrole',
      //   displayName: 'Adminrole'
      // },
       {
        field: 'emailVerification',
        displayName: 'EmailVerification',
        cellTemplate: '<span ng-if="row.entity.emailVerification" class="label label-success">Done</span><span ng-if="!row.entity.emailVerification" class="label label-danger" >Pending</span>'
      },
      //  {
      //   field: 'username',
      //   displayName: 'Username'
      // },
       {
        field: 'status',
        displayName: 'Status',
        cellTemplate: '<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'
      },
     {
        field: 'action',
        displayName: 'Action',
        cellTemplate: '<span ng-if="row.entity.status" class="label label-info" ng-click="userStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="userStatus(row.entity._id)">Approve</span> '
      }],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };


  $scope.mmiuserData = { data: 'gridMMIUserData' ,
                        // showGroupPanel: true ,
                         // enableCellSelection: true,
                         enableRowSelection: false,
                         filterOptions: $scope.filterOptions,
                         columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>',
                         cellClass: 'grid-align',
                         width: '30px'},
                                    { field: 'firstname' ,displayName:'First Name',cellClass: 'grid-align' },
                                    { field: 'email' ,displayName:'Email',cellClass: 'grid-align' },
                                    // { field: 'band' ,displayName:'Band',cellTemplate : '<span ng-show="!row.entity.status" >{{ row.entity.band }}</span><span ng-show="row.entity.status"><input  type="text" ng-model="row.entity.band" ng-blur="updateBand(row.entity,row.entity.band)" ng-value="row.entity.band" /></span>'},
                                    // { field: 'role' ,displayName:'Role'},
                                    // { field: 'commentvisible' ,displayName:'Commentvisible'},
                                    // { field: 'searchable' ,displayName:'Searchable'},
                                    // { field: 'adminrole' ,displayName:'Adminrole'},
                                    // { field: 'emailVerification' ,displayName:'EmailVerification',cellTemplate:'<span ng-if="row.entity.emailVerification" class="label label-success">Done</span><span ng-if="!row.entity.emailVerification" class="label label-danger" >Pending</span>' },
                                    // { field: 'username' ,displayName:'Username' },
                                    { field: 'createdAt' ,displayName:'Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',cellClass: 'grid-align'  },
                                    { field: 'status' ,displayName:'Status',cellTemplate:'<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>',width:'250px'},
                                    { field: 'action' ,displayName:'Action',cellTemplate:'<span ng-if="row.entity.status" class="label label-info" ng-click="mmiuserStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="mmiuserStatus(row.entity._id)">Approve</span> ',width:'150px'}],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

    var editDeleteFamilyTemplate =
      '<a ng-click="deleteFamily(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a>';


    $scope.familyData = {
      data: 'gridFamilyData',
      // showGroupPanel: true ,
      // enableCellSelection: true,
      enableRowSelection: false,
      filterOptions: $scope.filterOptions,
      columnDefs: [{
        field: '_id',
        displayName: 'SN',
        cellTemplate: '<span> {{row.rowIndex+1}}</span>',
        cellClass: 'grid-align',
        width: '30px'
      }, {
        field: 'name',
        displayName: 'Name',
        cellTemplate: '<input  type="text" ng-model="row.entity.name" ng-blur="updateFamily(row.entity,row.entity.name)" ng-value="row.entity.name" />'

      }],
      // { field: '',displayName:'Action', cellTemplate: editDeleteFamilyTemplate, maxWidth: 100  }],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };


    var editDeleteExpertTemplate =
      '<a ng-click="deleteExpert(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a><a ng-href="/expert/edit/{{row.entity._id}}"  id="view"  class="label label-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';


    $scope.expertData = {
      data: 'gridExpertData',
      // showGroupPanel: true ,
      // enableCellSelection: true,
      enableRowSelection: false,
       rowHeight: 80,
      filterOptions: $scope.filterOptions,
      columnDefs: [{
        field: '_id',
        displayName: 'SN',
        cellTemplate: '<span> {{row.rowIndex+1}}</span>',
        cellClass: 'grid-align',
        width: '30px'
      }, {
        field: 'media',
        displayName: 'Profile',
        cellTemplate: '<img style="height:70px;width:70px;"ng-src="{{row.entity.media.path}}">',
        cellClass: 'grid-align'
      }, {
        field: 'name',
        displayName: 'Name',
        cellTemplate: '<input  type="text" ng-model="row.entity.name" ng-blur="updateExpert(row.entity,row.entity.name)" ng-value="row.entity.name" />',
        cellClass: 'grid-align'
      }, {
        field: 'designation',
        displayName: 'Designation',
        cellClass: 'grid-align'
      }, {
        field: 'mail',
        displayName: 'Mail',
        cellClass: 'grid-align'
      }, {
        field: 'linkedin',
        displayName: 'Linkedin',
        cellClass: 'grid-align'
      },
      { field: 'createdAt' ,displayName:'Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',cellClass: 'grid-align'  },
      {
        field: '',
        displayName: 'Action',
        cellTemplate: editDeleteExpertTemplate,
        maxWidth: 100
      }],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };


    var editDeleteEventTemplate =
      '<a ng-click="deleteEvent(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/event/view/{{row.entity._id}}"  id="view"  class="label label-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/event/edit/{{row.entity._id}}"  id="view"  class="label label-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

    $scope.eventData = {
      data: 'gridEventData',
      enableCellSelection: true,
      enableRowSelection: false,
      filterOptions: $scope.filterOptions,

      // showGroupPanel: true ,
      columnDefs: [{
          field: '_id',
          displayName: 'SN',
          cellTemplate: '<span> {{row.rowIndex+1}}</span>',
          cellClass: 'grid-align',
          width: '30px'
        }, {
          field: 'title',
          displayName: 'Title',
        cellClass: 'grid-align',
        width: '420px'

        }, {
          field: 'author',
          displayName: 'Author',
        cellClass: 'grid-align',
        width: '120px'
        },
        // { field: 'expert' ,displayName:'Expert' },
        // { field: 'comments' ,displayName:'Comments' },
        {
          field: 'category',
          displayName: 'Category',
        cellClass: 'grid-align'
        }, {
          field: 'eventdate',
          displayName: 'Date',
          cellTemplate: '<span> {{row.entity.eventdate|date:"dd-MM-yyyy"}}</span>',
        cellClass: 'grid-align'
        }, {
          field: 'approve',
          displayName: 'Approve',
          cellTemplate: '<span ng-if="row.entity.approve" class="label label-success" ng-click="eventStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="eventStatus(row.entity._id)">NOT APPROVED</span>',
          width: '110px'

        }, {
          field: 'pin',
          displayName: 'PIN',
          cellTemplate: '<span ng-if="row.entity.pin" class="label label-success" ng-click="eventPin(row.entity._id)">SHOWN</span><span ng-if="!row.entity.pin" class="label label-danger" ng-click="eventPin(row.entity._id)">NOT SHOWN</span>'
        }, {
          field: 'money',
          displayName: 'MMI',
          cellTemplate: '<span ng-if="row.entity.money" class="label label-success" ng-click="eventMoney(row.entity._id)">SHOWN</span><span ng-if="!row.entity.money" class="label label-danger" ng-click="eventMoney(row.entity._id)">NOT SHOWN</span>'
        }, {
          field: 'hans',
          displayName: 'TMH',
          cellTemplate: '<span ng-if="row.entity.hans" class="label label-success" ng-click="eventHans(row.entity._id)">SHOWN</span><span ng-if="!row.entity.hans" class="label label-danger" ng-click="eventHans(row.entity._id)">NOT SHOWN</span>'
        }, {
          field: '',
          displayName: 'Action',
          cellTemplate: editDeleteEventTemplate,
          maxWidth: 100
        }
      ],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };


    var editDeleteCompanyTemplate = '<a ng-click="deleteCompany(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/company/view/{{row.entity._id}}"  id="view"  class="label label-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/company/edit/{{row.entity._id}}"  id="view"  class="label label-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

    $scope.companyData = {
      data: 'gridCompanyData',
      enableCellSelection: true,
      enableRowSelection: false,
      filterOptions: $scope.filterOptions,

      // showGroupPanel: true ,
      columnDefs: [{
          field: '_id',
          displayName: 'SN',
          cellTemplate: '<span> {{row.rowIndex+1}}</span>',
          cellClass: 'grid-align',
          width: '30px'
        }, {
          field: 'title',
          displayName: 'Title',
        cellClass: 'grid-align',
        width: '350px'
        }, {
          field: 'firmsupertype',
          displayName: 'SuperType',
        cellClass: 'grid-align',
          width: '90px'
        }, {
          field: 'firmtype',
          displayName: 'Type',
        cellClass: 'grid-align'
        }, {
          field: 'firmsubtype',
          displayName: 'Sub Type',
        cellClass: 'grid-align'
        }, {
          field: 'createdAt',
          displayName: 'Date',
          cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
        cellClass: 'grid-align'
        },
        // { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="companyStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="copmanyStatus(row.entity._id)">NOT APPROVED</span>'},
        {
          field: '',
          displayName: 'Action',
          cellTemplate: editDeleteCompanyTemplate,
          maxWidth: 100
        }
      ],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };



  });


angular.module('pinApp')
  .controller('FamilyCtrl', function($scope, $modalInstance, $rootScope, $http,
    $location, $window, $controller, $route, $templateCache) {

    $.extend(this, $controller('AdminPanelCtrl', {
      $scope: $scope
    }));

    $scope.family = {};
    $scope.saveFamily = function() {
      var familyname = $("#familyname").val();
      if (familyname) {
        var family = {
          name: familyname
        };

        $http({
          method: 'POST',
          url: '/api/family/',
          data: family
        }).
        success(function(data, status, headers, config) {
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
        error(function(data, status, headers, config) {
          $scope.family = {};
          $modalInstance.dismiss('cancel');
        });



      } else {

        alert('please fill family name');
      }

    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });


angular.module('pinApp')
  .controller('AssignRoleCtrl', function($scope, $modalInstance, $rootScope,
    $http, $location, $window, $controller, searchable, adminrole, familyrole,
    userid, removeIndex, commentvisible, $templateCache, $route) {
    $scope.userupdate = {
      familyrole: familyrole,
      searchable: searchable,
      adminrole: adminrole,
      commentvisible: commentvisible
    };

    $.extend(this, $controller('AdminPanelCtrl', {
      $scope: $scope
    }));

    $http({
      method: 'GET',
      url: 'api/family'
    }).
    success(function(data, status, headers, config) {
      $scope.familys = data.familys;
    }).
    error(function(data, status, headers, config) {

    });

    $scope.saveRole = function() {
      $http({
        method: 'PUT',
        url: '/api/users/status/' + userid,
        data: {
          'status': 1,
          adminrole: $scope.userupdate.adminrole,
          familyrole: $scope.userupdate.familyrole,
          searchable: $scope.userupdate.searchable,
          commentvisible: $scope.userupdate.commentvisible
        }
      }).
      success(function(data, status, headers, config) {
        $modalInstance.close();
        var currentPageTemplate = $route.current.templateUrl;
        $templateCache.remove(currentPageTemplate);
        $route.reload();

      }).
      error(function(data, status, headers, config) {
        $scope.userupdate = {};
        $modalInstance.dismiss('cancel');
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  });


angular.module('pinApp')
.controller('AssignRoleMMICtrl', function ($scope, $modalInstance,$rootScope,$http,$location,$window,$controller,searchable,adminrole,familyrole,userid,removeIndex,commentvisible,roletype,$templateCache,$route) {
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
          $http({ method: 'PUT', url: '/api/mmiusers/status/'+userid,data:{'status':1,adminrole:$scope.userupdate.adminrole,familyrole:$scope.userupdate.familyrole,searchable:$scope.userupdate.searchable,commentvisible:$scope.userupdate.commentvisible}}).
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
