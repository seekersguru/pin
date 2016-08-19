'use strict';

//exporyt to excel related methods start 
function datenum(v, date1904) {
  if(date1904) v+=1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}
 
function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
  for(var R = 0; R != data.length; ++R) {
    for(var C = 0; C != data[R].length; ++C) {
      if(range.s.r > R) range.s.r = R;
      if(range.s.c > C) range.s.c = C;
      if(range.e.r < R) range.e.r = R;
      if(range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C] };
      if(cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
      
      if(typeof cell.v === 'number') cell.t = 'n';
      else if(typeof cell.v === 'boolean') cell.t = 'b';
      else if(cell.v instanceof Date) {
        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';
      
      ws[cell_ref] = cell;
    }
  }
  if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}
 

function Workbook() {
  if(!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}
 

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

//exporyt to excel related methods stop

 
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
  .controller('AdminPanelCtrl', function($scope, User, MMIUser, Article, $http,
    $location, $window, $modal, Auth, $timeout) {
    $scope.ranges = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 days': [moment().subtract(7, 'days'), moment()],
      'Last 30 days': [moment().subtract(30, 'days'), moment()],
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

    $scope.approves = {
        true: "Approve",
        false: "Not Approve"
      }
      //variable define for getting the total no of items to be displayed
  $scope.totalServerItems = 0;

    //these are the paging(pagination) options
    $scope.pagingOptions = {
      //no of records that need to be displayed per page will be depend on pagesizes
      pageSizes: [10,20,30,40,50,60,70,80,90,100],
      pageSize: 50,
      //this is for the page no that is selected
      currentPage: 1
    };

    $scope.articleFilter = {

    };
    $scope.mmiFilter = {

    };
    $scope.companyFilter = {

    };
    $scope.pinFilter = {

    };
    $scope.companyFilter.status =true;
    
    setTimeout(function() {
      $scope.articleFilter['createdAt']= {
        endDate: '',
        startDate: ''
      };
      $scope.mmiFilter['createdAt']= {
        endDate: '',
        startDate: ''
      };

      $scope.pinFilter['createdAt'] ={
        endDate: '',
        startDate: ''
      };
      $scope.$apply();
    }, 1000);
    $scope.roletypes = [
      'CEO/business head',
      'Management',
      'Sales/Marketing',
      'Investment/Product',
      'RM/client facing',
      'Investment Mgmt (Sell side)',
      'Product Mgmt (Sell side)',
      'Operations',
      'HR',
      'Head Investment Solutions Group',
      'Admin'
    ];
    $scope.setPagingData = function() {
      $scope.gridArticleData = data.articles;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    }
    $scope.filterArticle = function() {
      var data;
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;
      var searchText = $scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
        var ft = searchText.toLowerCase();
        $http({
          method: 'GET',
          url: 'api/articles/basic?filter=' + JSON.stringify($scope.articleFilter)
        }).
        success(function(data, status, headers, config) {
          //with data must send the total no of items as well
        $scope.totalServerItems = data.totalElement;
          //here's the list of data to be displayed
          data.articles = data.articles.filter(function(item) {
            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
          });
          $scope.gridArticleData = data.articles;
          // $scope.setPagingData(data,page,pageSize);
        }).
        error(function(data, status, headers, config) {

        });
      } else {
        $http({
          method: 'GET',
          url: 'api/articles/basic?filter=' + JSON.stringify($scope.articleFilter)
        }).
        success(function(data, status, headers, config) {
          $scope.gridArticleData = data.articles;
           $scope.totalServerItems=data.totalElement;
          // $scope.setPagingData(data,page,pageSize);

        }).
        error(function(data, status, headers, config) {

        });
      }
    }

    $scope.filterMMIUsers = function() {
      var data;
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;
      var searchText = $scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
        var ft = searchText.toLowerCase();
        $http({
          method: 'GET',
          url: 'api/mmiusers?filter=' + JSON.stringify($scope.mmiFilter),
          params:{pagesize:pageSize,current:page}
        }).
        success(function(users, status, headers, config) {
          //with data must send the total no of items as well
           $scope.totalServerItems=users.totalElement;
          //here's the list of data to be displayed
          users.users = users.users.filter(function(item) {
            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
          });
          $scope.gridMMIUserData = users.users;
          // $scope.setPagingData(data,page,pageSize);
        }).
        error(function(data, status, headers, config) {

        });
      } else {
        $http({
          method: 'GET',
          url: 'api/mmiusers?filter=' + JSON.stringify($scope.mmiFilter),
          params:{pagesize:pageSize,current:page}
        }).
        success(function(users, status, headers, config) {
          $scope.gridMMIUserData = users.users;
           $scope.totalServerItems=users.totalElement;
          // $scope.setPagingData(data,page,pageSize);

        }).
        error(function(data, status, headers, config) {

        });
      }
    };
    $scope.ExportNetCorePINUsers = function() {
      var data;
      var searchText = $scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
        var ft = searchText.toLowerCase();
        $http({
          method: 'GET',
          url: 'api/mmiusersexcel?filter=' + JSON.stringify($scope.mmiFilter)
        }).
        success(function(users, status, headers, config) {
          /* original data */
          var data = users;
          var ws_name = "MMIUsers";
          var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
          /* add worksheet to workbook */
          wb.SheetNames.push(ws_name);
          wb.Sheets[ws_name] = ws;
          var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "mmiusers.xlsx");

          // $scope.setPagingData(data,page,pageSize);
        }).
        error(function(data, status, headers, config) {

        });
      } else {
        $http({
          method: 'GET',
          url: 'api/mmiusersexcel?filter=' + JSON.stringify($scope.mmiFilter)
        }).
        success(function(users, status, headers, config) {
          /* original data */
          var data = users;
          var ws_name = "MMIUsers";
          var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
          /* add worksheet to workbook */
          wb.SheetNames.push(ws_name);
          wb.Sheets[ws_name] = ws;
          var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "mmiusers.xlsx");

        }).
        error(function(data, status, headers, config) {

        });
      }
    };

    $scope.ExportPINUsers = function() {
      var data;
      var searchText = $scope.filterOptions.filterText;
      //if filter text is there then this condition will execute
      if (searchText) {
        var ft = searchText.toLowerCase();
        $http({
          method: 'GET',
          url: 'api/mmiusersexcelfull?filter=' + JSON.stringify($scope.mmiFilter)
        }).
        success(function(users, status, headers, config) {
          /* original data */
          var data = users;
          var ws_name = "MMIUsers";
          var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
          /* add worksheet to workbook */
          wb.SheetNames.push(ws_name);
          wb.Sheets[ws_name] = ws;
          var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "mmiusers.xlsx");

          // $scope.setPagingData(data,page,pageSize);
        }).
        error(function(data, status, headers, config) {

        });
      } else {
        $http({
          method: 'GET',
          url: 'api/mmiusersexcelfull?filter=' + JSON.stringify($scope.mmiFilter)
        }).
        success(function(users, status, headers, config) {
          /* original data */
          var data = users;
          var ws_name = "MMIUsers";
          var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
          /* add worksheet to workbook */
          wb.SheetNames.push(ws_name);
          wb.Sheets[ws_name] = ws;
          var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "mmiusers.xlsx");

        }).
        error(function(data, status, headers, config) {

        });
      }
    };
    $scope.filterCompany = function() {
      var data;
      var searchText = $scope.filterOptions.filterText;
        $http({
          method: 'GET',
          url: 'api/companys/basic?filter=' + JSON.stringify($scope.companyFilter)
        }).
        success(function(users, status, headers, config) {
          $scope.gridCompanyData = users.company;
        }).
        error(function(data, status, headers, config) {

        });
    };

    $scope.ExportCompany = function() {
      var data;
        $http({
          method: 'GET',
          url: 'api/companyexcel?filter=' + JSON.stringify($scope.companyFilter)
        }).
        success(function(users, status, headers, config) {
          /* original data */
          var data = users;
          var ws_name = "Companies";
          var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);
          /* add worksheet to workbook */
          wb.SheetNames.push(ws_name);
          wb.Sheets[ws_name] = ws;
          var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "companies.xlsx");

        }).
        error(function(data, status, headers, config) {

        });
    };

    $scope.filterPINUsers = function() {
      var data;
      var page = $scope.pagingOptions.currentPage;
      var pageSize = $scope.pagingOptions.pageSize;
      var searchText = $scope.filterOptions.filterText;
      var url = '';
      if ($scope.mainPage === 'users') {
        url = 'api/users?filter=';
      } else {
        url = 'api/contentexpert?filter=';
      }

      //if filter text is there then this condition will execute
      if (searchText) {
        var ft = searchText.toLowerCase();
        $http({
          method: 'GET',
          url: url + JSON.stringify($scope.pinFilter)
        }).
        success(function(users, status, headers, config) {
          //with data must send the total no of items as well
          // $scope.totalServerItems=data.totalElement;
          //here's the list of data to be displayed
          users.users = users.users.filter(function(item) {
            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
          });
          $scope.gridUserData = users.users;
          // $scope.setPagingData(data,page,pageSize);
        }).
        error(function(data, status, headers, config) {

        });
      } else {
        $http({
          method: 'GET',
          url: url + JSON.stringify($scope.pinFilter)
        }).
        success(function(users, status, headers, config) {
          $scope.gridUserData = users.users;
          // $scope.totalServerItems=data.totalElement;
          // $scope.setPagingData(data,page,pageSize);

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

    $scope.adminStatus = function(userId) {
     var removeIndex = $scope.gridAdminUserData
        .map(function(item) {
          return item._id;
        })
        .indexOf(userId);

      var setStatus = !$scope.gridAdminUserData[removeIndex].status;
      $http({
        method: 'PUT',
        url: '/api/users/'+ userId,
        data: {
          'status': setStatus
        }
      }).
      success(function(data, status, headers, config) {
         $scope.gridAdminUserData[removeIndex].status = setStatus;
      }).
      error(function(data, status, headers, config) {
        // ...
        // $scope.article={};
      });
    };

    $scope.mmiuserStatus = function(userId) {
      var removeIndex = $scope.gridMMIUserData
        .map(function(item) {
          return item._id;
        })
        .indexOf(userId);

      var setStatus = !$scope.gridMMIUserData[removeIndex].status,
        messageline = "";
      var popup = 1;
      if (setStatus) {
        messageline = "You are approving " + $scope.gridMMIUserData[removeIndex].firstname + " a mail notification will be sent to  mail id " + $scope.gridMMIUserData[removeIndex].email;
      } else {
        messageline = "You are blocking " + $scope.gridMMIUserData[removeIndex].firstname + " , email notification will be sent to him that , some problem in your account please contact admin";
        popup = 0;
      }

      var yes = confirm(messageline);
      if (yes) {
        if (popup) {
          var modalInstance = $modal.open({
            templateUrl: 'familyofficemmi.html',
            controller: 'AssignRoleMMICtrl',
            resolve: {
              searchable: function() {
                return $scope.gridMMIUserData[removeIndex].searchable;
              },
              adminrole: function() {
                return $scope.gridMMIUserData[removeIndex].adminrole;
              },
              familyrole: function() {
                return $scope.gridMMIUserData[removeIndex].familyrole;
              },
              userid: function() {
                return userId;
              },
              removeIndex: function() {
                return removeIndex;
              },
              commentvisible: function() {
                return $scope.gridMMIUserData[removeIndex].commentvisible;
              },
              roletype: function() {
                return $scope.gridMMIUserData[removeIndex].company['roletype'];
              }
            }
          });

        } else {

          $http({
            method: 'PUT',
            url: '/api/mmiusers/status/' + userId,
            data: {
              'status': setStatus
            }
          }).
          success(function(data, status, headers, config) {
            $scope.gridMMIUserData[removeIndex].status = setStatus;
          }).
          error(function(data, status, headers, config) {
            // ...
            // $scope.article={};
          });
        }
      } else {

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
        if (!$scope.gridUserData[removeIndex].madebyadmin) {
          messageline = "You are approving " + $scope.gridUserData[
              removeIndex].name +
            " a mail notification will be sent to  mail id " + $scope.gridUserData[
              removeIndex].email;
        } else {
          messageline = "You are approving " + $scope.gridUserData[
            removeIndex].name + " but you made this account so mail will not send to this user";
        }
      } else {
        if (!$scope.gridUserData[removeIndex].madebyadmin) {
          messageline = "You are blocking " + $scope.gridUserData[removeIndex]
            .name +
            " , email notification will be sent to him that , some problem in your account please contact admin";
        } else {

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

    $scope.userDetail = function(userid, type) {
      var modalInstance = $modal.open({
        templateUrl: 'viewDetail.html',
        controller: 'ViewDetailCtrl',
        resolve: {
          userId: function() {
            return userid;
          },
          type: function() {
            return type;
          }
        }
      });
    };

    $scope.contentexpertStatus = function(userId) {
      var removeIndex = $scope.gridContentExpertData
        .map(function(item) {
          return item._id;
        })
        .indexOf(userId);

      var setStatus = !$scope.gridContentExpertData[removeIndex].status,
        messageline = "";
      var popup = 1;
      if (setStatus) {
        if (!$scope.gridContentExpertData[removeIndex].madebyadmin) {
          messageline = "You are approving " + $scope.gridContentExpertData[
              removeIndex].name +
            " a mail notification will be sent to  mail id " + $scope.gridContentExpertData[
              removeIndex].email;
        } else {
          messageline = "You are approving " + $scope.gridContentExpertData[
            removeIndex].name + " but you made this account so mail will not send to this user";
        }
      } else {
        if (!$scope.gridContentExpertData[removeIndex].madebyadmin) {
          messageline = "You are blocking " + $scope.gridContentExpertData[removeIndex]
            .name +
            " , email notification will be sent to him that , some problem in your account please contact admin";
        } else {

          messageline = "You are blocking " + $scope.gridContentExpertData[removeIndex]
            .name +
            " but you made this account so mail will not send to this user";

        }
        popup = 0;
      }

      var yes = confirm(messageline);
      if (yes) {
        if (popup) {
          $http({
            method: 'PUT',
            url: '/api/users/status/' + userId,
            data: {
              'status': setStatus
            }
          }).
          success(function(data, status, headers, config) {
            $scope.gridContentExpertData[removeIndex].status = setStatus;
          }).
          error(function(data, status, headers, config) {
            // ...
            // $scope.article={};
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
            $scope.gridContentExpertData[removeIndex].status = setStatus;
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
          'public': setStatus,
          'url':$scope.gridArticleData[removeIndex].title.trim().replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(' ').join('-')
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
          'public': setStatus,
          'url':$scope.gridEventData[removeIndex].title.trim().replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().split(' ').join('-')
          
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
    $scope.discussionStatus = function(eventId) {
      var removeIndex = $scope.gridDiscussionData
        .map(function(item) {
          return item._id;
        })
        .indexOf(eventId);

      var setStatus = !$scope.gridDiscussionData[removeIndex].status;
      $http({
        method: 'PUT',
        url: '/api/discussions/' + eventId,
        data: {
          'status': setStatus,
        }
      }).
      success(function(data, status, headers, config) {
        $scope.gridDiscussionData[removeIndex].status = setStatus;
      }).
      error(function(data, status, headers, config) {
    
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

    $scope.deleteAttachment = function(articleId) {
      var yes = confirm('Are you sure you want to delete this Attachment?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/attachments/' + articleId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridAttachmentsData
              .map(function(item) {
                return item._id;
              })
              .indexOf(articleId);

            $scope.gridAttachmentsData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };

    $scope.deleteMMIUser = function(articleId) {
      var yes = confirm('Are you sure you want to delete this MMIUser?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/mmiusers/' + articleId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridMMIUserData
              .map(function(item) {
                return item._id;
              })
              .indexOf(articleId);

            $scope.gridMMIUserData.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };

    $scope.deleteAdminUser = function(articleId) {
      var yes = confirm('Are you sure you want to delete this Admin User?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/users/' + articleId
        }).
        success(function(data, status, headers, config) {
            var removeIndex = $scope.gridAdminUserData
              .map(function(item) {
                return item._id;
              })
              .indexOf(articleId);

            $scope.gridAdminUserData.splice(removeIndex, 1);

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
      $scope.mainPage = Object.keys($location.search())[0] || 'adminusers';
      switch ($scope.mainPage) {
        case 'adminusers':
          $scope.gridAdminUserData = {};
          $http({
            method: 'GET',
            url: 'api/users?filter={"role":"admin"}'
          }).
          success(function(data, status, headers, config) {
            $scope.gridAdminUserData = data.users;
            $scope.originalAdminUserData = angular.copy(data.users);
          }).
          error(function(data, status, headers, config) {

          });
          break;
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
            $scope.originalPINUsersData = angular.copy(users.users);

          });
          break;

        case 'contentexpert':
          $scope.gridContentExpertData = {};

          $http({
            method: 'GET',
            url: 'api/family'
          }).
          success(function(data, status, headers, config) {
            $scope.basicFamilys = data.familys;
          }).
          error(function(data, status, headers, config) {

          });

          $http({
            method: 'GET',
            url: 'api/contentexpert'
          }).
          success(function(data, status, headers, config) {
            $scope.gridContentExpertData = data.users;
            $scope.originalContentExpertData = angular.copy(data.users);
          }).
          error(function(data, status, headers, config) {

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
            $scope.totalServerItems=users.totalElement;
            $scope.originalMMIUsersData = angular.copy(users.users);
            // $scope.setPagingData();
          });
          //remove by email id code commit 
          // var emailArray=['chetan.damani@sbi.co.in','chitra.basker@sbi.co.in','fca@vsnl.com','kalpesh.thakar@reuters.com','karan.singh@uti.co.in','naik@saharamutual.com','niraj.chandra@uti.co.in','nirmal.rewaria@edelcap.com','pkchand@birlacorp.com','sanjay.sharma@tatacapital.com','sanjayv@emiratesbank.com','satish.dikshit@uti.co.in','shrikant.tiwari@thomsonreuters.com','simi.mishra@thomsonreuters.com','vijayan.pankajakshan@welingkar.org','wm@tbngconsultants.com','adityavikram.dube@ml.com','amit_pathak@ml.com','anshu.shrivastava@revyqa.com','anuradha_shah@ml.com','apeksha.singh@oracle.com','aprabhu@templeton.com','ashish_gumashta@ml.com','atul_singh1@ml.com','avinash.luthria@gajacapital.com','d.rao@ml.com','dia_sen@ml.com','gfernandes@askgroup.in','girish.venkat@adityabirla.com','hbohara@askgroup.in','lahar.bhasin@icraonline.com','mehul_marfatia@ml.com','michelle_baptist@ml.com','pavit.chadha@ml.com','pkchand@birlacorp.com','pratikbagaria@rathi.com','r.karthik@lodhagroup.com','rajat.sinha@sc.com','rishab_parekh@ml.com','ritika.grover@hdfcbank.com','r_vaidya@ml.com','sandeep.khurana@sbi.co.in','sanjay_bhuwania@ml.com','satwick_tandon@ml.com','saujanya.shrivastava@bharti-axalife.com','shajikumar.devakar@barclaysasia.com','shruti.lohia@in.ey.com','shveta.singh@avendus.com','shyamal.lahon@tvscapital.in','siddharth_mishra@ml.com','skoticha@askgroup.in','svaidya@askgroup.in','tarun@tbngconsultants.com','ulhas.deshpande@bharti-axalife.com','unmesh_kulkarni@ml.com','varadaraya_mallya@ml.com','vikram_agarwal@ml.com','vishal.shah@barclaysasia.com','abhilash.misra@boiaxa-im.com','ajay.aswani@milestonecapital.in','anand.oke@axisbank.com','goswami@waltonst.com','mridulla@geplcapital.com','pkchand@birlacorp.com','query@arcil.co.in','srk@pinnaclefinancialplanners.com','vishal.mhaiskar@motilaloswal.com','asagar@adb.org','balvir@life-lite.com','d.p.singh@sbimf.com','dennythomas@hsbc.co.in','dinesh.khara@sbimf.com','goswami@waltonst.com','govind@acornwealth.com','hiten@kpmg.com','info@srinidhihomes.in','nitinsingh@hsbc.co.in','query@arcil.co.in','r.srinivas@sbimf.com','rahul.pal@taurusmutualfund.com','ravi.r.menon@hsbc.com','s.mahadevan@sbimf.com','sanjayshah@hsbc.co.in','shivdasrao@hsbc.co.in','sinor@amfiindia.com','srk@pinnaclefinancialplanners.com','sunil.avasthi@indianivesh.in','tanya.dere@sbimf.com','vivekmakim@hsbc.co.in','amitav@fiuindia.gov.in','anand@mfl.in','anil.abraham@hdfcbank.com','animeshraizada@hsbc.co.in','anisha.motwani@maxlifeinsurance.com','ankurt@lntmf.com','ashish.chauhan@bseindia.com','ashish.naik@axismf.com','ashissh.dikshit@bcids.org','ashu.suyash@lntmf.com','bharat.banka@adityabirla.com','birens@lntmf.com','c.vasudevan@bseindia.com','charul.shah@greshma.com','chetan1joshi@hsbc.co.in','debaprasad.mukherjee@fiserv.com','devika.shah@bseindia.com','dhirajsachdev@hsbc.co.in','dka@smcindiaonline.com','ekta.keswani@sc.com','gaurav.pandya@adityabirla.com','gaurav.perti@sc.com','ghazala.khatri@warmond.co.in','gopal.lakhotia@sc.com','hitendradave@hsbc.co.in','info@srinidhihomes.in','jayesh.faria@ltcapitalindia.in','jayesh.shroff@sbimf.com','jayna_gandhi@hotmail.com','jitendrasriram@hsbc.co.in','joseph.thomas@adityabirla.com','jyoti.vaswani@avivaindia.com','kailash@lntmf.com','lakshmi.sankar@icicibank.com','m.venkataraghavan@axismf.com','manjeeri@sngpartners.in','manoj.shenoy@ltcapitalindia.in','megha_maheshwari@icicipruamc.com','monalisa.shilov@bnpparibasmf.in','nainakidwai@hsbc.co.in','namitagodbole@plindia.com','navneet.munot@sbimf.com','naysar.shah@birlasunlife.com','nikhil.johri@bnpparibasmf.in','nilesh_c_shah@hotmail.com','nirakar.pradhan@futuregenerali.in','pankaj.murarka@axismf.com','pavri101@hotmail.com','piyushharlalka@hsbc.co.in','prateekjain@hsbc.co.in','praveen.bhatt@axismf.com','puneetchaddha@hsbc.co.in','query@arcil.co.in','r.srinivasan@sbimf.com','rahul_shringarpure@hotmail.com','rajeev.singhal@sbi.co.in','rajeshi@lntmf.com','rajeshp@lntmf.com','rajni@sbbj.co.in','rbajaj@bajajcapital.com','reema.savla@bseindia.com','ricsindia@rics.org','rohit.garg@kotak.com','ruchit.mehta@sbimf.com','saket@comsol.in','sandra.correia@vecinvestments.com','sanjay.dutt@ap.cushwake.com','shantanushankar@hsbc.co.in','shikhab@bajajcapital.com','shirazr@lntmf.com','shreenivashegde@hsbc.co.in','shridhar.iyer@bnpparibasmf.in','shujasiddiqui@ltcapitalindia.in','shwaitavaish@hsbc.co.in','siddharthtaterh@hsbc.co.in','sm2nid@centralbank.co.in','sohini.andani@sbimf.com','srk@pinnaclefinancialplanners.com','suchita.shah@sbimf.com','sudhanshu.asthana@axismf.com','surajs@lntmf.com','tanmaya.desai@sbimf.com','tusharpradhan@hsbc.co.in','uttama@bajajcapital.com','v.hansprakash@issl.co.in','vcskenkare@sancharnet.in','venugopalm@lntmf.com','vijai.mantri@pramerica.com','vijay.prabhu@sbimf.com','vijaykumar@andhrabank.co.in','vikramc@lntmf.com','vimaljain@sbbj.co.in','vineet1patawari@hsbc.co.in','vinod.nair@bseindia.com','vinodv@lntmf.com','virendra@sngpartners.in','viresh.joshi@axismf.com','vishal@cedarwood.co.in','yatin.padia@bseindia.com','ajay.mittal@birlasunlife.com','anish.arora@nirmalbang.com','aparna.mantha@hdfcbank.com','asethi@tata.com','atul.sharma@morningstar.com','balachandra.shettigar@gmail.com','bhavesh@danisecurities.com','debajeet.das@hdfcbank.com','gaurav.mital@db.com','info@srinidhihomes.in','investments@veteassociates.com','jacob.kurien@yesbank.in','jitendra.kashyap@sbi.co.in','kalpesh.thakar@reuters.com','kamalika.das@icicibank.com','kapilseth@hsbc.co.in','keertigupta@birlasunlife.com','kv.rao@db.com','lalita.gupte@icicibank.com','lovelish.solanki@unionkbc.com','m.chaudhary@sbi.co.in','molly.kapoor@birlasunlife.com','mufaddal.pittalwala@tatacapital.com','munish.mittal@hdfcbank.com','nakasrinivas.rao@sbi.co.in','navnath.rundekar@uti.co.in','neeraj.sirur@rbs.com','nilesh.sathe@licnomuramf.com','nirmal.reddy@citi.com','nishith.desai@nishithdesai.com','ome.srivastava@sbi.co.in','p.shunmugam@uti.co.in','parag.morey@adityabirla.com','payal.bham@tatacapital.com','pooja.vyas@rbs.com','prasad.dhonde@birlasunlife.com','prashant-p.joshi@db.com','prashant.besekar@dspblackrock.com','prerana.langa@yesbank.in','puneet.diwan@icicibank.com','rajesh.dalmia@relianceada.com','rajil.jhaveri@barcap.com','rajrishi.jain@sc.com','rama.biyani@rbs.com','ravindran@sebi.gov.in','renjith.rajan@dspblackrock.com','reshma.chatterjee@dspblackrock.com','rishi.nathany@dalmiasec.com','ritesh.patel@miraeassetmf.co.in','rohit.agarwal@yesbank.in','rohit.lall@yesbank.in','rohit.wadhwa@rbs.com','roopa.natrajan@hdfcbank.com','s.usha@sbi.co.in','sachin.bhambani@sc.com','sandeep.asthana@birlasunlife.com','sanjay.agarwal@db.com','sanobar.pradhan@uti.co.in','satya.prasad@icicibank.com','sbi.01102@sbi.co.in','senthil.nathan@rbs.com','shachi.kaul@db.com','sharad.sharma@asia.bnpparibas.com','shirish@njgroup.in','shiv.gupta@rbs.com','shivom.chakravarti@hdfcbank.com','shrikant.tiwari@thomsonreuters.com','shriram.j@adityabirla.com','shubhada.rao@yesbank.in','siddharth.deb@gs.com','siddharth.j@icicibank.com','sikharendra.datta@sc.com','simi.mishra@thomsonreuters.com','sonali.pradhan@rbs.com','sshrivastava@tataamc.com','sudhakar.kr@adityabirla.com','sundeep.kakar@citi.com','sunil.jani@njgroup.in','sunil.kaushal@sc.com','sunil.srivastava@sbi.co.in','surbhi.ogra@icicibank.com','surbhi.shweta@miraeassetmf.co.in','sushil.relan@sbi.co.in','tanya.naik@citi.com','thakkar.prashant@miraeassetmf.co.in','tinaz.misra@rbs.com','tushar.poddar@gs.com','tushar@njgroup.in','uday.kotak@kotak.com','vaibhav.chugh@birlasunlife.com','vaibhav.machhi@kotak.com','vanit.ladha@yesbank.in','vijay.karnani@gs.com','vikas-m.arora@db.com','vikram.singh@thomsonreuters.com','abhishek.agrawal@motilaloswal.com','anand_khatau@ml.com','anup.chandak@futuregenerali.in','arun@bom2.vsnl.net.in','balachandra.shettigar@gmail.com','capstock@vsnl.com','chetan.modi@moodys.com','chirag_gokani@ml.com','easwara.narayanan@futuregenerali.in','gorakhnath.agarwal@futuregenerali.in','haresh.sadani@religare.com','himanshu.jain@asia.bnpparibas.com','kalpesh.thakar@reuters.com','krishnamoorthy.rao@futuregenerali.in','malay.ghatak@citigroup.com','manoj.bajpai@baml.com','navin@milestonecapital.in','ncontractor@perfectrelations.com','nikhil_samant@ml.com','nimisha@ashikagroup.com','pareshashah@vsnl.net','pranav.gokhale@religare.com','prashant.c@intellecap.net','pratikbagaria@rathi.com','rishi.nathany@dalmiasec.com','ritesh@pashminarealty.com','riyer@crisil.com','rvs.sridhar@axisbank.com','sandeep@baycapindia.com','sdahima20@hotmail.com','shekarm@indiafinancebazaar.com','shilpa@fortunapr.in','shrikant.tiwari@thomsonreuters.com','simi.mishra@thomsonreuters.com','subba@lotuspoolcapital.com','sujoy.das@religare.com','sundara.rajan@baml.com','suresh.jakhotiya@religare.com','surinder.negi@religare.com','vetri.subramaniam@religare.com','vikram.singh@thomsonreuters.com','yagya.agarwal@bonanzaonline.com','abhijit.sen@citigroup.com','ajit.menon@dspblackrock.com','amit.chaudhari@citi.com','amit@karmayog-knowledge.com','amitjeffrey@clientassociates.com','anil.jaggia@hdfcbank.com','anil.mirani@kotak.com','ankit.papriwal@db.com','anoop.bhaskar@uti.co.in','anuj.khanna@hdfcbank.com','apurva.sahijwani@citi.com','ashish.mehrotra@citi.com','ashwani.sindhwani@asia.bnpparibas.com','balachandra.shettigar@gmail.com','bhushan.sawant@piramal.com','bkhatri63@gmail.com','brahmaprakash.singh@pramerica.com','chhavi.prabhakar@axisbank.com','chintan.thattey@citi.com','chintan_malhotra@icicipruamc.com','gautam1.khanna@citi.com','kalpesh.thakar@reuters.com','kamal.shanbhag@citigroup.com','kunal.bang@kotak.com','madhu.nair@religare.com','maheshd@ingvysyabank.com','mani.subramanian@barcap.com','minar.jadhav@ingvysyabank.com','mohit2.gang@citi.com','nimish.shah@citi.com','niraj.didwania@ingvysyabank.com','onkar.jutla@ingvysyabank.com','parag.joglekar@birlasunlife.com','prasadjm@ingvysyabank.com','rahuljohri@dbs.com','ravendra@consultant.com','rishi.nathany@dalmiasec.com','robinson.francis@pramerica.com','rohini.malkani@citigroup.com','rohit.singh@jmfinancial.in','s.shanmugavel@axisbank.com','sameerhassan@dbs.com','sanjivbhasin@dbs.com','satishj@hdfcfund.com','sayandev.chakravartti@citi.com','sharecare@ingvysyabank.com','shayne.caldeira@sc.com','shrikant.tiwari@thomsonreuters.com','shwethak@ingvysyabank.com','simi.mishra@thomsonreuters.com','siva.shankar@citigroup.com','skartik@templeton.com','smita1.jain@citi.com','sonalee.panda@ingvysyabank.com','subba@lotuspoolcapital.com','sunil.agarwal@db.co','vaidya@askgroup.in','uttiyadey@hsbc.co.in','vikram.akhaury@pramerica.com','vikram.gopalakrishnan@citi.com','virendra@sngpartners.in','viswanathans@ingvysyabank.com','vivek.m.jain@citi.com'];
         var emailArray=[
{"key": "raj_72bhatia@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"marketing@3i-infotech.com", "value": "Associate Vice President & Group Head  - Global Marketing", "role": "2"},
{"key":"chiefplanner@3rdeyefinancialplanners.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"sanketshrikanth@gmail.com", "value": "Customer Relationship Executive", "role": "4"},
{"key":"duliiptmehta@yahoo.co.in", "value": "Owner", "role": "4"},
{"key":"mohit.chandnani@akgroup.co.in", "value": "Assistant Vice President", "role": "2"},
{"key":"harit.oberoi@akgroup.co.in", "value": "Vice President - Business Development", "role": "2"},
{"key":"info@allstategroup.com", "value": "Senior Manager - Investment Banking Services", "role": "2"},
{"key":"lalit@achigroup.com", "value": "Proprietor", "role": "4"},
{"key":"agfs1996@yahoo.co.in", "value": "Director", "role": "4"},
{"key":"akhilesh_jain99@hotmail.com", "value": "Consulant", "role": "4"},
{"key":"akmumbai@akgroup.co.in", "value": "CEO", "role": "0"},
{"key":"chats02@yahoo.com", "value": "Consultant", "role": "4"},
{"key":"hpshah20@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"aahlada.securities@gmail.com", "value": "Managing Director", "role": "4"},
{"key":"aakashconsultants@gmail.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"kishoresolanki@gmail.com", "value": "Chief Planner", "role": "4"},
{"key":"pankaj@aarayaa.com", "value": "Senior Vice President", "role": "4"},
{"key":"raj@aarayaa.com", "value": "Director", "role": "4"},
{"key":"prasad.achaiah@aarnafin.in", "value": "Director", "role": "4"},
{"key":"jawaharsheth@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"vineet_rai@aavishkaar.org", "value": "Chief Executive Officer", "role": "0"},
{"key":"yasir@abacusinvestment.com", "value": "Director", "role": "4"},
{"key":"mazhar@abacusinvestment.com", "value": "none", "role": "4"},
{"key":"sanjay@abundanze.com", "value": "Founder", "role": "4"},
{"key":"rmalik@acams.org", "value": "Head - India", "role": "4"},
{"key":"nilesh@accesspe.in", "value": "Director", "role": "4"},
{"key":"pawan@accordfinancial.in", "value": "Owner", "role": "4"},
{"key":"partha.iyengar@accretus.in", "value": "Founder", "role": "4"},
{"key":"chawla_manoj@hotmail.com", "value": "Financial Advisor - HNI", "role": "4"},
{"key":"anilagarwal@acefundz.com", "value": "Marketing Manager", "role": "2"},
{"key":"sumeetrkohli@yahoo.com", "value": "Manager - Business Development", "role": "4"},
{"key":"govind@acornwealth.com", "value": "Managing Director", "role": "4"},
{"key":"jtrivedi@act.is", "value": "Partner", "role": "4"},
{"key":"pkhanna@acumen.org", "value": "Business Associate", "role": "4"},
{"key":"agarg@acumen.org", "value": "Portfolio Manager", "role": "4"},
{"key":"santosh.setty@adfactorspr.com", "value": "Account Manager", "role": "4"},
{"key":"aradhana.agrawal@adfactorspr.com", "value": "Senior Account Executive", "role": "4"},
{"key":"tarun.pandey@adityabirla.com", "value": "Vice President Information Technology", "role": "4"},
{"key":"anil.rustogi@adityabirla.com", "value": "Corporate Finance", "role": "4"},
{"key":"shriram.j@adityabirla.com", "value": "Finance", "role": "4"},
{"key":"sushil@adityabirla.com", "value": "President", "role": "4"},
{"key":"ajit.ranade@adityabirla.com", "value": "Chief Economist", "role": "4"},
{"key":"rahul.d.shah@adityabirla.com", "value": "Investment Director", "role": "4"},
{"key":"ashish.sanghi@adityabirla.com", "value": "Vice President", "role": "4"},
{"key":"vishwa_m@hotmail.com", "value": "Regional Sales Manager", "role": "2"},
{"key":"pankaj.razdan@adityabirla.com", "value": "Deputy Chief Executive", "role": "4"},
{"key":"ajay.srinivasan@adityabirla.com", "value": "Chief Executive Officer,  Financial Services", "role": "0"},
{"key":"suvro.basu@adityabirla.com", "value": "Regional Head - East", "role": "4"},
{"key":"ketan.shrotri@adityabirla.com", "value": "Zonal Business Manager - Channel Sales - West", "role": "2"},
{"key":"parag.morey@adityabirla.com", "value": "Zonal Head - West", "role": "4"},
{"key":"vivek.mahajan@adityabirla.com", "value": "Head Research", "role": "4"},
{"key":"joseph.thomas@adityabirla.com", "value": "Head - Investment Research and Advisory", "role": "4"},
{"key":"parameswaran.r@adityabirla.com", "value": "General Manager - Products and Customer Engagement", "role": "3"},
{"key":"gaurav.pandya@adityabirla.com", "value": "Area Manager - Wealth Management", "role": "2"},
{"key":"sudhakar.kr@adityabirla.com", "value": "Managing Director", "role": "4"},
{"key":"poonam.rajkumars@adityabirla.com", "value": "Head - Marketing", "role": "2"},
{"key":"sravan.kumar@adityabirla.com", "value": "Manager", "role": "4"},
{"key":"sunil.shah@adityabirla.com", "value": "none", "role": "4"},
{"key":"tushar.patil@adityabirla.com", "value": "Research Analyst", "role": "3"},
{"key":"gargi.b@adityabirla.com", "value": "Investment Research and Advisory", "role": "4"},
{"key":"ananth.sundur@adityabirla.com", "value": "Manager - Investment Research & Advisory Desk", "role": "4"},
{"key":"mohit.saxena@adityabirla.com", "value": "Vice President - Products and Business Development", "role": "3"},
{"key":"saurabh.shukla@adityabirla.com", "value": "Chief Sales Officer", "role": "2"},
{"key":"girish.venkat@sbi.co.in", "value": "Head - Wealth Management", "role": "0"},
{"key":"dhruv.arora@adityabirla.com", "value": "Chief Manager - Planning & New Initiatives Wealth Management", "role": "4"},
{"key":"mahesh.gopalan@adityabirla.com", "value": "Head - Human Resources", "role": "8"},
{"key":"piyush.shah@adityabirla.com", "value": "Company Secretary & Compliance Officer", "role": "4"},
{"key":"sandeep.bhat@adityabirla.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"mehul.maroo@adityabirla.com", "value": "General Principal", "role": "4"},
{"key":"bharat.banka@adityabirla.com", "value": "Managing Director & CEO", "role": "4"},
{"key":"shobanaraj77@gmail.com", "value": "Managing Partner", "role": "4"},
{"key":"aditya.cap@gmail.com", "value": "none", "role": "4"},
{"key":"sundar@advantage-india.in", "value": "Director", "role": "4"},
{"key":"kishoresrg@gmail.com", "value": "Senior Business Analyst", "role": "3"},
{"key":"nitinicfai@yahoo.com", "value": "Senior Product Lead", "role": "3"},
{"key":"pradip@advisorkhoj.com", "value": "Founder & Chief Executive Officer", "role": "4"},
{"key":"sandeepvasa@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jayshri.gohil@aegonreligare.com", "value": "Senior Manager", "role": "4"},
{"key":"munish4000@gmail.com", "value": "Area Manager", "role": "2"},
{"key":"vinodisnow@yahoo.com", "value": "Regional Training Manager", "role": "4"},
{"key":"nitin@aftek.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"ranjitd@aftek.com", "value": "Managing Director", "role": "4"},
{"key":"ka@agacquisitions.com", "value": "Managing Director", "role": "4"},
{"key":"aceinsurance@gmail.com", "value": "Sales Manager", "role": "2"},
{"key":"bhatia_rekha@yahoo.com", "value": "Manager - Compliance & Taxation", "role": "4"},
{"key":"contact@agarwalinvestments.com", "value": "Proprietor", "role": "4"},
{"key":"gurmeetsingh34026@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"rkpillai@aimil.com", "value": "Vice President", "role": "4"},
{"key":"jyoti_auti@hotmail.com", "value": "Propriter", "role": "4"},
{"key":"prashant@ajmeralaw.com", "value": "Founder", "role": "4"},
{"key":"arun@akassociates.co.in", "value": "Finacial Advisor", "role": "4"},
{"key":"aditi@akgroup.co.in", "value": "Executive Director", "role": "4"},
{"key":"alpesh.busa@akgroup.co.in", "value": "Vice President - Products & Channels", "role": "3"},
{"key":"akmittal@akgroup.co.in", "value": "Managing Director", "role": "4"},
{"key":"arun@bom2.vsnl.net.in", "value": "Director", "role": "4"},
{"key":"bkhatri63@gmail.com", "value": "none", "role": "4"},
{"key":"mona@aimsiso.com", "value": "Director", "role": "4"},
{"key":"chintanjoshi4@gmail.com", "value": "Advisor", "role": "4"},
{"key":"akshayinvestmentz@yahoo.co.in", "value": "Financial Consultant", "role": "4"},
{"key":"sudarshangv.akshaya@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"mcag@alankit.com", "value": "Portfolio Manager", "role": "4"},
{"key":"lashit@alchemycapital.com", "value": "Co-Founder & Non-Executive Director", "role": "4"},
{"key":"mohit.batra@alchemycapital.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"Hemendra.gandhi@alchemyprivatewealth.com", "value": "Financial advisor", "role": "4"},
{"key":"rupesh.nagda@alchemycapital.com", "value": "Senior Vice President & Head - Investment Advisory & Products", "role": "3"},
{"key":"hiren@alchemycapital.com", "value": "Director & Chief Investment Officer", "role": "4"},
{"key":"sameer.tirani@alchemyprivatewealth.com", "value": "Director - Head of Business Development", "role": "4"},
{"key":"naman.dhamija@alchemycapital.com", "value": "Senior Manager - Investments", "role": "4"},
{"key":"naman.dhamija@alchemyprivatewealth.com", "value": "Senior Manager - Investment Advisory & Products", "role": "3"},
{"key":"contact@allegianceadvisors.in", "value": "Director", "role": "4"},
{"key":"masarrat@allegianceadvisors.in", "value": "Director", "role": "4"},
{"key":"ashwinsanand@gmail.com", "value": "Principal Associate", "role": "4"},
{"key":"t_gujral@rediffmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"ar@allstate.in", "value": "Director", "role": "4"},
{"key":"info@allstategroup.com", "value": "Advisor", "role": "4"},
{"key":"rahul@allstate.in", "value": "Vice President- Investments", "role": "4"},
{"key":"mudit@alt-alpha.com", "value": "Director", "role": "4"},
{"key":"naresh@alt-alpha.com", "value": "Director", "role": "4"},
{"key":"rajeev@alt-alpha.com", "value": "Director", "role": "4"},
{"key":"mukesh@alphacapital.in", "value": "Consulting Partner", "role": "4"},
{"key":"akhil@alphacapital.in", "value": "Partner", "role": "4"},
{"key":"devendramhatre@rediffmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"kumargandhi@hotmail.com", "value": "Head", "role": "4"},
{"key":"abhishek@acmia.co.in", "value": "Senior Investment Manager", "role": "4"},
{"key":"richa.karpe@altamountcapital.com", "value": "Founder and Executive Director", "role": "4"},
{"key":"nehagupta20008@gmail.com", "value": "Senior Manager", "role": "4"},
{"key":"supreet.singh@altor.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"aseem.schawla@gmail.com", "value": "Partner", "role": "4"},
{"key":"cyril.shroff@amarchand.com", "value": "Managing Partner", "role": "4"},
{"key":"rukmani.seth@amarchand.com", "value": "Associate", "role": "4"},
{"key":"santosh.janakiram@amarchand.com", "value": "Partner", "role": "4"},
{"key":"ashwath.rau@amarchand.com", "value": "Partner", "role": "4"},
{"key":"rishabh.shroff@amarchand.com", "value": "Senior Associate", "role": "4"},
{"key":"radhika.gaggar@amarchand.com", "value": "Senior Associate", "role": "4"},
{"key":"ashwin.maheshwari@amarchand.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"vaibhavsanghavi@ambitinv.com", "value": "Director  Ambit Investment Advisors", "role": "5"},
{"key":"ganeshiyers@rediffmail.com", "value": "Senior Manager", "role": "4"},
{"key":"sanjaysakhuja@ambitpte.com", "value": "CEO-Corporate Finance", "role": "0"},
{"key":"ashokwadhwa@ambitpte.com", "value": "Group CEO", "role": "4"},
{"key":"RahulGupta@ambitpte.com", "value": "Deputy Group Chief Executive Officer", "role": "4"},
{"key":"saurabhmukherjea@ambitcapital.com", "value": "Head of Equities", "role": "4"},
{"key":"antofebi@gmail.com", "value": "Manager", "role": "4"},
{"key":"shariqmerchant@ambitpte.com", "value": "Corporate Communications", "role": "4"},
{"key":"bhautikambani@ambitinv.com", "value": "none", "role": "4"},
{"key":"sanjaydhoka@ambitfinvest.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"amit@ambitpragma.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"nirmesh@ambitpragma.com", "value": "Partner", "role": "4"},
{"key":"ajayrao@ambitcapital.com", "value": "Associate Vice President", "role": "4"},
{"key":"himanshudamania@ambitcapital.com", "value": "Vice President - Business Process & Operations", "role": "7"},
{"key":"vijaytalreja@ambitpte.com", "value": "Head - Technology", "role": "4"},
{"key":"kirtan0810@gmail.com", "value": "Executive Director", "role": "4"},
{"key":"vyas@aafmindia.co.in", "value": "Head of Marketing", "role": "2"},
{"key":"gupta.nee82@yahoo.com", "value": "Senior Manager-Knowledge Management", "role": "4"},
{"key":"manoj@travelmartindia.com", "value": "Vice Chairman of the US-India Investors", "role": "4"},
{"key":"kapil.n.narang@ampf.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"ameyainvestments@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"prasadgadhe@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"N.Sambasivan@amicorp.com", "value": "Director - Compliance", "role": "4"},
{"key":"N.Palaninaikar@amicorp.com", "value": "Senior Accounting Officer", "role": "4"},
{"key":"P.Kumar@amicorp.com", "value": "Senior Director", "role": "4"},
{"key":"p.prasad@amicorp.com", "value": "Head - Account Management Team", "role": "4"},
{"key":"s.vajpayee@amicorp.com", "value": "Managing Director", "role": "4"},
{"key":"t.aboobaker@amicorp.com", "value": "Director - Estate Planning", "role": "0"},
{"key":"nparmar@ampsys.in", "value": "Business analyst", "role": "3"},
{"key":"mjamwal@ampsys.in", "value": "Managing Director & Chief Executive Officer", "role": "4"},
{"key":"kuldeep.rayasam@gmail.com", "value": "Vice President", "role": "4"},
{"key":"pankajchougule@rathi.com", "value": "Assistant Manager", "role": "4"},
{"key":"dineshgiridhar@gmail.com", "value": "Vice President", "role": "4"},
{"key":"raul.k@rediffmail.com", "value": "Senior Manager", "role": "4"},
{"key":"dineshgiridhar@rathi.com", "value": "Vice President - Private Wealth Management", "role": "4"},
{"key":"christopherjadhav@yahoo.com", "value": "Senior Vice President - Private Banking", "role": "4"},
{"key":"skgerrardfan@gmail.com", "value": "Deputy Manager", "role": "4"},
{"key":"mehrohan@gmail.com", "value": "Relationship Manager - Private Wealth", "role": "4"},
{"key":"pratikbagaria@rathi.com", "value": "Assistant Vice President - Products", "role": "3"},
{"key":"amitrathi@rathi.com", "value": "Managing Director", "role": "4"},
{"key":"roopbhootra@rathi.com", "value": "Director - Operation & Business Development", "role": "7"},
{"key":"sujanhajra@rathi.com", "value": "Chief Economist", "role": "4"},
{"key":"rakeshrawal@rathi.com", "value": "Chief Executive Officer - Private Wealth Management", "role": "0"},
{"key":"amitabhlara@rathi.com", "value": "Director - Private Wealth Management Sales", "role": "2"},
{"key":"laraamitabh@gmail.com", "value": "Director", "role": "4"},
{"key":"neha_kaira@yahoo.com", "value": "Assistant Manager - Business Development", "role": "4"},
{"key":"ed@andhrabank.co.in", "value": "Executive Director", "role": "4"},
{"key":"vijaykumar@andhrabank.co.in", "value": "Chief Financial Officer", "role": "4"},
{"key":"naterianand@yahoo.com", "value": "Senior Branch Manager", "role": "4"},
{"key":"altafattari@yahoo.com", "value": "Auditor", "role": "4"},
{"key":"vaibhav.agrawal@angelbroking.com", "value": "Vice President - Research", "role": "4"},
{"key":"mandhaw@yahoo.com", "value": "Asst. Vice President-Sales and Marketing", "role": "2"},
{"key":"sarang.tembe@edelcap.com", "value": "Executive", "role": "4"},
{"key":"bhat@aniram.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"umamulik@yahoo.com", "value": "Financial Advisor", "role": "4"},
{"key":"ritu@ankurcapital.com", "value": "Director", "role": "4"},
{"key":"rema@ankurcapital.com", "value": "Director", "role": "4"},
{"key":"asheeshkothari@gmail.com", "value": "Head Stock Broking", "role": "4"},
{"key":"anupapverlekar@yahoo.co.in", "value": "Financial Planner", "role": "4"},
{"key":"raja.seetharaman@aperonrealty.com", "value": "Managing Director", "role": "4"},
{"key":"vithoba.prabhu@indiaswealthmart.com", "value": "Chief Advisory Officer", "role": "4"},
{"key":"lalitp@apheta.com", "value": "Senior Partner", "role": "4"},
{"key":"pankajvivek1985@yahoo.com", "value": "Assistant Manager", "role": "4"},
{"key":"anitaps_2005@hotmail.com", "value": "Properietor", "role": "4"},
{"key":"tkravi@aptech.ac.in", "value": "Chief Financial Officer", "role": "4"},
{"key":"nraheja@aqfadvisors.com", "value": "Director", "role": "4"},
{"key":"anita.gandhi@arihantcapital.com", "value": "Whole Time Director & Head - Institutional Business", "role": "4"},
{"key":"uv_re@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"hemantbeniwal@yahoo.com", "value": "Director", "role": "4"},
{"key":"abhinesh.kumar@armfintech.com", "value": "Director - Product Development", "role": "3"},
{"key":"pradeep@armfintech.com", "value": "Associate Vice President - Sales", "role": "2"},
{"key":"gaurav@armresearch.in", "value": "Wealth Manager", "role": "4"},
{"key":"ph.pankaj@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"shilpi_johri@yahoo.com", "value": "Head and Financial Planner", "role": "4"},
{"key":"aniruddha@arthashastra.net", "value": "Director", "role": "4"},
{"key":"rb@aarthashastra.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"kreatwealth@gmail.com", "value": "Director", "role": "4"},
{"key":"info@arthveda.co.in", "value": "CEO", "role": "0"},
{"key":"vikas.gupta@arthveda.co.in", "value": "Head - Research & Product Development", "role": "3"},
{"key":"arunvkuvar@yahoo.com", "value": "Proprieter", "role": "4"},
{"key":"tewary_prem@yahoo.com", "value": "Partner", "role": "4"},
{"key":"nimisha@ashikagroup.com", "value": "Manager", "role": "4"},
{"key":"lalitsomani@yahoo.com", "value": "Partner", "role": "4"},
{"key":"asagar@adb.org", "value": "Head  Financial Sector", "role": "0"},
{"key":"kanak@asksuskan.com", "value": "President", "role": "4"},
{"key":"skoticha@askgroup.in", "value": "Vice Chairman", "role": "4"},
{"key":"djain@askwealthadvisors.com", "value": "Head - Investment Solutions", "role": "4"},
{"key":"bshah@askinvestmentmanagers.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"psethia@askinvestmentmanagers.com", "value": "Assistant Vice President - International Business", "role": "4"},
{"key":"jayanta@askpravi.com", "value": "Managing Partner", "role": "4"},
{"key":"patiltejas@gmail.com", "value": "Vice President", "role": "4"},
{"key":"svaidya@askgroup.in", "value": "Head Marketing - ASK Group", "role": "2"},
{"key":"hbohara@askgroup.in", "value": "CFO & Head - Group Compliance", "role": "1"},
{"key":"gaurav_choudhary@rediffmail.com", "value": "Regional Director & Senior Vice Preseident", "role": "4"},
{"key":"dchawla@askwealthadvisors.com", "value": "Manager - Portfolio Planning & Advisory", "role": "4"},
{"key":"nagarwal@askwealthadvisors.com", "value": "Director - Wealth Advisory & Head - Product", "role": "3"},
{"key":"rsaluja@askwealthadvisors.com", "value": "Chief Executive Officer & Managing Director", "role": "0"},
{"key":"gfernandes@askgroup.in", "value": "Chief Technology Officer", "role": "4"},
{"key":"urnita@yahoo.com", "value": "Senior Manager Financial Planning", "role": "4"},
{"key":"hgadre@askwealthadvisors.com", "value": "AVP-Compliance & Business Analytics", "role": "4"},
{"key":"sddy2312@gmail.com", "value": "Partner", "role": "4"},
{"key":"contact@assetmanagersmail.com", "value": "Director", "role": "4"},
{"key":"query@arcil.co.in", "value": "Managing Director and Chief Executive Officer", "role": "4"},
{"key":"minar.mujumdar@assetvantage.com", "value": "Vice President - Partnerships", "role": "4"},
{"key":"sukriti.mimani@assetvantage.com", "value": "Manager - Marketing and Business Development", "role": "2"},
{"key":"chirag.nanavati@assetvantage.com", "value": "Executive Director & Chief Strategy Officer", "role": "4"},
{"key":"mihas.setalvad@gmail.com", "value": "none", "role": "4"},
{"key":"admin@assetzindia.net", "value": "Director", "role": "4"},
{"key":"sinor@amfiindia.com", "value": "Chief Executive Officer - AMC", "role": "0"},
{"key":"contact@amfiindia.com", "value": "Deputy Chief Executive Officer", "role": "4"},
{"key":"pankajgera2000@gmail.com", "value": "none", "role": "4"},
{"key":"darshan.jain@asteyaglobal.com", "value": "Senior Investment Analyst", "role": "3"},
{"key":"h.dave@hbdconsulting.in", "value": "Director", "role": "4"},
{"key":"sbkulkarni.pune@gmail.com", "value": "Partner", "role": "4"},
{"key":"ashok.kinha@athamus.com", "value": "Executive Director & CEO", "role": "4"},
{"key":"sucheta@aifl.net", "value": "Full Time Director", "role": "4"},
{"key":"atulshah2001@hotmail.com", "value": "Properiter", "role": "4"},
{"key":"asheish.aureus@yahoo.com", "value": "none", "role": "4"},
{"key":"minoo.aureus@yahoo.com", "value": "Director", "role": "4"},
{"key":"vijaymittal88@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"kaushal.aggarwal@avendus.com", "value": "Co - founder and Managing Director", "role": "4"},
{"key":"shveta.singh@avendus.com", "value": "Assistant Vice President - Marketing & Communication", "role": "2"},
{"key":"ankush.kedia@avendus.com", "value": "Associate Vice President", "role": "4"},
{"key":"ritika.khanna@avendus.com", "value": "Manager Human Resources", "role": "8"},
{"key":"pijush.sinha@avendus.com", "value": "Executive Director - Human Resources", "role": "8"},
{"key":"ranu.vohra@avendus.com", "value": "Managing Director & CEO", "role": "4"},
{"key":"nidhi.chawla@avendus.com", "value": "Product Manager", "role": "3"},
{"key":"shatulgupta@gmail.com", "value": "Vice President", "role": "4"},
{"key":"alok.agrawal@avendus.com", "value": "Director", "role": "4"},
{"key":"rahul.sarin@avendus.com", "value": "Vice President", "role": "4"},
{"key":"kartik.kini@avendus.com", "value": "Chief Administrative Officer", "role": "10"},
{"key":"deepak.yachamaneni@avendus.com", "value": "Head - Real Estate & Wealth Management", "role": "4"},
{"key":"george.mitra@avendus.com", "value": "Executive Director", "role": "4"},
{"key":"nikhil.kapadia@avendus.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"pratap@avigocorp.com", "value": "Vice President-Legal & Finance", "role": "4"},
{"key":"achal@avigocorp.com", "value": "Managing Partner", "role": "4"},
{"key":"aghai@avigocorp.com", "value": "Managing Partner", "role": "4"},
{"key":"praveenkilari@gmail.com", "value": "Sales Manager", "role": "2"},
{"key":"naveenlamba@rediffmail.com", "value": "Sales Manager", "role": "2"},
{"key":"amit.malik@avivaindia.com", "value": "Director HR", "role": "8"},
{"key":"jitendra.nayyar@avivaindia.com", "value": "Finance", "role": "7"},
{"key":"sanjeeb.kumar@avivaindia.com", "value": "Appointed Actuary", "role": "6"},
{"key":"jyoti.vaswani@avivaindia.com", "value": "Associate Director - Fund Management", "role": "4"},
{"key":"abhisarsharma30@gmail.com", "value": "Senior HNI Investment Counselor", "role": "4"},
{"key":"snehil.gambhir@avivaindia.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"contact@bccoindia.com", "value": "Director", "role": "4"},
{"key":"hemant.jain@axience.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"deepak@axiomfinancial.in", "value": "Director", "role": "4"},
{"key":"praveen.bhatt@axismf.com", "value": "Head of Operations", "role": "7"},
{"key":"deepak.thakur@rediffmail.com", "value": "Assistant Manager", "role": "4"},
{"key":"ashish.naik@axismf.com", "value": "Analyst-Equity", "role": "5"},
{"key":"viresh.joshi@axismf.com", "value": "Chief Trader-Equity", "role": "4"},
{"key":"pankaj.murarka@axismf.com", "value": "Head - Equities", "role": "4"},
{"key":"sudhanshu.asthana@axismf.com", "value": "Fund Manager", "role": "5"},
{"key":"m.venkataraghavan@axismf.com", "value": "Regional Head", "role": "4"},
{"key":"Mittal.Solanki@axisbank.com", "value": "Manager-Corporate Communication", "role": "4"},
{"key":"manisha.gupta@axisbank.com", "value": "Chief Marketing Officer", "role": "2"},
{"key":"prasad.skrc@axisbank.com", "value": "Head-Information Security,  Audit & Compliance", "role": "7"},
{"key":"uma.ramaseshan@axisbank.com", "value": "Vice President Compliance& MLRO", "role": "4"},
{"key":"saby_bandyo@yahoo.com", "value": "Wealth Manager", "role": "4"},
{"key":"Himadri.Chatterjee@axisbank.com", "value": "Senior Vice President", "role": "4"},
{"key":"sachin.kaul@axisbank.com", "value": "Axis Wealth Channel", "role": "4"},
{"key":"anilnair25@gmail.com", "value": "Assistant Vice President", "role": "4"},
{"key":"chhitiz.mishra@axisbank.com", "value": "Assistant Vice President", "role": "4"},
{"key":"shah.paras@me.com", "value": "Assistant Vice President", "role": "4"},
{"key":"karnani.jiten@gmail.com", "value": "Vice President", "role": "4"},
{"key":"neeraj.rathod@axisbank.com", "value": "Assistant Vice President", "role": "4"},
{"key":"saugata.bhattacharya@axisbank.com", "value": "Economist", "role": "4"},
{"key":"arvind.arya@axisbank.com", "value": "Senior Vice President", "role": "4"},
{"key":"chhavi.prabhakar@axisbank.com", "value": "none", "role": "4"},
{"key":"sachin.borkar@axisbank.com", "value": "Assistant Vice President - Corporate Relationship", "role": "4"},
{"key":"sumanchakravarthy.s@gmail.com", "value": "Wealth Manager", "role": "4"},
{"key":"sunil_kou@yahoo.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"samrat.ghosh@axisbank.com", "value": "Manager", "role": "4"},
{"key":"s.shanmugavel@axisbank.com", "value": "Assistant Vice President", "role": "4"},
{"key":"thukral.arun@rediffmail.com", "value": "Senior Vice President", "role": "4"},
{"key":"vishal.sharda@axisbank.com", "value": "Assistant Vice President - Investment Banking and Advisory", "role": "4"},
{"key":"ria.roy.21@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"rajesh.dahiya@axisbank.com", "value": "President Human Resources", "role": "8"},
{"key":"anand.oke@axisbank.com", "value": "Head Mutual Fund Research", "role": "4"},
{"key":"bipin.saraf@axisbank.com", "value": "Capital Markets", "role": "4"},
{"key":"rvs.sridhar@axisbank.com", "value": "Sr Vice President", "role": "4"},
{"key":"satheesh.krishnamurthy@axisbank.com", "value": "Head Affluent Banking", "role": "0"},
{"key":"rajiv.anand@axisbank.com", "value": "President Retail Banking", "role": "4"},
{"key":"kapil1.gupta@axisbank.com", "value": "Head Strategy - Retail Banking & Wealth", "role": "4"},
{"key":"prajeev@axisbank.com", "value": "Senior Vice President - Technology & Retail Operations", "role": "7"},
{"key":"Sharad.Nair@axisbank.com", "value": "Vice President - Learning & Development", "role": "4"},
{"key":"kaustav.majumdar@axisbank.com", "value": "Senior Vice President", "role": "4"},
{"key":"prashant04@gmail.com", "value": "Wealth manager", "role": "4"},
{"key":"Manjiri.Rele@axisbank.com", "value": "Senior Vice President & Head Learning & Development", "role": "4"},
{"key":"deepak5.agarwal@axisbank.com", "value": "Vice President", "role": "4"},
{"key":"Koushik.Pal@axisbank.com", "value": "Assistant Vice President & Head - Product and Mutual Funds", "role": "3"},
{"key":"Subhajit.Roy@axisbank.com", "value": "Head - Mutual Funds and Alternate Investment Products", "role": "3"},
{"key":"deepanker.gupta@axisbank.com", "value": "Head - Strategy & Business Development - Private Banking", "role": "4"},
{"key":"l.harikumar@axisbank.com", "value": "Head-Axis Wealth Channel", "role": "4"},
{"key":"bahram.n.vakil@azbpartners.com", "value": "Partner", "role": "4"},
{"key":"zia.mody@azbpartners.com", "value": "Partner", "role": "4"},
{"key":"abhijit.joshi@azbpartners.com", "value": "Senior Partner - Succession Planning", "role": "4"},
{"key":"deepaks@azure-capital.com", "value": "Executive Director - Sales & Investment Relations", "role": "2"},
{"key":"hirenm2002@yahoo.com", "value": "Propritor", "role": "4"},
{"key":"munmun.desai@bksec.com", "value": "Sr. Vice President", "role": "4"},
{"key":"pmbagad@yahoo.com", "value": "Propriter", "role": "4"},
{"key":"harsh.vardhan@bain.com", "value": "Partner", "role": "4"},
{"key":"akotecha@baincapital.com", "value": "Executive Vice President", "role": "4"},
{"key":"sbanerjee@baincapital.com", "value": "Principal", "role": "4"},
{"key":"psingh@baincapital.com", "value": "Managing Director", "role": "4"},
{"key":"chhedamitul@gmail.com", "value": "Advisor", "role": "4"},
{"key":"gautamafp@gmail.com", "value": "Manager Business Development", "role": "4"},
{"key":"anjaneyakg@bajajcapital.com", "value": "Vice President - Mutual Fund Group", "role": "4"},
{"key":"dagaabhimanyu@hotmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"vishal.lakhani89@gmail.com", "value": "Assistant Relationship Manager", "role": "4"},
{"key":"kochar.bhavna@gmail.com", "value": "Senior Relatiosnhip Manager", "role": "4"},
{"key":"surajitm@bajajcapital.com", "value": "Executive Vice President", "role": "4"},
{"key":"himanshum@bajajcapital.com", "value": "Assistant Vice President", "role": "4"},
{"key":"gauravc@bajajcapital.com", "value": "Assistant Vice President", "role": "4"},
{"key":"aparnaj@bajajcapital.com", "value": "Associate Vice President - Prive", "role": "4"},
{"key":"parthan@bajajcapital.com", "value": "Assistant Vice President LaPremier", "role": "4"},
{"key":"kkbajaj@bajajcapital.com", "value": "Chairman", "role": "0"},
{"key":"sanjivbajaj@bajajcapital.com", "value": "JT Managing Director", "role": "4"},
{"key":"rbajaj@bajajcapital.com", "value": "Vice Chairman & Managing Director", "role": "4"},
{"key":"uttama@bajajcapital.com", "value": "Head of Wealth Management Business", "role": "4"},
{"key":"vishalsvete@rediffmail.com", "value": "Sr Financial Planning Executive", "role": "4"},
{"key":"preetiparmar.2006@gmail.com", "value": "Asst Manager Financial Planning Group", "role": "4"},
{"key":"artisehgal@bajajcapital.com", "value": "Sr Manager", "role": "4"},
{"key":"shikhab@bajajcapital.com", "value": "Business Head Private Banking Group", "role": "4"},
{"key":"ceo@bajajcapital.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"Sanjiv@bajajfinserv.in", "value": "Managing Director", "role": "4"},
{"key":"sachin.sikka@hotmail.com", "value": "Business Head - Wealth Management", "role": "4"},
{"key":"s.sreenivasan@bajajfinserv.in", "value": "President - Finance", "role": "4"},
{"key":"smitabakhai@yahoo.co.in", "value": "Propreitor", "role": "4"},
{"key":"vijaykalantri@balaji.co.in", "value": "Chairman & Managing Director", "role": "0"},
{"key":"ashshah74@yahoo.co.in", "value": "Franchisee Head", "role": "4"},
{"key":"manoj.bajpai@baml.com", "value": "VP", "role": "4"},
{"key":"skn22bob@rediffmail.com", "value": "Credit Analyst", "role": "5"},
{"key":"dave_anilbhai30@yahoo.co.in", "value": "Encoder", "role": "4"},
{"key":"ed@mahabank.co.in", "value": "Executive Director", "role": "4"},
{"key":"ravishankar@banyantreeadvisors.com", "value": "Portfolio Manager", "role": "4"},
{"key":"adrish.ghosh@barclaysasia.com", "value": "Head - Wealth Advisory", "role": "4"},
{"key":"raja.sanyal@barclaysasia.com", "value": "Head - Marketing", "role": "2"},
{"key":"Arunima.Basu@barclaysasia.com", "value": "Vice President - Compliance", "role": "4"},
{"key":"poonam.mirchandani@barclaysasia.com", "value": "Wealth Advisory", "role": "5"},
{"key":"vishal.khetan@barclaysasia.com", "value": "Wealth Management", "role": "4"},
{"key":"naina.bachchan@barclaysasia.com", "value": "Vice President", "role": "4"},
{"key":"sarada.yechuri@barclayscapital.com", "value": "Manager", "role": "4"},
{"key":"jyotika.gupta@barclaysasia.com", "value": "Assistant Vice President", "role": "4"},
{"key":"Sunit.Jain@barclaysasia.com", "value": "International Private Banking", "role": "4"},
{"key":"ashwini.kapila@barcap.com", "value": "Director", "role": "4"},
{"key":"jaideep.khanna@barcap.com", "value": "Director", "role": "4"},
{"key":"vishal.shah@barclaysasia.com", "value": "Analyst", "role": "5"},
{"key":"rajil.jhaveri@barcap.com", "value": "Vice President - Global Research and Investments", "role": "4"},
{"key":"narayan.shroff@barclaysasia.com", "value": "Director - Wealth and Investment Management", "role": "4"},
{"key":"Shajikumar.devakar@barclaysasia.com", "value": "Director- Serving High Net Worth Client", "role": "4"},
{"key":"vishal.jain@barclaysasia.com", "value": "Managing Director - Wealth and Investment Management", "role": "4"},
{"key":"satya.bansal@barclaysasia.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"mani.subramanian@barcap.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"amitabh.ambastha@barodapioneer.in", "value": "Investor Relations Officer", "role": "4"},
{"key":"ali.abbas@barodapioneer.in", "value": "Marketing", "role": "2"},
{"key":"farhana.mansoor@barodapioneer.in", "value": "Compliance Officer & Company Secretary", "role": "4"},
{"key":"alok.sahoo@barodapioneer.in", "value": "Head-Fixed Income", "role": "4"},
{"key":"hetal.shah@barodapioneer.in", "value": "Fund Manager-Debt", "role": "5"},
{"key":"dipak.acharya@barodapioneer.in", "value": "Fund Manager-Equity", "role": "5"},
{"key":"mehtanikhil@gmail.com", "value": "Managing Director", "role": "4"},
{"key":"manoj.murarka@bksec.com", "value": "none", "role": "4"},
{"key":"Sandeep@baycapindia.com", "value": "Executive Vice President", "role": "4"},
{"key":"ajai.jhala@bbdoindia.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"ashissh.dikshit@bcids.org", "value": "Head- Business Development", "role": "4"},
{"key":"tanuleo_1993@ymail.com", "value": "Management Trainee", "role": "4"},
{"key":"kirti.shah@dhc.co.in", "value": "Partner - Corporate Finance Advisory", "role": "4"},
{"key":"zulfiqarshivji@bdo.in", "value": "none", "role": "4"},
{"key":"mehtajaynam.jm@gmail.com", "value": "Wealth Advisor", "role": "4"},
{"key":"sumitbengani143@gmail.com", "value": "Wealth Advisor", "role": "4"},
{"key":"brij.singh@baercapital.com", "value": "Director", "role": "4"},
{"key":"Bashir.Nabeebokus@cimglobalbusiness.com", "value": "Director", "role": "4"},
{"key":"deepak@bcpadvisors.com", "value": "Founder and Managing Director", "role": "4"},
{"key":"ashish.padiyar@bellwetheradvisory.com", "value": "Director", "role": "4"},
{"key":"benchmarkinvestment@yahoo.co.in", "value": "Partner", "role": "4"},
{"key":"faye.dsouza@timesgroup.com", "value": "Anchor & Assistant Editor", "role": "4"},
{"key":"beyondliferj@gmail.com", "value": "proprietor", "role": "4"},
{"key":"vijay.bhushan@bharatbhushan.com", "value": "Promoter and Non-Executive Director", "role": "4"},
{"key":"karanms@Rediffmail.com", "value": "Associate", "role": "4"},
{"key":"saujanya.shrivastava@bharti-axalife.com", "value": "Chief Marketing Officer", "role": "2"},
{"key":"ulhas.deshpande@bharti-axalife.com", "value": "Chief Human Resource Officer", "role": "4"},
{"key":"rajeev.kumar@bharti-axalife.com", "value": "Chief & Appointed Actuary", "role": "6"},
{"key":"vineet.patni@bharti-axalife.com", "value": "Chief Distribution Officer", "role": "4"},
{"key":"manoj.jaju@bharti-axalife.com", "value": "Assistant Vice President", "role": "4"},
{"key":"sandeep.ghosh@bharti-axalife.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"bhavik@bhapcs.com", "value": "Owner", "role": "4"},
{"key":"ajay.mittal@birlasunlife.com", "value": "chief manager", "role": "4"},
{"key":"pkchand@birlacorp.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"snigdha.nandan@birlasunlife.com", "value": "Chief Manager - PR & Corporate Communications", "role": "2"},
{"key":"mollykapoor@yahoo.com", "value": "Head of Marketing", "role": "2"},
{"key":"Manish.Thacker@birlasunlife.com", "value": "none", "role": "4"},
{"key":"vaibhav.chugh@birlasunlife.com", "value": "Regional Head - Delhi", "role": "4"},
{"key":"ks.rao@birlasunlife.com", "value": "Head - Investor Education & Distribution Development", "role": "4"},
{"key":"parag.joglekar@birlasunlife.com", "value": "Head - Finance and Accounts", "role": "7"},
{"key":"kapil.devnani@birlasunlife.com", "value": "Sr. Product Manager", "role": "6"},
{"key":"atul.penkar@birlasunlife.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"vineet.maloo@birlasunlife.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"naysar.shah@birlasunlife.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"rohit.murarka@birlasunlife.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"prasad.dhonde@birlasunlife.com", "value": "Fund Manager-Debt", "role": "5"},
{"key":"kaustubh.gupta@birlasunlife.com", "value": "Fund Manager-Debt", "role": "5"},
{"key":"maneesh.dangi@birlasunlife.com", "value": "Head - Fixed Income", "role": "4"},
{"key":"ajaygarg@birlasunlife.com", "value": "Senior Fund Manager - Equities", "role": "5"},
{"key":"satyabratamohanty@birlasunlife.com", "value": "Debt Schemes Fund Manager", "role": "5"},
{"key":"anil.shyam@birlasunlife.com", "value": "Institutional Sales", "role": "2"},
{"key":"gautam.deo@birlasunlife.com", "value": "Channel Manager - Banking", "role": "4"},
{"key":"kishore.chamria@birlasunlife.com", "value": "Zonal Head - East", "role": "4"},
{"key":"romit.bhatia@birlasunlife.com", "value": "Channel Manager", "role": "4"},
{"key":"deepak.gupta@birlasunlife.com", "value": "Zonal Head - North", "role": "4"},
{"key":"bhavdeep.bhatt@birlasunlife.com", "value": "Head Business Development", "role": "4"},
{"key":"sandeep.asthana@birlasunlife.com", "value": "Country Head - India", "role": "4"},
{"key":"a.balasubramanian@birlasunlife.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"ashok.suvarna@birlasunlife.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"lalitvermani@birlasunlife.com", "value": "Head ë_ Compliance", "role": "4"},
{"key":"storewalaparag@yahoo.co.in", "value": "none", "role": "4"},
{"key":"mehulkshah@gmail.com", "value": "none", "role": "4"},
{"key":"samirpathak@rediffmail.com", "value": "Zonal Manager", "role": "4"},
{"key":"keertigupta@birlasunlife.com", "value": "Chief Investment Officer", "role": "4"},
{"key":"devendrasinghvi@birlasunlife.com", "value": "Senior Dealer", "role": "4"},
{"key":"sanjaytal@gmail.com", "value": "Manager", "role": "4"},
{"key":"tak_sandeep@yahoo.com", "value": "Branch Manager", "role": "4"},
{"key":"ambergupta78@gmail.com", "value": "Head Legal", "role": "4"},
{"key":"ankurbansal@blacksoil.co.in", "value": "Vice President", "role": "4"},
{"key":"rawat@blackstone.com", "value": "Prinicipal", "role": "4"},
{"key":"amit.jain@blackstone.com", "value": "Principal", "role": "4"},
{"key":"amit.dalmia@blackstone.com", "value": "Executive Director-Private Equity", "role": "4"},
{"key":"parikht@blackstone.com", "value": "Senior Managing Director-Private Equity", "role": "4"},
{"key":"dixit@blackstone.com", "value": "Senior Managing Director-Private Equity", "role": "4"},
{"key":"cyriac@blackstone.com", "value": "Senior Managing Director-Private Equity", "role": "4"},
{"key":"gupta@blackstone.com", "value": "Senior Managing Director - Private Equity", "role": "4"},
{"key":"mohta@blackstone.com", "value": "Principal - Real Estate", "role": "4"},
{"key":"danandikar@bloomberg.net", "value": "Marketing Lead - India", "role": "2"},
{"key":"vchojhar@bloomberg.net", "value": "Sales Buyside Specialist", "role": "2"},
{"key":"viveklaw@gmail.com", "value": "Editor", "role": "4"},
{"key":"karvepandit@yahoo.com", "value": "Partner", "role": "4"},
{"key":"muneesh@bluerivercapital.com", "value": "Managing Director", "role": "4"},
{"key":"shujaat@bluerivercapital.com", "value": "Managing Partner", "role": "4"},
{"key":"puneet.shah@rediffmail.com", "value": "Executive Vice President", "role": "4"},
{"key":"ashokmadvani@bluestarindia.com", "value": "Chairman & Managing Director", "role": "0"},
{"key":"ravi@bluechipcapital.com", "value": "Managing Director", "role": "4"},
{"key":"nipunmehta@blueoceancapital.co.in", "value": "Founder and CEO", "role": "4"},
{"key":"karthik@blumeventures.com", "value": "Managing Partner", "role": "4"},
{"key":"sanjay@blumeventures.com", "value": "Managing Partner", "role": "4"},
{"key":"gautam.bhallais@gmail.com", "value": "Partner", "role": "4"},
{"key":"bmasec@gmail.com", "value": "Director", "role": "4"},
{"key":"shefali.goradia@bmradvisors.com", "value": "Partner", "role": "4"},
{"key":"sarabjeet.singh@bmradvisors.com", "value": "Partner", "role": "4"},
{"key":"ashwani.sindhwani@asia.bnpparibas.com", "value": "Head of Fixed Income Marketing", "role": "2"},
{"key":"ritin.sachdeva@asia.bnpparibas.com", "value": "FX Marketer", "role": "4"},
{"key":"v.lakshmanan@asia.bnpparibas.com", "value": "FX Marketer", "role": "4"},
{"key":"bm.rao@asia.bnpparibas.com", "value": "Head of Trade Center", "role": "4"},
{"key":"indrajeet.maitra@asia.bnpparibas.com", "value": "Head of Cash Management & Liabilities", "role": "4"},
{"key":"n.veeramani@asia.bnpparibas.com", "value": "Head of Cash Management Operations", "role": "7"},
{"key":"sandeepibs@yahoo.co.in", "value": "Regional Credit Head", "role": "4"},
{"key":"manoj.rane@asia.bnpparibas.com", "value": "Head of Fixed Income & Treasury", "role": "4"},
{"key":"joydeep.sen@asia.bnpparibas.com", "value": "Senior Vice President - Fixed Income", "role": "4"},
{"key":"rajat.kohli@asia.bnpparibas.com", "value": "Assistant Vice President", "role": "4"},
{"key":"Shridhar.iyer@bnpparibasmf.in", "value": "Head - Brand & Communications", "role": "4"},
{"key":"swapna.desai@asia.bnpparibas.com", "value": "Associate Director - Human Resources", "role": "8"},
{"key":"jayant.jain@bnpparibasmf.in", "value": "Vice President-Risk Management", "role": "4"},
{"key":"neeraj.saxena@bnpparibasmf.in", "value": "Dealer-Equities", "role": "4"},
{"key":"mithraem.bharucha@bnpparibasmf.in", "value": "Dealer-Fixed Income", "role": "4"},
{"key":"puneet.pal@bnpparibasmf.in", "value": "Head Fixed Income", "role": "4"},
{"key":"anand.shah@bnpparibasmf.in", "value": "Chief Investment Officer", "role": "4"},
{"key":"sunil.subramaniam@sundarammutual.com", "value": "Director Sales and Marketing", "role": "2"},
{"key":"monalisa.shilov@bnpparibasmf.in", "value": "Regional Sales Head - West", "role": "2"},
{"key":"nikhil.johri@bnpparibasmf.in", "value": "Managing Director", "role": "4"},
{"key":"BNPPIS.INDIA@ASIA.BNPPARIBAS.COM", "value": "Principal Officer", "role": "4"},
{"key":"ravinder.singh@asia.bnpparibas.com", "value": "Senior Director", "role": "4"},
{"key":"brijesh.majali@asia.bnpparibas.com", "value": "Senior Vice President - Wealth Management", "role": "4"},
{"key":"alok.bhatia@asia.bnpparibas.com", "value": "Vice President", "role": "4"},
{"key":"gautam.joshi@asia.bnpparibas.com", "value": "Senior Vice President", "role": "4"},
{"key":"chetan.shah@asia.bnpparibas.com", "value": "Director", "role": "4"},
{"key":"vijay.thakkar@asia.bnpparibas.com", "value": "Associate Vice President", "role": "4"},
{"key":"rozbeh.patrawala@asia.bnpparibas.com", "value": "Associate Director - Human Resources", "role": "8"},
{"key":"himanshu.jain@asia.bnpparibas.com", "value": "Director - Wealth Management", "role": "4"},
{"key":"samir.bimal@asia.bnpparibas.com", "value": "Managing Director & Chief Executive Officer", "role": "4"},
{"key":"jacques.michel@asia.bnpparibas.com", "value": "Country Manager & Chief Executive Officer", "role": "4"},
{"key":"sharad.sharma@asia.bnpparibas.com", "value": "Executive Director", "role": "4"},
{"key":"dharmesh.ved@asia.bnpparibas.com", "value": "Head Compliance - WM", "role": "4"},
{"key":"yuvaraja@bohoindia.com", "value": "Director", "role": "4"},
{"key":"abhilash.misra@boiaxa-im.com", "value": "Zone Sales Head-West", "role": "2"},
{"key":"rajesh.chawathe@boiaxa-im.com", "value": "Compliance officer and Company Secretary", "role": "4"},
{"key":"alok.s@boiaxa-im.com", "value": "Chief Investment Officer - Fixed Income", "role": "4"},
{"key":"atul.roongta@boiaxa-im.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"reema.savla@bseindia.com", "value": "Dy. Manager - Corp Comm", "role": "4"},
{"key":"yatin.padia@bseindia.com", "value": "Manager-Marketing Communications", "role": "2"},
{"key":"devika.shah@bseindia.com", "value": "Senior General Manager", "role": "4"},
{"key":"bala.v@bseindia.com", "value": "Chief Buiness Officer", "role": "0"},
{"key":"c.vasudevan@bseindia.com", "value": "General Manager - IFP Secretariat", "role": "4"},
{"key":"ashish.chauhan@bseindia.com", "value": "Managing Director & CEO", "role": "4"},
{"key":"vinod.nair@bseindia.com", "value": "Head-Academics and Product Development", "role": "3"},
{"key":"yagya.agarwal@bonanzaonline.com", "value": "Head - Wealth Management", "role": "4"},
{"key":"pms@bonanzaonline.com", "value": "Portfolio Manager", "role": "4"},
{"key":"vandana@brainpointinv.com", "value": "Director", "role": "4"},
{"key":"jaydeep@brainpointinv.com", "value": "Owner / Director", "role": "4"},
{"key":"parag.shah@bricssecurities.com", "value": "Portfolio Manager", "role": "4"},
{"key":"ghosh.investment@gmail.com", "value": "Partner", "role": "4"},
{"key":"kbhamesh@gmail.com", "value": "IFA", "role": "4"},
{"key":"arnabnayek@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"sachinkarpe20@gmail.com", "value": "Director of Business Development", "role": "4"},
{"key":"sunil.damania@businessindiagroup.com", "value": "Executive Editor - Investment", "role": "4"},
{"key":"merchant@safeinvest.co.in", "value": "Joint Managing Director", "role": "4"},
{"key":"javedpnb@rediffmail.com", "value": "Senior Manager", "role": "4"},
{"key":"jignesh.modi@canararobeco.com", "value": "Head - Compliance & Company Secretary", "role": "4"},
{"key":"s.r.ramaraj@canararobeco.com", "value": "Head-Risk Management", "role": "4"},
{"key":"ravi.gopalakrishnan@canararobeco.com", "value": "Head-Equities", "role": "4"},
{"key":"ajay.awtaney@canararobeco.com", "value": "Head - Corporate Development & International Business Development", "role": "4"},
{"key":"naushinv@gmail.com", "value": "Head National Distribution Alliances", "role": "4"},
{"key":"rajnish.narula@canararobeco.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"george.thomas@capaleph.com", "value": "Founder and Managing Director", "role": "4"},
{"key":"neil.c.ramchandran@capco.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"purvesh_hearts@yahoo.com", "value": "Senior Consultant", "role": "4"},
{"key":"mandaveli@capitalbuilders.co.in", "value": "none", "role": "4"},
{"key":"jitendra.panda@futurecapital.in", "value": "Head of Broking", "role": "4"},
{"key":"shikha.hora@futurecapital.in", "value": "Head - Private Wealth Management", "role": "4"},
{"key":"vanya.srestha@capitalfirst.com", "value": "Product Manager - Wealth Management", "role": "3"},
{"key":"v.vaidyanathan@capfirst.com", "value": "Chairman & Managing Director", "role": "0"},
{"key":"kanwar.vivek@yesbank.com", "value": "Head Wealth Management & Global Indian Banking", "role": "0"},
{"key":"mitrabhanu.panda@capfirst.com", "value": "Deputy Vice President - Information Technology", "role": "4"},
{"key":"allen.noronha@futurecapital.in", "value": "Human Resources Manager", "role": "8"},
{"key":"im_withualways@yahoo.co.in", "value": "Director", "role": "4"},
{"key":"gupta31@gmail.com", "value": "Senior Manager Treasury", "role": "4"},
{"key":"prashant@capitalmarket.com", "value": "Head - sales and development", "role": "2"},
{"key":"dhiraj@caprisinvest.com", "value": "Fund Manager", "role": "5"},
{"key":"vetri@caprisinvest.com", "value": "Fund Manager", "role": "5"},
{"key":"capstock@vsnl.com", "value": "Portfolio Manager", "role": "4"},
{"key":"tc@capvent.com", "value": "Partner", "role": "4"},
{"key":"sathees.kumar@careratings.com", "value": "Executive Vice President Õ¢ëÑëÐ Marketing", "role": "2"},
{"key":"sabinabharwani9@gmail.com", "value": "Accounts Assistant", "role": "7"},
{"key":"Anshuman.Magazine@cbre.com", "value": "Chairman and managing director", "role": "0"},
{"key":"sm2nid@centralbank.co.in", "value": "Chief Manager", "role": "4"},
{"key":"cfbcbi@rediffmail.com", "value": "General Manager", "role": "4"},
{"key":"director.cafral@rbi.org.in", "value": "Director", "role": "4"},
{"key":"uma.shashikant@ciel.co.in", "value": "Managing Director", "role": "4"},
{"key":"vijaysaraf@yahoo.com", "value": "Senior Vice President", "role": "4"},
{"key":"a.joshi@centrum.co.in", "value": "Director", "role": "4"},
{"key":"s.lulla@centrum.co.in", "value": "Chief Financial Officer", "role": "4"},
{"key":"ashok.devarajan@centrum.co.in", "value": "Assistant Vice President & Compliance Officer", "role": "4"},
{"key":"vaishvik.toprani@centrum.co.in", "value": "Director - Private Clients", "role": "4"},
{"key":"d.poncha@centrum.co.in", "value": "Head - Human Resources", "role": "8"},
{"key":"shankar.raman@centrum.co.in", "value": "Senior Vice President & Head - Investment Products and Advisory Services", "role": "3"},
{"key":"k.menon@centrum.co.in", "value": "Executive Director", "role": "4"},
{"key":"arpita.vinay@centrum.co.in", "value": "Senior Vice President- Centrum Private Wealth", "role": "4"},
{"key":"kunj.bansal@centrum.co.in", "value": "Executive director and chief investment officer", "role": "4"},
{"key":"rajnish.bahl@centrum.co.in", "value": "MD & CEO,  Group Retail Financial Services", "role": "4"},
{"key":"sganashyam@centrum.co.in", "value": "Executive Director & Chief Operating Officer - Group Retail Financial Services", "role": "4"},
{"key":"ashish@chadhainvestment.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"jayantvidwans@chaitanyafinancial.com", "value": "Director", "role": "4"},
{"key":"amit.vidwans@gmail.com", "value": "Director", "role": "4"},
{"key":"jayantvidwans@yahoo.co.in", "value": "Chief Financial Planner", "role": "4"},
{"key":"konjuma@gmail.com", "value": "Personal Financial Planner", "role": "4"},
{"key":"deveshshah63@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"clshah1512@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"info@cheraman.com", "value": "Investment Principal", "role": "4"},
{"key":"bhatiachetan@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"doshichetan2@yahoo.co.in", "value": "Propritor", "role": "4"},
{"key":"chetanmsheth@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"chetanvgala@yahoo.co.in", "value": "Propritor", "role": "4"},
{"key":"gopalarathnamss@cholams.murugappa.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"govindarajanb@chola.murugappa.com", "value": "Assistant Vice President", "role": "4"},
{"key":"chona@chona.com", "value": "Portfolio Manager", "role": "4"},
{"key":"mukul@cwa.co.in", "value": "Investment Advisor", "role": "4"},
{"key":"saurabh@cwa.co.in", "value": "Investment Advisor", "role": "4"},
{"key":"Gautam1.khanna@citi.com", "value": "Acquistion Head- South Mumbai", "role": "4"},
{"key":"kamal.shanbhag@citigroup.com", "value": "Project and Structured Trade Finance", "role": "4"},
{"key":"siva.shankar@citigroup.com", "value": "Head - Syndication", "role": "4"},
{"key":"malay.ghatak@citigroup.com", "value": "Head of Credit Sales and Fixed Income Sales Asia Pacific", "role": "2"},
{"key":"manish.bhai@citi.com", "value": "Managing Director  Corporate Sales & Structuring", "role": "0"},
{"key":"manu.s.dua@citi.com", "value": "Vice President  Corporate Sales and Structuring", "role": "4"},
{"key":"neville.fernandes@citigroup.com", "value": "Relationship Manager Business Development Unit Corporate Bank", "role": "4"},
{"key":"sundeep.kakar@citi.com", "value": "Managing Director & Head Investor Sales - India/South Asia markets", "role": "2"},
{"key":"abhijit.sen@citigroup.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"anjana.makkar@citi.com", "value": "Head of Client Service", "role": "4"},
{"key":"amit.srivastava@citi.com", "value": "Senior Vice President", "role": "4"},
{"key":"manoj.bhatia@citi.com", "value": "Vice President", "role": "4"},
{"key":"rishi.godha@citi.com", "value": "Assistant Vice President", "role": "4"},
{"key":"sameer.chandra@citi.com", "value": "Vice President", "role": "4"},
{"key":"ankur.jha@citi.com", "value": "Relationship Manager", "role": "4"},
{"key":"mohit2.gang@citi.com", "value": "Relationship Manager", "role": "4"},
{"key":"amit.chaudhari@citi.com", "value": "Relationship Manager", "role": "4"},
{"key":"kunal.tijoriwala@citi.com", "value": "Relationship Manager", "role": "4"},
{"key":"nirmal.reddy@citi.com", "value": "Manager", "role": "4"},
{"key":"anand.selva@citi.com", "value": "Head of Consumer Banking", "role": "4"},
{"key":"rohini.malkani@citigroup.com", "value": "Economist", "role": "4"},
{"key":"ashish.mehrotra@citi.com", "value": "Country Head - Retail Banking", "role": "4"},
{"key":"nishant4.kumar@citi.com", "value": "Product Team", "role": "3"},
{"key":"tanya.naik@citi.com", "value": "Assistant Product Manager", "role": "3"},
{"key":"megha.mehra@citi.com", "value": "Assistant Product Manager Investments Global Consumer Group", "role": "3"},
{"key":"jaya1.singh@citi.com", "value": "Vice President - Head Investment Products", "role": "3"},
{"key":"sapan.shah@citi.com", "value": "Product Analyst", "role": "3"},
{"key":"vikram.gopalakrishnan@citi.com", "value": "Head of Products", "role": "4"},
{"key":"lokesh.singhal@citi.com", "value": "Business Developer", "role": "2"},
{"key":"parag.bidarkar@citi.com", "value": "Business Developer", "role": "2"},
{"key":"debopama.sen@citi.com", "value": "Managing Director", "role": "4"},
{"key":"ravi.kapoor@citigroup.com", "value": "Head of India Equity Capital Markets", "role": "4"},
{"key":"aditya.narain@citi.com", "value": "Managing Director and India Equity Strategist", "role": "4"},
{"key":"chintan.thattey@citi.com", "value": "Fixed Income Capital Markets - India", "role": "4"},
{"key":"debopama.sen@citigroup.com", "value": "Securities & Fund Services", "role": "5"},
{"key":"vivek.m.jain@citi.com", "value": "none", "role": "4"},
{"key":"anuranjita.kumar@citi.com", "value": "Country Human Resource Officer", "role": "4"},
{"key":"rohitr.sanghavi@gmail.com", "value": "Assistant Vice President", "role": "4"},
{"key":"amit.b.agrawal@citi.com", "value": "Assistant Manager-Investments Product Team", "role": "3"},
{"key":"srikant.ramaswamy@citi.com", "value": "Vice President- Regional Sales Premier Banking", "role": "2"},
{"key":"apurva.sahijwani@citi.com", "value": "National Head - Investments Counselors", "role": "3"},
{"key":"akshay800@hotmail.com", "value": "Senior Vice President", "role": "4"},
{"key":"ruchi.sankhe@citi.com", "value": "Senior Vice President", "role": "4"},
{"key":"smita1.jain@citi.com", "value": "Associate Banker", "role": "4"},
{"key":"chethan_shenoy@yahoo.com", "value": "Relationship Manager", "role": "4"},
{"key":"tooba.modassir@citi.com", "value": "Assistant Vice-President Human Resources", "role": "8"},
{"key":"aashish.k.mishra@citi.com", "value": "Product Management | Securities & Fund Services", "role": "3"},
{"key":"nimish.shah@citi.com", "value": "Director and Head - India Investments", "role": "4"},
{"key":"ashish.daruka@citi.com", "value": "Vice President-Client Sales Management", "role": "2"},
{"key":"sayandev.chakravartti@citi.com", "value": "Investor Sales - South Asia", "role": "2"},
{"key":"sameer.kaul@citi.com", "value": "Head & Global Market Manager", "role": "4"},
{"key":"jenishukla01@gmail.com", "value": "Executive Assistant to Chairman", "role": "4"},
{"key":"chokshiashish@hotmail.com", "value": "Chief Information Officer", "role": "4"},
{"key":"sumant@clearstone.com", "value": "Managing Director", "role": "4"},
{"key":"jackson@clientassociates.com", "value": "Associate", "role": "4"},
{"key":"amitjeffrey@clientassociates.com", "value": "Head of Asset Allocation", "role": "4"},
{"key":"himanshukohli@clientassociates.com", "value": "Co Founder", "role": "4"},
{"key":"rohitsarin@clientassociates.com", "value": "Founder Partner", "role": "4"},
{"key":"cliquerpr@gmail.com", "value": "Director", "role": "4"},
{"key":"rajeev.malik@clsa.com", "value": "Senior Economist", "role": "4"},
{"key":"jk.gupta@cmcltd.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"rajatdhar@cogentadvisory.com", "value": "Managing Director", "role": "4"},
{"key":"dinkar.gupta@cognizant.com", "value": "Principal Architect - Technology", "role": "4"},
{"key":"ravi.kushan@commbank.co.in", "value": "Chief Executive - Indian Operations", "role": "7"},
{"key":"skdutt@compositeinvestments.com", "value": "Director", "role": "4"},
{"key":"camsbby@camsonline.com", "value": "President & Chief Executive Officer", "role": "4"},
{"key":"neha@comsol.in", "value": "Director", "role": "4"},
{"key":"saket@comsol.in", "value": "Working Partner", "role": "4"},
{"key":"ravi@comsol.in", "value": "Advisory", "role": "4"},
{"key":"dinesh@comsol.in", "value": "none", "role": "4"},
{"key":"marut.sengupta@cii.in", "value": "Deputy Director General", "role": "4"},
{"key":"prasad.shetty.9@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"rizwanimanoj@gmail.com", "value": "none", "role": "4"},
{"key":"manoj@continuum.in", "value": "Director", "role": "4"},
{"key":"rattan.chugh@cstone.in", "value": "none", "role": "4"},
{"key":"yvl.pandit@shl.com", "value": "Managing Director,  SHL Talent Management Solutions", "role": "0"},
{"key":"yuraj9@yahoo.co.in", "value": "none", "role": "4"},
{"key":"info@credencefamilyoffice.com", "value": "Founder", "role": "4"},
{"key":"gagan.verma@ca-cib.com", "value": "Manager of Fixed Income and Derivative Sales", "role": "2"},
{"key":"akash.sen@ca-cib.com", "value": "Head of Fixed Income Derivatives", "role": "4"},
{"key":"avinandan.rakshit@ca-cib.com", "value": "Manager", "role": "4"},
{"key":"firuze.shroff@ca-cib.com", "value": "Senior Country Officer", "role": "4"},
{"key":"keyur.vyas@gmail.com", "value": "Quantitative Analyst", "role": "5"},
{"key":"anuradha.ganapathy@credit-suisse.com", "value": "Vice President - Human Resources", "role": "8"},
{"key":"meenakshi.ks@credit-suisse.com", "value": "Director - Human Resources", "role": "8"},
{"key":"pratik.turakhia@credit-suisse.com", "value": "Associate Equity Derivatives", "role": "4"},
{"key":"manasee.nagarkar@credit-suisse.com", "value": "Senior Manager - Investment Products", "role": "3"},
{"key":"kunal.valia@credit-suisse.com", "value": "Vice President - Wealth Management and Investment Products", "role": "3"},
{"key":"biharilal.deora@gmail.com", "value": "Credit Analyst", "role": "3"},
{"key":"mihir.doshi@credit-suisse.com", "value": "Managing Director & Country Head", "role": "4"},
{"key":"aditya.mishra@credit-suisse.com", "value": "Director", "role": "4"},
{"key":"sandeep.pangal@credit-suisse.com", "value": "Managing Director - Investment Banking", "role": "4"},
{"key":"toral.munshi@credit-suisse.com", "value": "Head India Equity Research", "role": "4"},
{"key":"riyer@crisil.com", "value": "Chief Technology Officer", "role": "4"},
{"key":"pkoparkar@crisil.com", "value": "Head of Structured Finance Ratings", "role": "4"},
{"key":"pulkittotla@gmail.com", "value": "none", "role": "4"},
{"key":"jiju.vidyadharan@crisil.com", "value": "Head-Mutual Fund Ratings", "role": "4"},
{"key":"ksitaraman@crisil.com", "value": "Head - Financial Sector Ratings", "role": "4"},
{"key":"trideep.choudhary@crisil.com", "value": "Regional Manager-Business Development", "role": "4"},
{"key":"krutikoka@gmail.com", "value": "Manager - Business Development", "role": "2"},
{"key":"mayur.sontakke@gmail.com", "value": "Associate", "role": "4"},
{"key":"deepak.mittal@crisil.com", "value": "Associate Director", "role": "4"},
{"key":"ria29.jain@gmail.com", "value": "Fund Manager", "role": "5"},
{"key":"chandaliyapritis@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"sandeep.chandaliya@crownsec.com", "value": "Director", "role": "4"},
{"key":"smartyrishabh7@gmail.com", "value": "Analyst", "role": "3"},
{"key":"uma@crvjinvcon.com", "value": "Financial Advisor & Director", "role": "4"},
{"key":"balunaga@gmail.com", "value": "HR", "role": "8"},
{"key":"supriya@cubicquality.com", "value": "Marketing Manager", "role": "2"},
{"key":"sanjay.dutt@ap.cushwake.com", "value": "Executive Managing Director", "role": "0"},
{"key":"jayanta@cxpartners.in", "value": "Partner", "role": "4"},
{"key":"ajay@cxpartners.in", "value": "Partner", "role": "4"},
{"key":"vivek@cxpartners.in", "value": "Partner", "role": "4"},
{"key":"salil@cycloinvestments.com", "value": "Financial Planning Head", "role": "4"},
{"key":"drmrvn@gmail.com", "value": "President", "role": "4"},
{"key":"dashr@deshaw.com", "value": "Financial Research", "role": "3"},
{"key":"takashi.yamaguchi@daiwafunds.in", "value": "Joint Chief Executive Officer", "role": "4"},
{"key":"harsh@daksh-consulting.com", "value": "Director", "role": "4"},
{"key":"malay.kampani@dalmiasec.com", "value": "VP- Institutional Business", "role": "4"},
{"key":"rishi.nathany@dalmiasec.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"bhavesh@danisecurities.com", "value": "Head- Distribution", "role": "4"},
{"key":"trivulce@dapm.ch", "value": "Head India Operations", "role": "7"},
{"key":"vivek.rangachari@darworld.com", "value": "Business Head - Investments", "role": "4"},
{"key":"rudraksh-bhatt@darashaw.com", "value": "Senior Associate Vice President", "role": "4"},
{"key":"baman-mehta@darashaw.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"priyen_shah@ril.com", "value": "Corporate Director", "role": "4"},
{"key":"malay_bhow@hotmail.com", "value": "Head Finance and Accounts", "role": "7"},
{"key":"pankajsinghals@gmail.com", "value": "Sr Analyst", "role": "3"},
{"key":"zeenia.shekhar@gmail.com", "value": "Financial Analyst", "role": "3"},
{"key":"jaswindersingh@dbs.com", "value": "Head Liabilities", "role": "4"},
{"key":"arvind@dbs.com", "value": "ED & Head - Sales", "role": "2"},
{"key":"atulbhuchar@dbs.com", "value": "Head  Cash Management", "role": "5"},
{"key":"pranamwahi@dbs.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sameerhassan@dbs.com", "value": "Assistant Vice President - Human Resources", "role": "8"},
{"key":"manish.jsolanki@yahoo.com", "value": "RM", "role": "4"},
{"key":"tulashidas@dbs.com", "value": "Senior Manager-Technology", "role": "4"},
{"key":"rahuljohri@dbs.com", "value": "Head of Consumer Banking", "role": "0"},
{"key":"chetanpatil@dbs.com", "value": "Head-Investment Products and NR Consumer Banking", "role": "3"},
{"key":"sanjivbhasin@dbs.com", "value": "General Manager & Chief Executive Officer", "role": "4"},
{"key":"kpradeep@dcbbank.com", "value": "Assistant Vice President Investment Services", "role": "4"},
{"key":"rakesh.sharma@dcbbank.com", "value": "Product Sales Manager - Investments Services & Wealth Management", "role": "3"},
{"key":"nasser@dcbbank.com", "value": "Chairman", "role": "0"},
{"key":"bhattdivyesh1@gmail.com", "value": "Investment Advisory", "role": "4"},
{"key":"muditjain@dcwltd.com", "value": "Executive Director", "role": "4"},
{"key":"deelip_shirude@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"cfp.deeplaxmi@gmail.com", "value": "none", "role": "4"},
{"key":"deeptilife@gmail.com", "value": "none", "role": "4"},
{"key":"kvkarthik@deloitte.com", "value": "Senior Director & Lead,  Financial services (Banking sector)", "role": "0"},
{"key":"amita@denabank.co.in", "value": "Regional Head", "role": "4"},
{"key":"cmd@denabank.co.in", "value": "Chaiman and Managing Director", "role": "0"},
{"key":"tshah@deonticgroup.com", "value": "Managing Partner", "role": "4"},
{"key":"japjit.bedi@db.com", "value": "Head - Deposits and Wealth Management", "role": "4"},
{"key":"gurjeet.sohi@db.com", "value": "Director - Private Wealth Management", "role": "4"},
{"key":"sanjay.sharma@db.com", "value": "Director - Private Wealth Management", "role": "4"},
{"key":"rishi.parasramka@db.com", "value": "Vice President", "role": "4"},
{"key":"ashish.saxena@db.com", "value": "Vice President - Product and Investment Advisory Team", "role": "3"},
{"key":"atinkumar.saha@db.com", "value": "Managing Director - Private Wealth Management", "role": "4"},
{"key":"vinay.bajpai@db.com", "value": "Managing Director & Head - Global Investment Solutions", "role": "4"},
{"key":"ashish.joseph@db.com", "value": "Assistant Vice President-Marketing", "role": "2"},
{"key":"nehal.shah@db.com", "value": "Compliance Officer", "role": "4"},
{"key":"rakesh.suri@db.com", "value": "Fund Manager-Fixed Income", "role": "5"},
{"key":"nitish.gupta@db.com", "value": "Fund Manager-Fixed Income", "role": "5"},
{"key":"akash.singhania@db.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"kumaresh.ramakrishnan@db.com", "value": "Head - Fixed Income", "role": "4"},
{"key":"siddharth.singh@db.com", "value": "Assitant Vice President - Products", "role": "3"},
{"key":"tushar.khese@db.com", "value": "Vice President Sales", "role": "2"},
{"key":"chandrashekar.jain@db.com", "value": "Head-Institutional Sales", "role": "2"},
{"key":"deepak.jaggi@db.com", "value": "Head - Retail Sales", "role": "2"},
{"key":"suresh.soni@db.com", "value": "Managing Director & Chief Executive Officer", "role": "4"},
{"key":"gunit.chadha@db.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sunil.agarwal@db.com", "value": "Head of Institutional Client Group", "role": "4"},
{"key":"shailendra.agarwal@db.com", "value": "Vice President - Global Markets", "role": "4"},
{"key":"manan.chopra@db.com", "value": "Sales", "role": "2"},
{"key":"ankit.papriwal@db.com", "value": "Assistant Vice President - Institutional Client Group", "role": "4"},
{"key":"anand.rengarajan@db.com", "value": "Head of Direct securities services-India", "role": "4"},
{"key":"linus.chettiar@db.com", "value": "Head - Group Communications", "role": "4"},
{"key":"sanjay.agarwal@db.com", "value": "Head of Corporate Investment Banking", "role": "4"},
{"key":"shrinath.bolloju@db.com", "value": "Managing Director and Group Chief Operating Officer", "role": "4"},
{"key":"sanjay.rajawat@gmail.com", "value": "Director", "role": "4"},
{"key":"abhishek.misra@db.com", "value": "Vice President", "role": "4"},
{"key":"krunal.vyas@db.com", "value": "Vice President - Private Wealth Management", "role": "4"},
{"key":"anand.beria@db.com", "value": "Assistant Vice President - Global Investment Solutions", "role": "4"},
{"key":"kv.rao@db.com", "value": "Director", "role": "4"},
{"key":"manoj-s.naik@db.com", "value": "none", "role": "4"},
{"key":"gaurav.mital@db.com", "value": "Business Manager", "role": "4"},
{"key":"kaushik.das@db.com", "value": "Economist", "role": "4"},
{"key":"vishal.bajpai@db.com", "value": "Head - Investment Products", "role": "3"},
{"key":"vikas-m.arora@db.com", "value": "Business Head - Investments", "role": "0"},
{"key":"alok-k.agarwal@db.com", "value": "Portfolio Manager", "role": "4"},
{"key":"prashant-p.joshi@db.com", "value": "Managing Director - Private and Business Clients", "role": "4"},
{"key":"pritash.mathur@db.com", "value": "Chief Operating Officer - Asset and Wealth Management", "role": "4"},
{"key":"shachi.kaul@db.com", "value": "Head - Learning & Development South Asia", "role": "4"},
{"key":"rahul666@rediffmail.com", "value": "Vice President - Business Head - Private  Personal & NRI Banking", "role": "0"},
{"key":"gireesh.mathapati@devmantra.com", "value": "VP- Wealth Advisory", "role": "4"},
{"key":"switeshp@yahoo.com", "value": "Branch Manager", "role": "4"},
{"key":"dgdinvestment@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"shailesh.haribhakti@dhc.co.in", "value": "Chairman", "role": "0"},
{"key":"arvind12.gupta@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"mandakini@dhaanyainvestments.com", "value": "Managing Director", "role": "4"},
{"key":"sheetalsm@rediffmail.com", "value": "Consultant", "role": "4"},
{"key":"urmila.vichare@dhanvriddhi.com", "value": "Financial Planner", "role": "4"},
{"key":"vivek.thatte@dhanvriddhi.com", "value": "Director", "role": "4"},
{"key":"vivek_khemka@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"nnkamani@dhruvmehta.in", "value": "Vice President-Marketing", "role": "2"},
{"key":"dhruv.mehta@dhruvmehta.in", "value": "Director", "role": "4"},
{"key":"mail@dlco.in", "value": "Managing Partner", "role": "4"},
{"key":"lovelydhuria@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"shirishkale956@gmail.com", "value": "Marketing", "role": "4"},
{"key":"ankygarg@yahoo.co.in", "value": "Director", "role": "4"},
{"key":"bhattdivyesh1@rediffmail.com", "value": "Sole Proprietor", "role": "4"},
{"key":"bhardwajrajeev@yahoo.com", "value": "Senior Sales Manager", "role": "2"},
{"key":"rb.neha@yahoo.com", "value": "Finance and relationship manager", "role": "4"},
{"key":"hdshah@dolatcapital.com", "value": "Director", "role": "4"},
{"key":"amit@dolatcapital.com", "value": "Director - Research", "role": "4"},
{"key":"arkathuria@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"arvind@caarassociates.com", "value": "Chief Planner", "role": "4"},
{"key":"jigar.desai@dspblackrock.com", "value": "Business Manager - Key Relationship", "role": "4"},
{"key":"arun.rajendran@dspblackrock.com", "value": "Manager - Marketing", "role": "2"},
{"key":"aditi.kothari@dspblackrock.com", "value": "Head - Marketing & Retail Sales Relationships and Strategy", "role": "2"},
{"key":"pritesh.majmudar@dspblackrock.com", "value": "Head of Legal & Compliance", "role": "4"},
{"key":"ramamoorthy.rajagopal@dspblackrock.com", "value": "Chief Administrative Officer", "role": "10"},
{"key":"prashant.besekar@dspblackrock.com", "value": "Assistant Vice President-Product Management Group", "role": "6"},
{"key":"suryanarayanan.m@dspblackrock.com", "value": "Assistant Vice President - Product Management Group", "role": "6"},
{"key":"vivek.ved@dspblackrock.com", "value": "Fund Manager", "role": "5"},
{"key":"vinit.sambre@dspblackrock.com", "value": "Fund Manager", "role": "5"},
{"key":"rohit.singhania@dspblackrock.com", "value": "Fund Manager", "role": "5"},
{"key":"laukik.bagwe@dspblackrock.com", "value": "Fund Manager", "role": "5"},
{"key":"mehul.jani@dspblackrock.com", "value": "Fund Manager", "role": "5"},
{"key":"apoorva.shah@dspblackrock.com", "value": "Executive Vice President & Fund Manager", "role": "5"},
{"key":"jay.kothari@dspblackrock.com", "value": "Vice President and Business Manager", "role": "4"},
{"key":"dhawal.dalal@dspblackrock.com", "value": "Executive Vice President & Head - Fixed Income", "role": "4"},
{"key":"Anup.Maheshwari@dspblackrock.com", "value": "Executive Vice President and Head of Equities", "role": "4"},
{"key":"rinaldo.rodrigues@dspblackrock.com", "value": "Vice President- Sales", "role": "2"},
{"key":"maxiejose@affluenz.in", "value": "none", "role": "4"},
{"key":"anupam.saxena@dspblackrock.com", "value": "none", "role": "4"},
{"key":"bhupendra.naik@dspblackrock.com", "value": "Vice President and Business Head", "role": "4"},
{"key":"sudip.mandal@dspblackrock.com", "value": "Assistant vice president-marketing", "role": "2"},
{"key":"reshma.chatterjee@dspblackrock.com", "value": "Assistant Manager", "role": "4"},
{"key":"renjith.rajan@dspblackrock.com", "value": "Manager - Sales", "role": "2"},
{"key":"srividya.easwaran@dspblackrock.com", "value": "Assistant Vice President - Sales", "role": "2"},
{"key":"neeraj.mittal@dspblackrock.com", "value": "Senior Vice President & Business Head,  Institutional Sales", "role": "2"},
{"key":"Abhik.Sanyal@dspblackrock.com", "value": "Assistant Vice President - Sales", "role": "2"},
{"key":"anunaya.kumar@dspblackrock.com", "value": "Vice President & Business Head", "role": "2"},
{"key":"ajit.menon@dspblackrock.com", "value": "Executive Vice President & Head of Sales", "role": "2"},
{"key":"pankaj.sharma@dspblackrock.com", "value": "Executive Vice President & Head Business Development & Risk Management", "role": "4"},
{"key":"ashley4806@rediffmail.com", "value": "Manager", "role": "4"},
{"key":"Naganath.Sundaresan@dspblackrock.com", "value": "President and Chief Investment Officer", "role": "4"},
{"key":"anuradha_shah@ml.com", "value": "Director - Trust Services", "role": "4"},
{"key":"anand_khatau@ml.com", "value": "none", "role": "4"},
{"key":"vikram_agarwal@ml.com", "value": "Vice President", "role": "4"},
{"key":"r_vaidya@ml.com", "value": "Assistant Vice President", "role": "4"},
{"key":"kulkarni_unmesh@yahoo.co.in", "value": "Director", "role": "9"},
{"key":"d.rao@ml.com", "value": "Director (Investments)", "role": "4"},
{"key":"ashish_gumashta@ml.com", "value": "Managing Director - Investments", "role": "4"},
{"key":"dia_sen@ml.com", "value": "Director-Investments", "role": "4"},
{"key":"rishab_parekh@ml.com", "value": "Vice President - Technology", "role": "4"},
{"key":"amankapoor20@yahoo.co.in", "value": "Account Assistant", "role": "4"},
{"key":"Chirag.Mehta@edelweissfin.com", "value": "Product Manager", "role": "3"},
{"key":"george.jose@edelcap.com", "value": "Senior Manager - Investor and Distributor Services", "role": "4"},
{"key":"anurag.madan@edelcap.com", "value": "Director", "role": "4"},
{"key":"seemant.shukla@edelweissfin.com", "value": "Head - Sales and Business Development", "role": "2"},
{"key":"vikaas.sachdeva@edelcap.com", "value": "Chief Executive Officer - Asset Management Company", "role": "0"},
{"key":"Vijayalaxmi.Khatri@edelcap.com", "value": "Head of Compliance", "role": "4"},
{"key":"kamal_hs@yahoo.co.in", "value": "Financial Planner", "role": "4"},
{"key":"rujan.panjwani@edelweissfin.com", "value": "Executive Director", "role": "4"},
{"key":"natasha.patel@edelcap.com", "value": "Manager - Human Resources", "role": "8"},
{"key":"rashmi.nagori@edelcap.com", "value": "Senior Vice President - Human Resources", "role": "8"},
{"key":"dp.jhawar@edelcap.com", "value": "Financial Controller", "role": "4"},
{"key":"vidya.shah@edelcap.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"pradeepakochar@gmail.com", "value": "Head of Client Service", "role": "4"},
{"key":"venkat.ramaswamy@edelcap.com", "value": "Executive Director & Co-Head", "role": "0"},
{"key":"rashesh.shah@edelcap.com", "value": "Chairman & Chief Executive Officer", "role": "0"},
{"key":"himanshu.kaji@edelcap.com", "value": "Executive Director & Group COO", "role": "4"},
{"key":"puja.dsouza@edelcap.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"vibhor.gujarati@edelweissfin.com", "value": "Head - Marketing", "role": "2"},
{"key":"sudeepaggarwal@gmail.com", "value": "Associate", "role": "4"},
{"key":"nirmal.rewaria@edelcap.com", "value": "Senior Vice President", "role": "4"},
{"key":"vikashvikku@gmail.com", "value": "Manager", "role": "4"},
{"key":"sharma.vivek@edelcap.com", "value": "Head - Structured Products & Investment Advisory", "role": "6"},
{"key":"anshu.kapoor@edelweissfin.com", "value": "Head - Private Wealth Management", "role": "4"},
{"key":"rkapoormail@gmail.com", "value": "Partner", "role": "4"},
{"key":"vikas.khemani@edelcap.com", "value": "Head of Institutional Equities", "role": "4"},
{"key":"yogendra@edgeonline.in", "value": "none", "role": "4"},
{"key":"lalit@edgeonline.in", "value": "none", "role": "4"},
{"key":"lakshu3@gmail.com", "value": "AVP - Private Banking", "role": "4"},
{"key":"harendra.kumar@elaracapital.com", "value": "Managing Director", "role": "4"},
{"key":"kundankumarroy@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sanjayv@emiratesbank.com", "value": "Head of Capital Markets", "role": "4"},
{"key":"anilsenani@yahoo.com", "value": "Director", "role": "4"},
{"key":"puneetjaain@gmail.com", "value": "Regional Insurance Manager", "role": "4"},
{"key":"mohinder.singh@enamamc.com", "value": "Vice President - Marketing", "role": "2"},
{"key":"rashmikant.shah@enamamc.com", "value": "Head - Compliance", "role": "4"},
{"key":"rajesh.khona@enamamc.com", "value": "Director & Head - Operations and Finance", "role": "7"},
{"key":"milan.dharamshi@enamamc.com", "value": "Head - Technology", "role": "4"},
{"key":"mohinder167@yahoo.co.in", "value": "Vice President", "role": "4"},
{"key":"rajeev.thakkar@enamamc.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"nemish@enam.com", "value": "Director", "role": "4"},
{"key":"akash@enam.com", "value": "Director", "role": "4"},
{"key":"aditya.singhania@enam.com", "value": "Analyst", "role": "3"},
{"key":"vallabh@enam.com", "value": "Co Founder and Chairman", "role": "4"},
{"key":"bhupendraketkar@gmail.com", "value": "Director", "role": "4"},
{"key":"rajmohan@entrust.co.in", "value": "Director/ Partner", "role": "4"},
{"key":"nilesh.shah@envisioncapital.in", "value": "Managing Director and Chief Executive Officer", "role": "4"},
{"key":"mita@equationsindia.com", "value": "none", "role": "4"},
{"key":"pdrungta@gmail.com", "value": "Secretary  Eastern India Regional Council ICAI", "role": "0"},
{"key":"gigy.mathew@in.ey.com", "value": "Associate Vice President", "role": "4"},
{"key":"sonu.iyer@in.ey.com", "value": "National Partner - Human Capital Services", "role": "0"},
{"key":"ajay.agashe@gmail.com", "value": "Associate Director", "role": "4"},
{"key":"shruti.lohia@in.ey.com", "value": "Senior Consultant", "role": "4"},
{"key":"pranav.sayta@in.ey.com", "value": "Partner - Tax & Regulatory Services", "role": "4"},
{"key":"anuj.jain@escortsmutual.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"prabhash@escortsmutual.com", "value": "National Sales Head", "role": "2"},
{"key":"ashok.aggarwal@escortsmutual.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"md@espconsultant.com", "value": "Managing Director", "role": "4"},
{"key":"ashwin11shah@yahoo.co.in", "value": "Financial Consultant", "role": "4"},
{"key":"anirudh.kataruka@esteeadvisors.com", "value": "Manager-Business Development", "role": "4"},
{"key":"nisha.poddar@timesgroup.com", "value": "Special Correspondent", "role": "4"},
{"key":"mehran@ethix.net.in", "value": "Proprietor", "role": "4"},
{"key":"gajendra.kothari@eticawealth.com", "value": "Managing Director", "role": "4"},
{"key":"virendra.kothari@eticawealth.com", "value": "Managing Director", "role": "4"},
{"key":"satish.pandey@eurasiaadvisory.com", "value": "Director", "role": "4"},
{"key":"ashokt@eurekasecurities.com", "value": "Director", "role": "4"},
{"key":"balachandra.shettigar@gmail.com", "value": "Head - Accounts", "role": "7"},
{"key":"evergreennikhil@gmail.com", "value": "none", "role": "4"},
{"key":"alavakare@everstonecapital.com", "value": "Chief Financial Officer", "role": "1"},
{"key":"jsingh@everstonecapital.com", "value": "Managing Director", "role": "0"},
{"key":"djhaveri@everstonecapital.com", "value": "CEO & Partner", "role": "0"},
{"key":"meetpalchawla@yahoo.com", "value": "Senior Financial Planner", "role": "4"},
{"key":"manisha.amitdani@gmail.com", "value": "Wealth Advisor", "role": "4"},
{"key":"rachna@executivepartners.co.in", "value": "Director - Wealth Management", "role": "4"},
{"key":"sirish.sadanand@gmail.com", "value": "Associate", "role": "4"},
{"key":"farrlapp@gmail.com", "value": "none", "role": "4"},
{"key":"fasttrack@neerajbahal.com", "value": "Founder", "role": "4"},
{"key":"mohann@federalbank.co.in", "value": "Manager", "role": "4"},
{"key":"akshaybalasubramani@federalbank.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"vsrocks21@gmail.com", "value": "Manager Financial planning and research", "role": "4"},
{"key":"mahasanali@gmail.com", "value": "Founder", "role": "4"},
{"key":"sandeep.kothari@fidelity.com", "value": "Head of Equities", "role": "4"},
{"key":"varadarajan@fiducial.in", "value": "Partner", "role": "4"},
{"key":"ali.shervani@figlo.com", "value": "Sales Head", "role": "2"},
{"key":"mihirvishrani@gmail.com", "value": "Relationship Sales Manager", "role": "2"},
{"key":"rchheda@me.com", "value": "Proprietor", "role": "4"},
{"key":"FinanciaEnhanca@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"amitav@fiuindia.gov.in", "value": "Additional Director", "role": "4"},
{"key":"thefinancialmall@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"mohitagarwalcfp@gmail.com", "value": "Partner", "role": "4"},
{"key":"hemantbeniwal@gmail.com", "value": "none", "role": "4"},
{"key":"qtsrinivas@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"kavita@finanzindia.com", "value": "Financial Planner", "role": "4"},
{"key":"arnavpandya@hotmail.com", "value": "Chief Coach", "role": "4"},
{"key":"patelyasin05@gmail.com", "value": "Product Manager", "role": "3"},
{"key":"karanrt@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"peeyushc@gmail.com", "value": "Director", "role": "4"},
{"key":"daksheshsampat@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"ashish@bdshah.com", "value": "Financial Advisor", "role": "4"},
{"key":"amit@fin-stream.com", "value": "Director", "role": "4"},
{"key":"eikabanerjee@gmail.com", "value": "Director", "role": "4"},
{"key":"shirish@fintelekt.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"finvest_advisory@yahoo.co.in", "value": "none", "role": "4"},
{"key":"bijubehnan@yahoo.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"kpotdar@curologic.com", "value": "Founder", "role": "4"},
{"key":"ramesh.patibanda@fiserv.com", "value": "Director - Product Management", "role": "3"},
{"key":"sanjay.sarkar@fiserv.com", "value": "Vice President", "role": "4"},
{"key":"debaprasad.mukherjee@fiserv.com", "value": "National Sales Manager", "role": "2"},
{"key":"anulekha.verma@yahoo.com", "value": "Director", "role": "4"},
{"key":"atul.joshi@fitchratings.com", "value": "Managing Director and Cheif Executive Officer", "role": "0"},
{"key":"radhika.gupta@forefrontcap.com", "value": "Founding Principal and Head of Business Development", "role": "0"},
{"key":"nalin.moniz@forefrontcap.com", "value": "Director / Partner", "role": "0"},
{"key":"vivekpathak001@yahoo.com", "value": "Financial Consultant", "role": "4"},
{"key":"tunegdirb@gmail.com", "value": "Managing Partner", "role": "0"},
{"key":"shilpa@fortunapr.in", "value": "Director", "role": "4"},
{"key":"nitu_rajesh@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"padmanaban@fortuneplanners.com", "value": "Director", "role": "4"},
{"key":"dhirendra@fpsbindia.org", "value": "Chairman", "role": "0"},
{"key":"rcjoshi2803@gmail.com", "value": "Senior Manager", "role": "4"},
{"key":"cheenu83@gmail.com", "value": "Manager - Knowledge Management", "role": "4"},
{"key":"pushkar@fpsbindia.org", "value": "Vice President- Knowledge Management", "role": "4"},
{"key":"prashant@fpsbindia.org", "value": "Assistant Editor - Financial Planning Journal", "role": "4"},
{"key":"vyasrainagpal@gmail.com", "value": "Manager", "role": "4"},
{"key":"ranjeet@fpsbindia.org", "value": "Chief Executive Officer", "role": "0"},
{"key":"vchiran@templeton.com", "value": "Assistants to Dr.J.Mark Mobius", "role": "4"},
{"key":"aradhak@templeton.com", "value": "Head of Research", "role": "4"},
{"key":"aprabhu@templeton.com", "value": "Portfolio Manager & Senior Research Analyst", "role": "5"},
{"key":"nprakas@templeton.com", "value": "Trader/Dealer", "role": "4"},
{"key":"sdesai@templeton.com", "value": "Fund Manager", "role": "5"},
{"key":"abhatna@templeton.com", "value": "Head of Retail", "role": "2"},
{"key":"juzert@templeton.com", "value": "VP & Head-Marketing & Communication", "role": "2"},
{"key":"vbalaji@templeton.com", "value": "Assistant Vice President - Marketing and Communication", "role": "2"},
{"key":"sanand1@templeton.com", "value": "International Campaign Marketing", "role": "2"},
{"key":"skartik@templeton.com", "value": "Investor Service Officer", "role": "4"},
{"key":"sshetty@templeton.com", "value": "Head - Compliance", "role": "4"},
{"key":"jahuja@templeton.com", "value": "Senior Manager", "role": "4"},
{"key":"lpayame@templeton.com", "value": "Senior Manager", "role": "4"},
{"key":"rjain@templeton.com", "value": "Fund Manager", "role": "5"},
{"key":"mmobius@templeton.com", "value": "Fund Manager", "role": "5"},
{"key":"JPrakash@Templeton.com", "value": "none", "role": "4"},
{"key":"SBhatta@Templeton.com", "value": "Assistant Vice President - Retail Advisory Services", "role": "4"},
{"key":"csehgal@templeton.com", "value": "Chief Investment Officer - Emerging Market Group and Portfolio Manager", "role": "5"},
{"key":"pjhaveri@templeton.com", "value": "Senior Vice President - Portfolio Manager", "role": "5"},
{"key":"skamath@templeton.com", "value": "Chief Investment Officer - Fixed Income", "role": "5"},
{"key":"rajesh_sehgal@hotmail.com", "value": "Head - Private Equity", "role": "1"},
{"key":"pdastoo@templeton.com", "value": "Vice President & Regional Head-West & East", "role": "4"},
{"key":"pdastoor@templeton.com", "value": "VP & Regional Head - West & East", "role": "4"},
{"key":"gparija@templeton.com", "value": "National Head of Sales", "role": "2"},
{"key":"hbindal@templeton.com", "value": "President", "role": "4"},
{"key":"vkudva@templeton.com", "value": "Managing Director,  India & CEEMEA", "role": "0"},
{"key":"srajah@templeton.com", "value": "Managing Director & CIO", "role": "0"},
{"key":"prajase@templeton.com", "value": "Head - Corporate Communications India & CEEMEA", "role": "4"},
{"key":"sumeet.vaid@ffreedom.in", "value": "Founder & Chief Executive Officer", "role": "0"},
{"key":"secretary@fsltechnologies.com", "value": "Director", "role": "4"},
{"key":"amrit.singhdeo@fticonsulting.com", "value": "Senior Vice President", "role": "4"},
{"key":"krishna@fulcrumventureindia.com", "value": "Founder Partner", "role": "4"},
{"key":"karthikeyan@fundchoice.in", "value": "Director", "role": "4"},
{"key":"nagarajan@fundsindiaadvisor.com", "value": "Head - Advisor Platform", "role": "4"},
{"key":"anup.chandak@futuregenerali.in", "value": "Chief Financial Officer", "role": "4"},
{"key":"nirakar.pradhan@futuregenerali.in", "value": "Chief Investment Officer", "role": "5"},
{"key":"krishnamoorthy.rao@futuregenerali.in", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"gorakhnath.agarwal@futuregenerali.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"easwara.narayanan@futuregenerali.in", "value": "Chief Operating Officer", "role": "4"},
{"key":"nmparekh99@gmail.com", "value": "Director", "role": "4"},
{"key":"bihani.yogesh@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"p.gurusankar@futurevista.co.in", "value": "Director", "role": "4"},
{"key":"ravindra.kulkarni@futurevista.co.in", "value": "Director", "role": "4"},
{"key":"ronak.hindocha@futurewise.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"cagvrao@gmail.com", "value": "Sole Proprietor", "role": "4"},
{"key":"rajesh@gmkco.com", "value": "Senior Partner", "role": "4"},
{"key":"vipul@gadaharia.com", "value": "Director", "role": "4"},
{"key":"gaining@gmail.com", "value": "Director", "role": "4"},
{"key":"avinash.luthria@gajacapital.com", "value": "Analyst", "role": "5"},
{"key":"gopal.jain@gajacapital.com", "value": "Partner", "role": "4"},
{"key":"galaxykhan@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"julket2001@yahoo.co.in", "value": "Partner", "role": "4"},
{"key":"utkarsh5@usa.net", "value": "Proprietor", "role": "4"},
{"key":"raja.kaushal@gatere.com", "value": "Managing director", "role": "0"},
{"key":"sarath.sarma1@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"gauravcapitalservices@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"lifewithgautam@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"bn.pandey@rediffmail.com", "value": "Prop", "role": "4"},
{"key":"rahul.nand17@gmail.com", "value": "Mutual Fund Consultant", "role": "4"},
{"key":"kiran.pradhan@yahoo.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"realvaluef@gmail.com", "value": "Director", "role": "4"},
{"key":"prashant@geodesiconline.com", "value": "Co-Founder & Chief Financial Officer", "role": "4"},
{"key":"sanil@geojit.com", "value": "Head-Sales", "role": "2"},
{"key":"bijukumar@geojit.com", "value": "Assistant Vice President", "role": "4"},
{"key":"jo.arunjo@gmail.com", "value": "Assistant Manager", "role": "4"},
{"key":"satish@geojit.com", "value": "Director Operations", "role": "7"},
{"key":"joseph@geojit.com", "value": "Assistant General Manager - Risk & Administration", "role": "10"},
{"key":"vipings@geojit.com", "value": "Portfolio Manager", "role": "4"},
{"key":"cjgeorge@geojit.com", "value": "Managing Director", "role": "0"},
{"key":"rupesh@geplcapital.com", "value": "Head - Mutual Fund", "role": "4"},
{"key":"mridulla@geplcapital.com", "value": "Research Assocaite", "role": "4"},
{"key":"sahilnandu@gmail.com", "value": "Associate", "role": "4"},
{"key":"ritesh@ghallabhansali.com", "value": "Director", "role": "4"},
{"key":"mukesh@ghallabhansali.com", "value": "Managing Director", "role": "0"},
{"key":"rohan@ghallabhansali.com", "value": "Strategic Consultant", "role": "4"},
{"key":"bhaveshb@ghallabhansali.com", "value": "Vice President", "role": "4"},
{"key":"sahilnandu@ghallabhansali.com", "value": "Partner", "role": "4"},
{"key":"ca.girishlakhotiya@gmail.com", "value": "Designated Partner", "role": "4"},
{"key":"sandeep_bachhe@yahoo.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"kkmital@gmail.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"guptaboggarapu@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"shabbar@goldentouchconsulting.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"hari.thaivalappil@gs.com", "value": "Senior Analyst", "role": "5"},
{"key":"vijay.karnani@gs.com", "value": "Head of Securities Business.", "role": "4"},
{"key":"tushar.poddar@gs.com", "value": "Economist", "role": "5"},
{"key":"sanjay@benchmarkfunds.com", "value": "Chief Administrative Officer", "role": "10"},
{"key":"pranita.gramopadhye@gs.com", "value": "Compliance Officer", "role": "4"},
{"key":"shailesh.mamnani@gs.com", "value": "Executive Director", "role": "1"},
{"key":"bibek.sengupta@gs.com", "value": "Executive Director", "role": "1"},
{"key":"hemen@benchmarkfunds.com", "value": "Products", "role": "6"},
{"key":"sanjiv.shah@gs.com", "value": "Managing Director and Co-Chief Executive Officer", "role": "0"},
{"key":"rajdeep.basu@gs.com", "value": "Investor Relations Officer", "role": "4"},
{"key":"payal.kaipunjal@gs.com", "value": "Fund Manager", "role": "5"},
{"key":"gauri.sekaria@gs.com", "value": "Fund Manager", "role": "5"},
{"key":"siddharth.deb@gs.com", "value": "Fund Manager", "role": "5"},
{"key":"prashant.khemka@gs.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"pritom@fineadvice.in", "value": "Vice President - Marketing", "role": "2"},
{"key":"mm.marilyn@gmail.com", "value": "Columnist", "role": "4"},
{"key":"govhari@gmail.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"ndicondwar@gpxglobal.net", "value": "Datacenter & Corporate Office", "role": "4"},
{"key":"smahesh75@gmail.com", "value": "Executive - Accounts", "role": "7"},
{"key":"charul.shah@greshma.com", "value": "Director", "role": "4"},
{"key":"munish777@hotmail.com", "value": "Director", "role": "4"},
{"key":"jatin_khurana@hotmail.com", "value": "Director", "role": "4"},
{"key":"shahheeren@yahoo.com", "value": "none", "role": "4"},
{"key":"messagejk@gmail.com", "value": "none", "role": "4"},
{"key":"Amit.Dabas@guggenheimpartners.com", "value": "Vice President", "role": "4"},
{"key":"kdhillon@guggenheimpartners.com", "value": "Managing Director", "role": "0"},
{"key":"nayar.rajiv@gmail.com", "value": "Partner", "role": "4"},
{"key":"securities@tmills.com", "value": "Proprietor", "role": "4"},
{"key":"naveen_dec@yahoo.com", "value": "Manager Taxation", "role": "4"},
{"key":"reachme@haardiknayak.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"pushpa_gada@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"jmathews@hdfcfund.com", "value": "Investor Service Officer", "role": "4"},
{"key":"naveeng@hdfcfund.com", "value": "Head - Marketing", "role": "2"},
{"key":"yezdik@hdfcfund.com", "value": "Chief Compliance Officer", "role": "4"},
{"key":"srinivasr@hdfc.com", "value": "Fund Manager-Equities", "role": "5"},
{"key":"chirags@hdfcfund.com", "value": "Fund Manager-Equities", "role": "5"},
{"key":"satishj@hdfcfund.com", "value": "Senior Portfolio Manager", "role": "4"},
{"key":"anilb@hdfcfund.com", "value": "Senior Fund Manager - Fixed Income", "role": "5"},
{"key":"prashantj@hdfcfund.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"shobhitm@hdfcfund.com", "value": "Senior Fund Manager & Head of Credit", "role": "5"},
{"key":"srinivasr@hdfcfund.com", "value": "Assistant Vice President - Equity Research", "role": "5"},
{"key":"vinayk@hdfcfund.com", "value": "Fund Manager", "role": "5"},
{"key":"kashok@hdfcfund.com", "value": "Head - Products, Business Dev & Training", "role": "6"},
{"key":"1987shah.ronak@gmail.com", "value": "Unit Manager", "role": "4"},
{"key":"jitalshah1980@gmail.com", "value": "Unit Manager", "role": "4"},
{"key":"HEMAL.BARFIWALA@GMAIL.COM", "value": "Unit Manager", "role": "4"},
{"key":"rmaniar@hdfcfund.com", "value": "Head - New Initiatives", "role": "4"},
{"key":"kirank@hdfcfund.com", "value": "Senior Vice President - Head Sales & Distribution", "role": "2"},
{"key":"simalk@hdfcfund.com", "value": "Head of Sales", "role": "2"},
{"key":"nareshk@hdfcfund.com", "value": "Executive Client Service", "role": "1"},
{"key":"dsp@hdfc.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"milind@hdfcfund.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sumit8m@rediffmail.com", "value": "Financial Services Consultant", "role": "4"},
{"key":"raghubganganna@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"arthurc@hdfcfund.com", "value": "Assistant Vice President & Cluster Head", "role": "4"},
{"key":"jhas@hdfc.com", "value": "Head - Corporate Legal", "role": "4"},
{"key":"Kapil.Bansal@hdfcbank.com", "value": "Manager", "role": "4"},
{"key":"Ameya.Shenoy@hdfcbank.com", "value": "Deputy Vice President", "role": "4"},
{"key":"Abhishek.Bhuwalka@hdfcbank.com", "value": "Vice President & Unit Head - Treasury Sales", "role": "2"},
{"key":"shivom.chakravarti@hdfcbank.com", "value": "Economist", "role": "3"},
{"key":"aparna.mantha@hdfcbank.com", "value": "Senior Manager - Retail Assets Securatisation", "role": "4"},
{"key":"arup.rakshit@hdfcbank.com", "value": "Head - Treasury Advisory Group", "role": "4"},
{"key":"ashish.parthasarthy@hdfcbank.com", "value": "Deputy Treasurer", "role": "4"},
{"key":"conrad@hdfc.com", "value": "Treasury", "role": "3"},
{"key":"debajeet.das@hdfcbank.com", "value": "Treasury Advisory Group", "role": "3"},
{"key":"kaizad.bharucha@hdfcbank.com", "value": "Head of Credit", "role": "4"},
{"key":"pallav.nevatia@hdfcbank.com", "value": "Relationship Manager", "role": "4"},
{"key":"sunil@hdfc.com", "value": "Senior Manager - Treasury", "role": "3"},
{"key":"navin.puri@hdfcbank.com", "value": "Country Head - Branch Banking", "role": "0"},
{"key":"aditya.puri@hdfcbank.com", "value": "Managing Director", "role": "0"},
{"key":"keki.mistry@hdfc.com", "value": "Managing Director", "role": "0"},
{"key":"dimplec@hdfc.com", "value": "Management Trainee", "role": "4"},
{"key":"karanmistry@gmail.com", "value": "Senior Investment Advisor", "role": "5"},
{"key":"yogesh.pai@hdfcbank.com", "value": "Deputy Vice President- HR Learning and Development", "role": "8"},
{"key":"divya.nayyar@hdfcbank.com", "value": "Relationship Manager", "role": "4"},
{"key":"ashtosh.raina@hdfcbank.com", "value": "Head of Forex and Derivatives", "role": "4"},
{"key":"vtmurdeshwar@gmail.com", "value": "Senior Manager", "role": "4"},
{"key":"jay.prakash@hdfcbank.com", "value": "Director", "role": "4"},
{"key":"shreyans.kaushik@gmail.com", "value": "Investment Advisor", "role": "5"},
{"key":"anujk73@yahoo.com", "value": "Vice President", "role": "4"},
{"key":"Ritika.Grover@hdfcbank.com", "value": "none", "role": "4"},
{"key":"kartik.jain@hdfcbank.com", "value": "Executive Vice President & Head Marketing", "role": "2"},
{"key":"roopesh.patil@hdfcbank.com", "value": "Deputy Manager", "role": "4"},
{"key":"hari.iyer@hdfcbank.com", "value": "Regional Head - Equities and Private Banking Group", "role": "4"},
{"key":"vishal.mhaiskar@gmail.com", "value": "none", "role": "4"},
{"key":"chandan_india@hotmail.com", "value": "Investment Advisor", "role": "5"},
{"key":"anuj.v.mathur@hdfcbank.com", "value": "Senior Vice President Human Resources", "role": "8"},
{"key":"philip.mathew@hdfcbank.com", "value": "Chief People Officer", "role": "7"},
{"key":"anuj.khanna@hdfcbank.com", "value": "Product Designer - UHNW space & Private Banking Group", "role": "3"},
{"key":"anujr.khanna@hdfcbank.com", "value": "Head - PBG Products", "role": "3"},
{"key":"anil.abraham@hdfcbank.com", "value": "Vice President - Research", "role": "3"},
{"key":"roopa.natrajan@hdfcbank.com", "value": "Head - Third Party Products", "role": "3"},
{"key":"s.sampathkumar@hdfcbank.com", "value": "PBG Product Head - Equities and Private Banking", "role": "3"},
{"key":"Aditya.Deshpande@hdfcbank.com", "value": "Product Manager - Mutual Funds and Wealth Services", "role": "3"},
{"key":"abhay.aima@hdfcbank.com", "value": "Head - Equities,  Private Banking, Third Party Products and NRI Banking", "role": "0"},
{"key":"nitin.rao@hdfcbank.com", "value": "Senior Executive Vice President - Private Banking Group and Third Party Products", "role": "3"},
{"key":"anil.jaggia@hdfcbank.com", "value": "Chief Information Officer", "role": "7"},
{"key":"munish.mittal@hdfcbank.com", "value": "Vice President - Information Technology", "role": "4"},
{"key":"keyurs@hdfc.com", "value": "Chief Financial Officer", "role": "7"},
{"key":"aroy@hdfc.com", "value": "Associate", "role": "4"},
{"key":"bdevaraj@hdfc.com", "value": "Vice President-Projects", "role": "4"},
{"key":"naresh@hdfc.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"kgk@hdfc.com", "value": "Chief Executive Officer and Managing Director", "role": "0"},
{"key":"amitj@hdfc.com", "value": "Head-Marketing", "role": "2"},
{"key":"vikramg@hdfc.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"vinod.sharma@hdfcsec.com", "value": "Head of Private Broking & Wealth Management", "role": "4"},
{"key":"parekh_gm@yahoo.co.in", "value": "Certified Financial Consultant", "role": "4"},
{"key":"ram@headwaycapitaladvisors.com", "value": "Partner", "role": "4"},
{"key":"hemamoryani@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"archanasb2002@yahoo.com", "value": "Director", "role": "4"},
{"key":"suresh_pin@yahoo.com", "value": "Sr Research Analyst", "role": "3"},
{"key":"hlk@airtelmail.in", "value": "Proprietor", "role": "4"},
{"key":"nipun.panwar@homestead-india.com", "value": "Senior Manager - International Sales", "role": "2"},
{"key":"purushottam_5@yahoo.co.in", "value": "CEO", "role": "0"},
{"key":"chetan1joshi@hsbc.co.in", "value": "Structured Finance  Treasury & Capital Markets - India", "role": "1"},
{"key":"hitendradave@hsbc.co.in", "value": "Co-Head of Global Markets", "role": "0"},
{"key":"jdasgupta@hsbc.co.in", "value": "Associate Director - Institutional Sales - India", "role": "2"},
{"key":"piyushharlalka@hsbc.co.in", "value": "Analyst", "role": "3"},
{"key":"ravi.r.menon@hsbc.com", "value": "Director & Co-Head  Investment Banking", "role": "0"},
{"key":"vineet1patawari@hsbc.co.in", "value": "Senior Manager  Institutional Sales - India", "role": "1"},
{"key":"nainakidwai@hsbc.co.in", "value": "Country Head", "role": "0"},
{"key":"vivekpooja@rediffmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"bkaushik78@gmail.com", "value": "Financial Planning Manager", "role": "4"},
{"key":"shivdasrao@hsbc.co.in", "value": "SVP - Learning Delivery - INM Learning", "role": "4"},
{"key":"uttiyadey@hsbc.co.in", "value": "Senior Vice President and Head - Marketing", "role": "2"},
{"key":"dennythomas@hsbc.co.in", "value": "Vice President & Head - Legal and Compliance", "role": "7"},
{"key":"siddharthtaterh@hsbc.co.in", "value": "Senior Vice President ad Head-Risk", "role": "7"},
{"key":"abhishekdev@hsbc.co.in", "value": "Senior Vice President and Head-Product and Strategy", "role": "6"},
{"key":"sanjayshah@hsbc.co.in", "value": "Senior Vice President and Fund Manager-Fixed Income", "role": "5"},
{"key":"dhirajsachdev@hsbc.co.in", "value": "Senior Vice President and Fund Manager-Equities", "role": "5"},
{"key":"tusharpradhan@hsbc.co.in", "value": "Chief Investment Officer", "role": "5"},
{"key":"jitendrasriram@hsbc.co.in", "value": "Fund Manager - Fixed Income", "role": "5"},
{"key":"vipulgupta@hsbc.com", "value": "Senior Vice President and Head of Sales & Distribution", "role": "2"},
{"key":"puneetchaddha@hsbc.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"dianadhote@hsbc.co.in", "value": "Chief Operating Officer", "role": "7"},
{"key":"animeshraizada@hsbc.co.in", "value": "Head - Wealth Development", "role": "4"},
{"key":"prateekjain@hsbc.co.in", "value": "Vice President - Investment Advisory Group", "role": "5"},
{"key":"shantanushankar@hsbc.co.in", "value": "SVP - Wealth Management (Investments and Insurance)", "role": "5"},
{"key":"shwaitavaish@hsbc.co.in", "value": "Senior Vice President & Head - Investment Advisory Services", "role": "5"},
{"key":"makshil@yahoo.com", "value": "Banking Assistant", "role": "4"},
{"key":"veerajparihar@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"tarun62@gmail.com", "value": "Premier Relationship Manager Direct Channels", "role": "4"},
{"key":"sac_kal_prince@yahoo.com", "value": "Universal Relationship Manager", "role": "4"},
{"key":"nitinsingh@hsbc.co.in", "value": "Senior Vice President", "role": "4"},
{"key":"talrejar@rediffmail.com", "value": "Vice President - Private Banking Department", "role": "4"},
{"key":"vivekmakim@hsbc.co.in", "value": "Regional Head West", "role": "4"},
{"key":"shreenivashegde@hsbc.co.in", "value": "Senior Vice President - Investment Advisory Group", "role": "5"},
{"key":"kapilseth@hsbc.co.in", "value": "Senior Vice President and Head", "role": "4"},
{"key":"hbhinde@hotmail.com", "value": "Chief Consultant", "role": "4"},
{"key":"prasad_bsli@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"niranjansuvarna@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"biswajitplanner@gmail.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"poonam_warang@yahoo.co.in", "value": "Marketing Officer", "role": "2"},
{"key":"shrutishah_ca@yahoo.co.in", "value": "Chairman,  Western Region India Council", "role": "0"},
{"key":"kediaca@kediaca.com", "value": "Treasurer", "role": "0"},
{"key":"wirc@icai.in", "value": "Chairman -  Western Region India Council", "role": "0"},
{"key":"president@icai.in", "value": "President", "role": "0"},
{"key":"shyamjpr@gmail.com", "value": "Vice Chairman", "role": "0"},
{"key":"icaiho@icai.in", "value": "President", "role": "4"},
{"key":"naveen@dassgupta.com", "value": "Chairman", "role": "0"},
{"key":"shankar@iceadvisors.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"prerana.hebbar@icicibank.com", "value": "Product Manager", "role": "3"},
{"key":"anand.shah@icicibank.com", "value": "Assistant General Manager", "role": "4"},
{"key":"anilkumar.parmar@icicibank.com", "value": "Assistant General Manger", "role": "4"},
{"key":"goolestan.elavia@icicibank.com", "value": "Assistant", "role": "4"},
{"key":"kamalika.das@icicibank.com", "value": "Commodities Economist", "role": "5"},
{"key":"malav.shah@icicibank.com", "value": "Manager", "role": "4"},
{"key":"manish.kumar@icicibank.com", "value": "Head of Primary Debt Syndication", "role": "4"},
{"key":"mayank.agrawal@icicibank.com", "value": "Structured Products Group", "role": "3"},
{"key":"nidhi.agarwalla@icicibank.com", "value": "Structured Products Group", "role": "3"},
{"key":"shilpa.kumar@icicibank.com", "value": "Global Markets", "role": "4"},
{"key":"sudipto.basu@icicibank.com", "value": "Structured Products Group", "role": "4"},
{"key":"surbhi.ogra@icicibank.com", "value": "Mar-04", "role": "5"},
{"key":"vikas.sethi@icicibank.com", "value": "Mar-04", "role": "4"},
{"key":"vineet.dhar@icicibank.com", "value": "Mar-04", "role": "4"},
{"key":"vishakha.mulye@icicibank.com", "value": "Mar-04", "role": "4"},
{"key":"satya.prasad@icicibank.com", "value": "Global Markets Group", "role": "4"},
{"key":"kamath.kv@icicibank.com", "value": "Mar-04", "role": "0"},
{"key":"kannan.ns@icicibank.com", "value": "Mar-04", "role": "1"},
{"key":"sameer.garg@icicibank.com", "value": "Jun-16", "role": "4"},
{"key":"siddharth.j@icicibank.com", "value": "Mar-07", "role": "3"},
{"key":"dharmesh.ved@hotmail.com", "value": "Oct-05", "role": "4"},
{"key":"ankur.desai@icicibank.com", "value": "Mar-13", "role": "4"},
{"key":"lakshmi.sankar@icicibank.com", "value": "Mar-12", "role": "4"},
{"key":"karna_4u@yahoo.com", "value": "Jan-19", "role": "4"},
{"key":"talktokf@gmail.com", "value": "Jan-19", "role": "4"},
{"key":"gmdr2008@gmail.com", "value": "Aug-17", "role": "4"},
{"key":"rupesh.satnaliwala@icicibank.com", "value": "Global Private Clients", "role": "4"},
{"key":"anil.malkani@icicibank.com", "value": "Wealth Manager", "role": "4"},
{"key":"anindya.karmakar@icicibank.com", "value": "Deputy General Manager - Wealth Management", "role": "4"},
{"key":"prathit.bhobe@icicibank.com", "value": "General Manager - Wealth Management and Privilege Banking", "role": "4"},
{"key":"vdoshi9@hotmail.com", "value": "Manager", "role": "4"},
{"key":"viveksharma95@rediffmail.com", "value": "Chief Manager", "role": "4"},
{"key":"vaibhav_us@yahoo.com", "value": "Senior Officer", "role": "4"},
{"key":"nayanangshu@rediffmail.com", "value": "Branch Manager", "role": "4"},
{"key":"raunak.bhaiya@icicibank.com", "value": "Investment Advisor and Strategist", "role": "5"},
{"key":"puneet.diwan@icicibank.com", "value": "Head Investment Advisor", "role": "5"},
{"key":"rajeev.nai@icicibank.com", "value": "Relationship Manager", "role": "4"},
{"key":"ramkumar.k@icicibank.com", "value": "Executive Director - Human Resources,  Customer Service & Operations", "role": "7"},
{"key":"mayur.doshi@icicibank.com", "value": "Product Manager", "role": "3"},
{"key":"maninder.juneja@icicibank.com", "value": "Head-Retail Strategy", "role": "4"},
{"key":"raman2s@rediffmail.com", "value": "Regional Sales Manager", "role": "2"},
{"key":"Tina.singh@icicibank.com", "value": "Head of Sales & Marketing", "role": "2"},
{"key":"Sandeep.indurkar@icicibank.com", "value": "Mobile Payments Head- Internet Banking & Mobile Banking Group", "role": "4"},
{"key":"bhaskarabhilash@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"mohishd20@rediffmail.com", "value": "Wealth Manager", "role": "4"},
{"key":"shripad.deshpande@icicibank.com", "value": "Assistant general manager-IT solutions", "role": "4"},
{"key":"surbhi.chadha@icicibank.com", "value": "Manager - Financial Planning Team", "role": "4"},
{"key":"sunil0374@gmail.com", "value": "Manager", "role": "4"},
{"key":"shaily.pearl@gmail.com", "value": "Product Manager", "role": "3"},
{"key":"ashish.modi@icicibank.com", "value": "Zonal Head", "role": "4"},
{"key":"vibhu.asthana@icicibank.com", "value": "Head Investments-Delhi NCR", "role": "5"},
{"key":"anand.vardarajan@icicibank.com", "value": "Head Investments - Wealth Management", "role": "5"},
{"key":"sanjay.rao@icicibank.com", "value": "Head - Products", "role": "3"},
{"key":"ramachandran.g@icicibank.com", "value": "Head - Global Research Group", "role": "4"},
{"key":"vohra.rahul@icicibank.com", "value": "Senior General Manager - Global Private Clients", "role": "4"},
{"key":"vikas.agarwal@icicibank.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"sharad.malpani@icicibank.com", "value": "Deputy General Manager", "role": "4"},
{"key":"hardiksompura@gmail.com", "value": "Unit Sales Manager", "role": "2"},
{"key":"gopalakrishnan.s@icicilombard.com", "value": "Head of Investments", "role": "5"},
{"key":"vinod.mahajan@icicibank.com", "value": "Assistant Vice President", "role": "4"},
{"key":"girish.kalra@icicilombard.com", "value": "none", "role": "4"},
{"key":"vinod_soni@icicipruamc.com", "value": "Head - IFA Chanel", "role": "4"},
{"key":"adil_bakhshi@icicipruamc.com", "value": "Head - Product Communication", "role": "2"},
{"key":"saurav_parmar@icicipruamc.com", "value": "Associate Vice President - Marketing", "role": "2"},
{"key":"Supriya_sapre@icicipruamc.com", "value": "none", "role": "4"},
{"key":"siddharth_trivedi@icicipruamc.com", "value": "Relationship Manager", "role": "4"},
{"key":"rahul_rai@icicipruamc.com", "value": "Head-Real Estate", "role": "4"},
{"key":"rahul_goswami@icicipruamc.com", "value": "Chief Investment Officer-Fixed Income", "role": "5"},
{"key":"Megha_maheshwari@icicipruamc.com", "value": "Investment Marketing - International Products", "role": "6"},
{"key":"aditya_bajaj@icicipruamc.com", "value": "Head Products - International Business", "role": "6"},
{"key":"sankaran_naren@icicipruamc.com", "value": "Chief Investment Officer - Equities & Fixed Income", "role": "5"},
{"key":"sharzad_sethna@icicipruamc.com", "value": "none", "role": "4"},
{"key":"rahulkashyap19@rediffmail.com", "value": "Manager", "role": "4"},
{"key":"upasana_ray@icicipruamc.com", "value": "Channel Manager", "role": "4"},
{"key":"gaurav_goyal@icicipruamc.com", "value": "Head-Mumbai Retail", "role": "4"},
{"key":"rakhee_bhagchandani@icicipruamc.com", "value": "Product Manager-International Business", "role": "6"},
{"key":"amar_shah@icicipruamc.com", "value": "Senior Vice President", "role": "4"},
{"key":"rajpurohit705@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"chintan_malhotra@icicipruamc.com", "value": "Senior Manager - International Business", "role": "4"},
{"key":"psevekari@hotmail.com", "value": "Assistant Vice President - Institutional Sales", "role": "2"},
{"key":"Hamavand_shroff@icicipruamc.com", "value": "Channel Head - Banking & PCG", "role": "4"},
{"key":"lalit_popli@icicipruamc.com", "value": "Vice President - Sales", "role": "2"},
{"key":"karun_marwah@icicipruamc.com", "value": "Head - International Business", "role": "6"},
{"key":"raghav_iyengar@icicipruamc.com", "value": "Executive Vice President - Head Institutional & Retail Business", "role": "1"},
{"key":"ambujkumar.jsr@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"varun_misser@icicipruamc.com", "value": "Investor Education Officer", "role": "7"},
{"key":"manish.dubey@iciciprulife.com", "value": "Heads of Marketing and Service Quality", "role": "2"},
{"key":"bali.alok@iciciprulife.com", "value": "none", "role": "4"},
{"key":"judhajit.das@iciciprulife.com", "value": "Chief Human Resources", "role": "8"},
{"key":"kannan.ns@iciciprulife.com", "value": "Executive Director", "role": "1"},
{"key":"kumar.prakash@iciciprulife.com", "value": "Business Head - Strategic Alliances", "role": "0"},
{"key":"basridhar@gmail.com", "value": "Advisor", "role": "4"},
{"key":"akalp.gupta@iciciprulife.com", "value": "Analyst", "role": "3"},
{"key":"arun.srinivasan@iciciprulife.com", "value": "Assistant Vice President - Investments", "role": "5"},
{"key":"jitendra.arora@iciciprulife.com", "value": "Assistant Vice President - Investments", "role": "5"},
{"key":"manish.k@iciciprulife.com", "value": "Head - Equities", "role": "5"},
{"key":"puneet.nanda@iciciprulife.com", "value": "Executive Vice President & Chief Investment Officer", "role": "5"},
{"key":"ppilla_1977@yahoo.com", "value": "Life Insurance Advisor", "role": "4"},
{"key":"chaitanya.celly@iciciprulife.com", "value": "none", "role": "4"},
{"key":"sujeet.kothare@iciciprulife.com", "value": "none", "role": "4"},
{"key":"meghana.baji@iciciprulife.com", "value": "Associate Vice President", "role": "4"},
{"key":"pooja_0601@yahoo.co.in", "value": "Manager", "role": "4"},
{"key":"sunil1568@yahoo.com", "value": "Business Manager", "role": "4"},
{"key":"abhisek_garg@yahoo.co.in", "value": "Sales Manager Agency", "role": "2"},
{"key":"jaswinder1974@yahoo.com", "value": "Business Partner", "role": "4"},
{"key":"madan_kapur@hotmail.com", "value": "Manager", "role": "4"},
{"key":"sanjiv.saraff@icicisecurities.com", "value": "Senior Vice President - Investment Banking", "role": "5"},
{"key":"ananthasubramaniam.murthy@icicisecurities.com", "value": "Associate Vice President - Marketing", "role": "2"},
{"key":"abhishake.mathur@icicisecurities.com", "value": "Head Customer Service", "role": "4"},
{"key":"hemant.bhatt@icicisecurities.com", "value": "Assistant Vice President - Private Wealth Management", "role": "4"},
{"key":"harshad.shenolikar@icicisecurities.com", "value": "Chief Manager", "role": "4"},
{"key":"chiragd009@gmail.com", "value": "none", "role": "4"},
{"key":"manish.mehrotra@icicisecurities.com", "value": "Zonal Head - West - Private Wealth Management", "role": "4"},
{"key":"harminder_garg@yahoo.com", "value": "Senior Manager", "role": "4"},
{"key":"sandipan.roy@icicisecurities.com", "value": "Head - Investment Advisory, Private Wealth", "role": "5"},
{"key":"anil.polaki@gmail.com", "value": "Investment Advisory", "role": "5"},
{"key":"vaijayanti.naik@icicisecurities.com", "value": "Senior Vice President & Head - Human Resources", "role": "8"},
{"key":"manmeet.khurana@icicisecurities.com", "value": "Vice President & Head - Products", "role": "3"},
{"key":"vineet.arora@icicisecurities.com", "value": "Senior Vice President and Head - Product & Distribution", "role": "3"},
{"key":"arnik.shah@icicisecurities.com", "value": "Analyst", "role": "3"},
{"key":"anupam.guha@icicisecurities.com", "value": "Head Sales - India", "role": "2"},
{"key":"anup.bagchi@icicisecurities.com", "value": "Managing Director and Chief Executive Officer", "role": "0"},
{"key":"shikha.singh@icicisecurities.com", "value": "AVP HR", "role": "8"},
{"key":"gaurav.awasthi@icicisecurities.com", "value": "Head - Product - Private Wealth Management", "role": "3"},
{"key":"mayankshah_bhl@yahoo.co.in", "value": "Regional Product Manager-Wealth GRIP", "role": "3"},
{"key":"subir.saha@icicisecurities.com", "value": "Head - Compliance", "role": "4"},
{"key":"abhishakemathur@yahoo.com", "value": "Head Customer Service", "role": "4"},
{"key":"krh_spe@rediffmail.com", "value": "Senior Manager Sales", "role": "2"},
{"key":"dheeraj.sehgal@icicisecurities.com", "value": "Head - Retail Sales", "role": "2"},
{"key":"shameek.ray@isecpd.com", "value": "Senior Vice President-Head Debt Capital Markets", "role": "4"},
{"key":"b.prasanna@isecpd.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"amit.pradhan@isecpd.com", "value": "Vice President - Fixed Income", "role": "5"},
{"key":"beena.chotai@iciciventure.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"vishakha.mulye@iciciventure.com", "value": "CEO & Managing Director", "role": "0"},
{"key":"lalita.gupte@icicibank.com", "value": "Non Executive Chairman", "role": "1"},
{"key":"bharat.sharma@icicibank.com", "value": "Head - Wealth Management", "role": "4"},
{"key":"lahar.bhasin@icraonline.com", "value": "none", "role": "4"},
{"key":"kalpesh@icraindia.com", "value": "Head of Structured Finance", "role": "4"},
{"key":"vw@icraindia.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"vikas@icraindia.com", "value": "Assistant General Manager", "role": "4"},
{"key":"naresh@icraindia.com", "value": "Managing Director and CEO", "role": "0"},
{"key":"arun.singh@idbimutual.co.in", "value": "Executive Director-Marketing", "role": "1"},
{"key":"gautam.kaul@idbimutual.co.in", "value": "Fund Manager-Fixed Income", "role": "5"},
{"key":"sarath.sarma@idbimutual.co.in", "value": "Executive Director & Head- Sales", "role": "2"},
{"key":"i.padhan@idbi.co.in", "value": "Deputy General Manager - Market Risk", "role": "4"},
{"key":"b.mythili@idbi.co.in", "value": "General Manager", "role": "4"},
{"key":"yashpal.gupta@idbi.co.in", "value": "Deputy General Manager", "role": "4"},
{"key":"herojianbu@gmail.com", "value": "Consultant / Business Development for Back Office Processing", "role": "4"},
{"key":"haroon@idbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"ns.venkatesh@idbi.co.in", "value": "Chief General Manager & Head of Treasury", "role": "4"},
{"key":"aneesh.khanna@idbifederal.com", "value": "Senior Vice President", "role": "4"},
{"key":"sanghavidhaval@yahoo.com", "value": "Area Sales Manager", "role": "2"},
{"key":"narendra.gangan@idfc.com", "value": "Senior Director & Head - Compliance", "role": "4"},
{"key":"ritesh.vohra@idfc.com", "value": "Partner", "role": "4"},
{"key":"sanjay.lakra@idfc.com", "value": "Head-Legal & Compliance", "role": "7"},
{"key":"jyothi.krishnan@idfc.com", "value": "Compliance officer", "role": "4"},
{"key":"santosh@idfc.com", "value": "Principal - Legal", "role": "4"},
{"key":"animesh.kumar@idfc.com", "value": "Group Head - Human Resources", "role": "8"},
{"key":"sandeep.prabhani@idfc.com", "value": "Senior Director-Operations", "role": "7"},
{"key":"rupesh.acharya@idfc.com", "value": "Director-Finance", "role": "4"},
{"key":"kenneth.andrade@idfc.com", "value": "Head-Investments", "role": "5"},
{"key":"sunil.nair@idfc.com", "value": "Equity Dealer", "role": "5"},
{"key":"neelotpal.sahai@idfc.com", "value": "Fund Manager", "role": "5"},
{"key":"rajendra.mishra@idfc.com", "value": "Senior Vice President-Investments", "role": "5"},
{"key":"ankur.arora@idfc.com", "value": "Associate Director-Fund Management", "role": "4"},
{"key":"vikash.raj@idfc.com", "value": "Head - Products & Planning", "role": "3"},
{"key":"meenakshi.dawar@idfc.com", "value": "Fund Manager", "role": "5"},
{"key":"punam.sharma@idfc.com", "value": "Fund Manager", "role": "5"},
{"key":"suyash.choudhary@idfc.com", "value": "Head - Fixed Income", "role": "5"},
{"key":"prawin@idfc.com", "value": "Deputy Head - Fixed Income & Treasury", "role": "5"},
{"key":"tanwir.alam@idfc.com", "value": "Director - Sales", "role": "2"},
{"key":"nikhil.kamat@idfc.com", "value": "Associate Vice President - Sales", "role": "2"},
{"key":"1apoorva@gmail.com", "value": "Assistant Vice President", "role": "4"},
{"key":"naval.kumar@idfc.com", "value": "Managing Director", "role": "0"},
{"key":"kalpen.parekh@idfc.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"harshad.awalegaonkar@idfc.com", "value": "Associate Vice President - Operations", "role": "7"},
{"key":"luis@idfcpe.com", "value": "President & Chief Executive Officer", "role": "1"},
{"key":"shyamsundar.sg@idfc.com", "value": "Senior Managing Director", "role": "0"},
{"key":"raja.parthasarathy@idfc.com", "value": "Senior Managing Director", "role": "0"},
{"key":"satish.mandhana@idfc.com", "value": "Managing Partner", "role": "0"},
{"key":"girish.nadkarni@idfc.com", "value": "Partner", "role": "4"},
{"key":"kartik.ramachandran@idfc.com", "value": "Director", "role": "4"},
{"key":"narayanan.g@idfc.com", "value": "Director", "role": "4"},
{"key":"aditya.aggarwal@idfc.com", "value": "Managing Director", "role": "0"},
{"key":"sachin.johri@idfc.com", "value": "Senior Managing Director", "role": "0"},
{"key":"mksinha@idfc.com", "value": "President & CEO", "role": "0"},
{"key":"vikram.pant@idfc.com", "value": "Senior Managing Director", "role": "0"},
{"key":"Nikhil.vora@idfc.com", "value": "Managing Director", "role": "0"},
{"key":"contact@idgvcindia.com", "value": "Founder and Managing Director", "role": "0"},
{"key":"reachnmk@yahoo.co.in", "value": "RM", "role": "4"},
{"key":"mishra.sbhushan@gmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"akn@ifagalaxy.com", "value": "President", "role": "4"},
{"key":"bhat@ifagalaxy.com", "value": "President", "role": "4"},
{"key":"udaypatil1950@rediffmail.com", "value": "Faculty", "role": "4"},
{"key":"anil@ifinancesolutions.org", "value": "Founder", "role": "4"},
{"key":"nirmal@indiainfoline.com", "value": "Chairman", "role": "0"},
{"key":"mohanr@indiainfoline.com", "value": "Chief Compliance Officer", "role": "7"},
{"key":"mahendra.sharma@indiainfoline.com", "value": "none", "role": "4"},
{"key":"deepa.hotwani@iiflw.com", "value": "Manager - Wealth Structuring Solutions", "role": "4"},
{"key":"vijay@iiflw.com", "value": "Senior Vice President", "role": "4"},
{"key":"mona.s@iiflw.com", "value": "Vice President", "role": "4"},
{"key":"himadri@iiflw.com", "value": "Senior Vice President - Family Office", "role": "0"},
{"key":"girish.v@iiflw.com", "value": "President", "role": "4"},
{"key":"prashasta@iiflw.com", "value": "Senior Fund Manager", "role": "5"},
{"key":"anirban@iiflw.com", "value": "Senior Vice President - Human Resources", "role": "8"},
{"key":"jjayakaran@gmail.com", "value": "Assistant Vice President", "role": "4"},
{"key":"abdeali.tambawala@iiflw.com", "value": "Vice President Products - Real Estate", "role": "3"},
{"key":"umang.papneja@iiflw.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"karan@iiflw.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"anirudha.taparia@iiflw.com", "value": "Director & COO", "role": "4"},
{"key":"ronak.sheth@iiflw.com", "value": "Head of Marketing", "role": "2"},
{"key":"yogesh.ranganath@iiflw.com", "value": "Vice President", "role": "4"},
{"key":"doctorypsingh@yahoo.com", "value": "Professor and Consultant", "role": "4"},
{"key":"bina.trivedi@ilfsindia.com", "value": "Managing Partner", "role": "0"},
{"key":"shahzaad.dalal@ilfsindia.com", "value": "Vice Chairman", "role": "4"},
{"key":"archana.hingorani@ilfsindia.com", "value": "CEO & Executive Director", "role": "0"},
{"key":"manoj.jain@issl.co.in", "value": "Vice President", "role": "4"},
{"key":"v.hansprakash@issl.co.in", "value": "Senior Manager", "role": "4"},
{"key":"seemanc@rediffmail.com", "value": "Assistant Manager", "role": "4"},
{"key":"Navita.Yadav@ilfsindia.com", "value": "Chief Operating Officer and Head - Business", "role": "4"},
{"key":"prdilip@impetusindia.in", "value": "Managing Director", "role": "0"},
{"key":"mayank.shah@impieegocapital.com", "value": "Investment Director", "role": "5"},
{"key":"nand.gangwani@yahoo.com", "value": "Training Manager FP", "role": "4"},
{"key":"arvindg.imsproschool@gmail.com", "value": "Center Manager", "role": "4"},
{"key":"drksr9@rediffmail.com", "value": "Professor", "role": "4"},
{"key":"suryanaik54@rediffmail.com", "value": "Indepedent Financial Advisor", "role": "4"},
{"key":"mirji.ravi@gmail.com", "value": "Indenpendent Financial Advisor", "role": "4"},
{"key":"deepali.m@indiabulls.com", "value": "none", "role": "4"},
{"key":"shekarm@indiafinancebazaar.com", "value": "CEO and President", "role": "0"},
{"key":"ashutosh.naik@indiainfoline.com", "value": "Compliance Officer & Company Secretary", "role": "4"},
{"key":"manish.bandi@indiainfoline.com", "value": "Fund Manager", "role": "5"},
{"key":"anil_kalra@rediffmail.com", "value": "Associate Vice President", "role": "4"},
{"key":"govind.saboo@indianivesh.in", "value": "Head-Merchant Banking", "role": "4"},
{"key":"manoj.jain@indianivesh.in", "value": "Head-Commodities and Forex Broking", "role": "4"},
{"key":"sunil.avasthi@indianivesh.in", "value": "President-Insurance Broking", "role": "4"},
{"key":"daljeet.kohli@indianivesh.in", "value": "Head of Research", "role": "4"},
{"key":"naik@irepglobal.com", "value": "Managing Director", "role": "0"},
{"key":"dipak306@yahoo.co.in", "value": "Associate Editor", "role": "4"},
{"key":"sunil@ivfa.com", "value": "Fund Manager", "role": "5"},
{"key":"mahesh@ivfa.com", "value": "Fund Manager", "role": "5"},
{"key":"vishal@ivfa.com", "value": "Managing Partner", "role": "0"},
{"key":"dhirazz@hotmail.com", "value": "Sales Manager", "role": "2"},
{"key":"Nanda.gopal@indiafirstlife.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"sanjay@indianangelnetwork.com", "value": "North Region", "role": "4"},
{"key":"rambabuk.indianbankwms@gmail.com", "value": "Senior Maanger - Deputy Administrator", "role": "10"},
{"key":"trychimani@yahoo.com", "value": "Banker", "role": "4"},
{"key":"prasanth_va@yahoo.com", "value": "Asst General Manager", "role": "4"},
{"key":"nardagar@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"rema@iba.org.in", "value": "Senior Vice President Publicity", "role": "4"},
{"key":"gulzar.malhotra@ipal.co.in", "value": "Partner", "role": "4"},
{"key":"k_ramachandran@isb.edu", "value": "Professor", "role": "4"},
{"key":"mr_rao@isb.edu", "value": "Dean", "role": "4"},
{"key":"vikram_kuriyan@isb.edu", "value": "Director of the Investment Centre", "role": "5"},
{"key":"anand@indiaquotient.in", "value": "Founder & Partner", "role": "4"},
{"key":"bhushan.sawant@piramal.com", "value": "Partner - Investor Relations", "role": "4"},
{"key":"hitesh.dhankani@piramal.com", "value": "Vice President- Funds", "role": "4"},
{"key":"khushru.jijina@piramal.com", "value": "Managing Partner", "role": "0"},
{"key":"pradeepmgeorge@gmail.com", "value": "Finanacial Planner", "role": "4"},
{"key":"hirendharamshi@hotmail.com", "value": "VP - Institutional Sales", "role": "2"},
{"key":"prasadgadhe@gmail.com", "value": "Indiviual Financal Advisor", "role": "4"},
{"key":"sbaid@indostarcapital.com", "value": "Managing Director", "role": "0"},
{"key":"info@induscapital.in", "value": "Director", "role": "4"},
{"key":"abhishek.deshmukh@indusind.com", "value": "Head - Relationship Banking", "role": "4"},
{"key":"zubin.mody@indusind.com", "value": "Head - Human Resources", "role": "8"},
{"key":"sumant.kathpalia@indusind.com", "value": "Head - Consumer Banking", "role": "4"},
{"key":"ashish.malaviya@indusind.com", "value": "Head - Investments", "role": "5"},
{"key":"shreyas.mantri@indusind.com", "value": "Product Manager - Mutual Funds", "role": "3"},
{"key":"romesh.sobti@indusind.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"paul.abraham@indusind.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"shyamal.karmakar@indusind.com", "value": "Head - Credit & Rates Trading", "role": "4"},
{"key":"kanchanpm@yahoo.co.in", "value": "Senior Consultant", "role": "4"},
{"key":"maulik@team-infinity.com", "value": "none", "role": "4"},
{"key":"rahultamrute@yahoo.com", "value": "Manager Finance", "role": "4"},
{"key":"mahendra@idfc.com", "value": "Portfolio Manager", "role": "4"},
{"key":"mangesh.kulkarni@idfc.com", "value": "Director", "role": "4"},
{"key":"vinay@idfc.com", "value": "Lead Specialist", "role": "4"},
{"key":"vineet.jain@idfc.com", "value": "Senior Vice President", "role": "4"},
{"key":"suhas.naik@ilfsindia.com", "value": "Senior Vice President", "role": "4"},
{"key":"vibhav.kapoor@ilfsindia.com", "value": "Group Chief Investment Officer", "role": "5"},
{"key":"shikha.bagai@ilfsindia.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"nithyajagannath@gmail.com", "value": "Product Manager", "role": "3"},
{"key":"bhawnamotiani@gmail.com", "value": "Associate - Institutional Sales", "role": "2"},
{"key":"haresh.mandhayan@in.ing.com", "value": "CRO", "role": "4"},
{"key":"uco.vegter@inglife.co.in", "value": "Chief Financial Officer", "role": "4"},
{"key":"prasadjm@ingvysyabank.com", "value": "Chief Õ¢ëÑëÐ Human Resources", "role": "8"},
{"key":"Shwethak@ingvysyabank.com", "value": "Head - People Processes & Support Functions", "role": "4"},
{"key":"maheshd@ingvysyabank.com", "value": "Country Head - Retail Assets", "role": "4"},
{"key":"sharecare@ingvysyabank.com", "value": "Deputy Head", "role": "4"},
{"key":"niraj.didwania@ingvysyabank.com", "value": "Manager - Private Investment Banking", "role": "5"},
{"key":"viswanathans@ingvysyabank.com", "value": "Head of Marketing", "role": "2"},
{"key":"paras1121@gmail.com", "value": "Assistant Vice President - Private Banking", "role": "4"},
{"key":"minar.jadhav@ingvysyabank.com", "value": "Head - Human Resources", "role": "8"},
{"key":"onkar.jutla@ingvysyabank.com", "value": "Product Manager", "role": "3"},
{"key":"sonalee.panda@ingvysyabank.com", "value": "Head - Private Banking and Wealth Management", "role": "4"},
{"key":"amit.joshi@ingvysyalife.com", "value": "Senior Investment Manager", "role": "5"},
{"key":"kl.narayan@hotmail.com", "value": "Insurance Advisor", "role": "4"},
{"key":"anilrawlani@yahoo.com", "value": "Managing Director", "role": "0"},
{"key":"financialplanner04@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"suresh@irda.gov.in", "value": "Senior Joint Director - Intermediaries", "role": "4"},
{"key":"chairman@irda.gov.in", "value": "Chairman", "role": "0"},
{"key":"pradeep.m.tagare@intel.com", "value": "Partner", "role": "4"},
{"key":"prashant.c@intellecap.net", "value": "Engagement Manager  Business Consulting Services", "role": "7"},
{"key":"aditi.shrivastava@intellecap.net", "value": "Intellecap Impact Investment Network", "role": "0"},
{"key":"anurag@intellecap.net", "value": "Chief Executive Officer", "role": "0"},
{"key":"madhus@icofp.org", "value": "International College of Financial Planning", "role": "4"},
{"key":"forcorrespondence@gmail.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"itsme.tapas@rediffmail.com", "value": "Assistant Professor", "role": "4"},
{"key":"rachita.m@immpl.com", "value": "Assistant Vice President", "role": "4"},
{"key":"rahulhuria83@rediffmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"lovaii@immpl.com", "value": "Founder & CEO", "role": "0"},
{"key":"udaydhoot@gmail.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"Arati.Bhat@internationalsos.com", "value": "Marketing Communications Manager", "role": "2"},
{"key":"christopher@intrustadvisorsllp.com", "value": "Partner", "role": "4"},
{"key":"deepti@investedge.co.in", "value": "Director", "role": "4"},
{"key":"ashish.a@micropensions.com", "value": "Executive Director", "role": "1"},
{"key":"pn.venkateshwarlu@gmail.com", "value": "CERTIFIED FINANCIAL PLANNER", "role": "4"},
{"key":"investmantra@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"mehulparekh1006@yahoo.co.in", "value": "Associate", "role": "4"},
{"key":"priyac21@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"bhavesh52002@yahoo.com", "value": "Dealer", "role": "4"},
{"key":"anirudha.basu@investmentyogi.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"neerajkumar_india@rediffmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"investorpoint@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"kishore@investorshoppe.com", "value": "Managing Director", "role": "0"},
{"key":"jaya@investorshoppe.com", "value": "Managing Director", "role": "0"},
{"key":"kajol2912@hotmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"rup@investrends.in", "value": "Assistant Vice President", "role": "4"},
{"key":"sharad.agrawal@ireo.in", "value": "Corporate Planning and Strategy", "role": "0"},
{"key":"gargakhil@hotmail.com", "value": "Visiting Faculty", "role": "4"},
{"key":"ishwar.fin@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"mnagaria@yahoo.com", "value": "Director - Products", "role": "3"},
{"key":"bhupindra.rawat@itc.in", "value": "Manager", "role": "4"},
{"key":"krutikamistry86@gmail.com", "value": "Manager", "role": "4"},
{"key":"corporate@ivycapventures.com", "value": "Managing Partner", "role": "0"},
{"key":"manoj.laddha@jrladdha.in", "value": "Owner and Managing Director", "role": "0"},
{"key":"r.kumar@jrladdha.in", "value": "Head - Money Market", "role": "4"},
{"key":"rajiv.dhandhania@jrladdha.in", "value": "Assistant Vice President", "role": "4"},
{"key":"s.iyer@jrladdha.in", "value": "Associate Director", "role": "4"},
{"key":"jaygandhi@jsalaw.com", "value": "none", "role": "4"},
{"key":"aashit@jsalaw.com", "value": "Partner", "role": "4"},
{"key":"divyanshu.pandey@jsalaw.com", "value": "none", "role": "4"},
{"key":"jay_deputy@rediffmail.com", "value": "Owner", "role": "4"},
{"key":"jyoti@jsalaw.com", "value": "Founder", "role": "4"},
{"key":"jcv786@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"jainconsultancy.rjt@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jainanshul.1985@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jaininv2001@gmail.com", "value": "Karta", "role": "4"},
{"key":"dinesh@jaininvestment.com", "value": "AVP - Private Client Group", "role": "4"},
{"key":"royceton@jaininvestment.com", "value": "AVP - Private Client Group", "role": "4"},
{"key":"vjx@jaininvestment.com", "value": "Advisory", "role": "4"},
{"key":"viral@jainwealthmanagers.com", "value": "Financial Advisor", "role": "4"},
{"key":"punit.jain@jainmatrix.com", "value": "Founder & CEO", "role": "0"},
{"key":"aj031974@gmail.com", "value": "Propreitor", "role": "4"},
{"key":"jjsbc_jal@sancharnet.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"jasmin_pb@rediffmail.com", "value": "Proprieter", "role": "4"},
{"key":"parikhjas@yahoo.co.in", "value": "Financial Consultant", "role": "4"},
{"key":"jaykap2003@yahoo.com", "value": "Sole Proprietor", "role": "4"},
{"key":"chetan@jeetay.com", "value": "Managing Director & Chief Investment Officer", "role": "5"},
{"key":"pankaj.jain@jerseyfinance.je", "value": "Business Development Head", "role": "2"},
{"key":"kapil.dua@jerseyfinance.je", "value": "Business Development - India", "role": "2"},
{"key":"Chandu@mail.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"ipomf@jhaveritrade.com", "value": "Director", "role": "4"},
{"key":"jigish.bsli@gmail.com", "value": "Consultant", "role": "4"},
{"key":"joellionel@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"joellionel@gmail.com", "value": "Manager", "role": "4"},
{"key":"india_kalpana@yahoo.ca", "value": "Analyst", "role": "3"},
{"key":"gauri.desai@jmfl.com", "value": "Senior Associate - Marketing", "role": "2"},
{"key":"aket.dingal@jmfl.com", "value": "Associate Vice President-Information Technology", "role": "4"},
{"key":"vikram.shetty@jmfl.com", "value": "Head-Finance and Accounts", "role": "7"},
{"key":"harish.kukreja@jmfinancial.in", "value": "Head-Investor Services,  Banking Operations & Settlement", "role": "7"},
{"key":"sanjay.chhabaria@jmfl.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"chaitanya.choksi@jmfl.com", "value": "Fund Manager-Derivaties", "role": "5"},
{"key":"asit@jmfinancial.in", "value": "Fund Manager - Equity", "role": "5"},
{"key":"shalini@jmfinancial.in", "value": "Head of Fixed Income", "role": "5"},
{"key":"bhanu@jmfinancial.in", "value": "MD & CEO", "role": "0"},
{"key":"vipul.jhaveri@jmfl.com", "value": "Executive Director & Chief Operating Officer", "role": "1"},
{"key":"rohit.singh@jmfinancial.in", "value": "Executive Director", "role": "1"},
{"key":"sapna.joshi@jmfinancial.in", "value": "Director", "role": "4"},
{"key":"jiten.tanna@jmfinancial.in", "value": "Associate Director", "role": "4"},
{"key":"vipul.shah@jmfl.com", "value": "Executive Director Head - Private Wealth Group Financial SErvices", "role": "1"},
{"key":"Gokul.k@jocata.com", "value": "Business Development Manager", "role": "2"},
{"key":"prashant.muddu@jocata.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"rahil.fernandes@ap.jll.com", "value": "Senior Executive", "role": "1"},
{"key":"mridul.upreti@sfg.jll.com", "value": "CEO - Segregated Funds Group", "role": "0"},
{"key":"Isha.Kapila@sfg.jll.com", "value": "Marketing and Communication Segregated Funds Group", "role": "2"},
{"key":"subhankar.mitra@ap.jll.com", "value": "Strategic Consulting (West)", "role": "5"},
{"key":"Ashutosh.limaye@ap.jll.com", "value": "Head of Research & Real Estate Intelligence Service", "role": "3"},
{"key":"ramesh.nair@ap.jll.com", "value": "Chief Operating Officer - Business", "role": "0"},
{"key":"swatiyj@gmail.com", "value": "Properitor", "role": "4"},
{"key":"thakkar.pranav@rediffmail.com", "value": "Corporate and Business Strategy Associate", "role": "4"},
{"key":"mansi.t.desai@jpmorgan.com", "value": "none", "role": "4"},
{"key":"pgrprasad@hotmail.com", "value": "Director", "role": "4"},
{"key":"farrokh.bharucha@jpmorgan.com", "value": "Company Secretary & Compliance Officer", "role": "4"},
{"key":"mayur.dharamshi@jpmorgan.com", "value": "Dealer", "role": "4"},
{"key":"nandkumar.r.surti@jpmorgan.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"hrushikesh.x.kar@jpmchase.com", "value": "none", "role": "4"},
{"key":"sanjeevgkumar.cfp@gmail.com", "value": "Head of Operations and Technology", "role": "7"},
{"key":"jituspdm@gmail.com", "value": "Founder", "role": "4"},
{"key":"suprio.bose@jclex.com", "value": "Advocate", "role": "4"},
{"key":"choradia@gmail.com", "value": "CFP", "role": "4"},
{"key":"invins@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"khetani@vsnl.net", "value": "Proprietor", "role": "4"},
{"key":"anil@ksinvestments.com", "value": "Partner", "role": "4"},
{"key":"sasha@kae-capital.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"jetu.lalvani@kaizenpe.com", "value": "Executive Director", "role": "1"},
{"key":"akhil.shahani@kaizenpe.com", "value": "Director", "role": "4"},
{"key":"sandeep.aneja@kaizenpe.com", "value": "Founder / Managing Director", "role": "0"},
{"key":"aditya@kalpatarumulti.com", "value": "Director/Partner", "role": "4"},
{"key":"savita@kalpatarumulti.com", "value": "Director", "role": "4"},
{"key":"vijay.kankaria@gmail.com", "value": "Propreitor", "role": "4"},
{"key":"chandsy@rediffmail.com", "value": "Treasury Manager", "role": "4"},
{"key":"amit@karmayog-knowledge.com", "value": "Founder & Trainer", "role": "4"},
{"key":"karthikcfp@gmail.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"swapnil.pawar@karvy.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"murtuza.baranwala@karvy.com", "value": "Business Development Manager", "role": "2"},
{"key":"jharna.agarwal@karvy.com", "value": "Associate Vice President - Products", "role": "3"},
{"key":"anandms@karvy.com", "value": "General Manager - Investor Relations", "role": "4"},
{"key":"nehajjw@gmail.com", "value": "Team Leader", "role": "4"},
{"key":"sunil.mishra@karvy.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"satinder.aggarwal@karvy.com", "value": "Team Leader - Electus", "role": "4"},
{"key":"srini.v@karvy.com", "value": "Head - Operations", "role": "7"},
{"key":"deepak.vazirani@karvy.com", "value": "Head - Wealth Management West & South", "role": "4"},
{"key":"ngirglani@gmail.com", "value": "Client Acquisition Analyst", "role": "3"},
{"key":"ramapriyanpb@karvy.com", "value": "none", "role": "4"},
{"key":"surendarreddyp@yahoo.co.in", "value": "Asst Manager", "role": "4"},
{"key":"kcgala9@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"devadatta.rajadhyaksha@kedaara.com", "value": "Financial Controller", "role": "4"},
{"key":"keynote@nribanks.com", "value": "Director", "role": "4"},
{"key":"bijal.ajinkya@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"daksha.baxi@khaitanco.com", "value": "Accountant/Tax Advisor", "role": "10"},
{"key":"ajay.bhargava@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"bharat.anand@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"arvind.jhunjhunwala@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"padam.khaitan@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"rajiv.khaitan@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"rabindra.jhunjhunwala@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"haigreve.khaitan@khaitanco.com", "value": "Partner", "role": "4"},
{"key":"sunil@khambattasecurities.com", "value": "Director", "role": "4"},
{"key":"satish@khambattasecurities.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"abhishek@kharelegalchambers.com", "value": "Partner", "role": "4"},
{"key":"rajiv.choksey@krchoksey.com", "value": "Director", "role": "4"},
{"key":"ramesh.choksey@krchoksey.com", "value": "Directors", "role": "4"},
{"key":"kisan.choksey@krchoksey.com", "value": "Chairman", "role": "0"},
{"key":"deven.choksey@krchoksey.com", "value": "Managing Director", "role": "0"},
{"key":"kishore.kewalramani@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"amitabh.chakraborty@kitaracapital.com", "value": "Managing Director & Chief Investments Officer", "role": "5"},
{"key":"mukesh.1231@gmail.com", "value": "Associate", "role": "4"},
{"key":"naozad.sirwalla@kkr.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"mohishinvest360@gmail.com", "value": "CFPCM practitioner", "role": "4"},
{"key":"francisadams2012@gmail.com", "value": "Editor/Writer/Blogger/Social Media Influencer", "role": "4"},
{"key":"manish@knowledgepartners.in", "value": "Financial Planner", "role": "4"},
{"key":"skthukral@knowledgeplatform.com", "value": "Learning Solutions", "role": "4"},
{"key":"dharia24@hotmail.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"knpspl@rediffmail.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"knsconsultingpvtltd@gmail.com", "value": "none", "role": "4"},
{"key":"bhaveshjhala@kongruentfs.com", "value": "none", "role": "4"},
{"key":"purnenduray3003@yahoo.com", "value": "Advisor", "role": "4"},
{"key":"virat.diwanji@kotak.com", "value": "Executive Vice President & Head Branch Banking", "role": "1"},
{"key":"hari.krishna@kotak.com", "value": "Director - Realty Fund", "role": "4"},
{"key":"ramakrishna.kv@kotak.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"vikas.chimakurthy@kotak.com", "value": "Director - Realty Fund", "role": "4"},
{"key":"varis_sayed@yahoo.com", "value": "Manager", "role": "4"},
{"key":"yujvendra.chandel@gmail.com", "value": "Training Manager", "role": "4"},
{"key":"ipankaj.thakare@gmail.com", "value": "Asset Manager", "role": "4"},
{"key":"kdaver@kotak.com", "value": "Vice President and Head -Marketing", "role": "2"},
{"key":"Jagruti.Shah@kotak.com", "value": "Marketing Manager", "role": "2"},
{"key":"sandeep.kamath@kotak.com", "value": "Senior Manager - Compliance", "role": "4"},
{"key":"nipun_malik@yahoo.com", "value": "Assistant Vice President", "role": "4"},
{"key":"pankaj.tibrewal@kotak.com", "value": "Fund Manager", "role": "5"},
{"key":"ovas.bakshi@kotak.com", "value": "Associate Vice President-Head Retail sales", "role": "2"},
{"key":"Harsha.Upadhyaya@kotak.com", "value": "Head of Equities", "role": "4"},
{"key":"abhishek.bisen@kotak.com", "value": "Fund Manager", "role": "5"},
{"key":"deepak.g@kotak.com", "value": "Analyst", "role": "5"},
{"key":"deepak.agrawal@kotak.com", "value": "Fund Manager", "role": "5"},
{"key":"krishnan.ramchandran@kotak.com", "value": "Portfolio Manager", "role": "4"},
{"key":"lakshmi.iyer@kotak.com", "value": "Vice President & Head ëV Products", "role": "6"},
{"key":"poonam.bajaj@kotak.com", "value": "Manager", "role": "4"},
{"key":"hitesh.jain@kotak.com", "value": "Manager", "role": "4"},
{"key":"sandeep.sharma@kotak.com", "value": "VP", "role": "4"},
{"key":"vivin.tauro@kotak.com", "value": "Manager", "role": "4"},
{"key":"gaurang.shah@kotak.com", "value": "President of Asset Management and Life Insurance", "role": "4"},
{"key":"parikhparesh@rediffmail.com", "value": "Manager Sales", "role": "2"},
{"key":"rahul.bhattacharyya@kotak.com", "value": "Product Manager - Priority Banking", "role": "3"},
{"key":"premal.desai@kotak.com", "value": "Priority circle manager", "role": "4"},
{"key":"jagdish.nagpal@kotak.com", "value": "Senior Privy Relationship Manager", "role": "4"},
{"key":"kumar.pankaj@kotak.com", "value": "Senior Relationship Manager", "role": "4"},
{"key":"chetan.desai@kotak.com", "value": "Head of Tax", "role": "1"},
{"key":"neeraj.aggarwal@kotak.com", "value": "Associate Vice President - Estate Planner", "role": "4"},
{"key":"kunal.bang@kotak.com", "value": "Chief Manager", "role": "4"},
{"key":"nitin.shanbhag@kotak.com", "value": "Associate Vice President", "role": "4"},
{"key":"aashika.agarwal@gmail.com", "value": "Assistant Vice President", "role": "4"},
{"key":"arun.n@kotak.com", "value": "Derivatives", "role": "4"},
{"key":"havovi.patel@kotak.com", "value": "Manager - Corporate Investment Products", "role": "3"},
{"key":"uday.kotak@kotak.com", "value": "Executive Vice Chairman & Managing Director", "role": "0"},
{"key":"karthi.marshan@kotak.com", "value": "Head Marketing", "role": "2"},
{"key":"bina.chandarana@kotak.com", "value": "Company Secretary & Executive Vice President", "role": "1"},
{"key":"arvind.kathpalia@kotak.com", "value": "Group Head - Risk", "role": "4"},
{"key":"shyam.sunder@kotak.com", "value": "Group Head Compliance", "role": "4"},
{"key":"tanveer.monga@kotak.com", "value": "Vice President - Wealth Management", "role": "4"},
{"key":"anil.mirani@kotak.com", "value": "Chief Manager - Client Relations - Priority Banking", "role": "4"},
{"key":"vaibhav.machhi@kotak.com", "value": "none", "role": "4"},
{"key":"nirav.vajani@kotak.com", "value": "Vice President - Priority Banking", "role": "4"},
{"key":"Tejal.shah@kotak.com", "value": "Vice President - Client Relations", "role": "4"},
{"key":"Rajesh.Nambiar@kotak.com", "value": "Associate Vice President", "role": "4"},
{"key":"Rukshana.Mahudawala@kotak.com", "value": "none", "role": "4"},
{"key":"Vodhi.Chakravartty@kotak.com", "value": "Vice President-Client relations", "role": "4"},
{"key":"Akash.Hariani@kotak.com", "value": "none", "role": "4"},
{"key":"prashant.mevawala@kotak.com", "value": "Vice President & Area Manager Branch Banking", "role": "2"},
{"key":"amul.sharma@kotak.com", "value": "Vice President & Regional Business Manager", "role": "4"},
{"key":"manish.kathuria@kotak.com", "value": "Zonal Business Manager - West - Privy League", "role": "4"},
{"key":"ashish.khetan@kotak.com", "value": "Executive Vice President", "role": "1"},
{"key":"manishbansals@yahoo.co.in", "value": "none", "role": "4"},
{"key":"nihal.shah@kotak.com", "value": "Chief Manager - Investment Advisory", "role": "5"},
{"key":"supreet.singh@kotak.com", "value": "Vice President Human Resources", "role": "8"},
{"key":"hemant.shah@kotak.com", "value": "Head - Retail Operations", "role": "7"},
{"key":"countryhead.consumer@kotak.com", "value": "Country Head - Consumer Banking", "role": "4"},
{"key":"priyanka.neogi@kotak.com", "value": "Associate Vice President-Investment Products", "role": "3"},
{"key":"saurabh.rungta@kotak.com", "value": "Vice President - Products", "role": "3"},
{"key":"kamlesh.rao@kotak.com", "value": "Executive Vice President & Head - Priority Banking", "role": "1"},
{"key":"c.jayaram@kotak.com", "value": "Joint Managing director", "role": "0"},
{"key":"aruna.rao@kotak.com", "value": "Chief Technology Officer", "role": "4"},
{"key":"rohit.garg@kotak.com", "value": "Vice President-Structured Products and Investments", "role": "3"},
{"key":"saji.pulikan@kotak.com", "value": "Regional Head", "role": "4"},
{"key":"shanti.ekambaram@kotak.com", "value": "President - Corporate & Investment Banking", "role": "5"},
{"key":"shahpriyanka@yahoo.com", "value": "Senior Vice President", "role": "4"},
{"key":"abhijit.vaidya@kotak.com", "value": "Executive Director", "role": "1"},
{"key":"srini.wasan@kotak.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"kaynaan.shums@kotak.com", "value": "Institutional Sales", "role": "2"},
{"key":"manish.jain@kotak.com", "value": "Structured Products", "role": "3"},
{"key":"murtuza.arsiwalla@kotak.com", "value": "none", "role": "4"},
{"key":"rohit.chordia@kotak.com", "value": "Analyst", "role": "5"},
{"key":"kawaljeet.saluja@kotak.com", "value": "Associate Director & Head of Research", "role": "4"},
{"key":"ravi.iyer@kotak.com", "value": "Executive Director", "role": "0"},
{"key":"sanjeev.prasad@kotak.com", "value": "Executive Director", "role": "0"},
{"key":"kanchi.gandhi@kotak.com", "value": "Associate Vice President - Estate Planning", "role": "4"},
{"key":"kjain270384@gmail.com", "value": "Deputy Manager", "role": "4"},
{"key":"gautami.gavankar@kotak.com", "value": "Principal Advisor - Estate Planning", "role": "3"},
{"key":"reena.shetty@kotak.com", "value": "Vice President - Human Resources", "role": "8"},
{"key":"harita.desai@kotak.com", "value": "Associate Vice President - Marketing", "role": "2"},
{"key":"jaideep.hansraj@kotak.com", "value": "Head of Private Wealth Management", "role": "0"},
{"key":"oisharya.das@kotak.com", "value": "Head West Zone", "role": "4"},
{"key":"rajesh.s.iyer@kotak.com", "value": "Executive Vice President and Head- Investments and Family Office", "role": "5"},
{"key":"anilp@kpitcummins.com", "value": "Vice President & Head - Corporate Finance & Governance", "role": "4"},
{"key":"hiten@kpmg.com", "value": "Co-Head - Tax & Partner & Head - Mergers & Acquisitions", "role": "4"},
{"key":"naveenfern@gmail.com", "value": "Head of Institutional Brokerage", "role": "4"},
{"key":"dileep.kulkarni@hotmail.com", "value": "Founder Partner", "role": "4"},
{"key":"kumar_vipin_2000@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"rajan@kwwealthadvisors.com", "value": "Director", "role": "4"},
{"key":"shujasiddiqui@ltcapitalindia.in", "value": "Head - Products & Advisory", "role": "3"},
{"key":"Manoj.shenoy@ltcapitalindia.in", "value": "none", "role": "0"},
{"key":"Jayesh.Faria@ltcapitalindia.in", "value": "Business Head - Premier Wealth Management", "role": "0"},
{"key":"surajs@lntmf.com", "value": "Manager", "role": "4"},
{"key":"birens@lntmf.com", "value": "Head of Corporate Communications", "role": "2"},
{"key":"ShirazR@lntmf.com", "value": "Assistant Manager - Marketing", "role": "2"},
{"key":"vinodv@lntmf.com", "value": "Head of Operations", "role": "7"},
{"key":"jayanthjavalagi@gmail.com", "value": "Manager", "role": "4"},
{"key":"rajeshp@lntmf.com", "value": "Fund Manager", "role": "5"},
{"key":"vikramc@lntmf.com", "value": "Fund Manager", "role": "5"},
{"key":"venugopalm@lntmf.com", "value": "Vice President & Co Head - Equity Investments", "role": "5"},
{"key":"ankurt@lntmf.com", "value": "National Head - Sales and Distribution", "role": "2"},
{"key":"rajeshi@lntmf.com", "value": "Channel Co-head - Global Banks & National Alliances", "role": "4"},
{"key":"ashu.suyash@lntmf.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"kailash@lntmf.com", "value": "Chief Business Officer", "role": "0"},
{"key":"preksha_27@yahoo.co.in", "value": "Financial Planner", "role": "4"},
{"key":"labhtradex@yahoo.com", "value": "Manager", "role": "4"},
{"key":"ladder7@gmail.com", "value": "Principal Financial Planner", "role": "4"},
{"key":"raghvendra.nath@ladderup.com", "value": "Managing Director", "role": "0"},
{"key":"p.pankaj28386@gmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"ramadharc@yahoo.com", "value": "Associate Professor", "role": "4"},
{"key":"gdalmia@landmarkholdings.in", "value": "Managing Director & CEO", "role": "0"},
{"key":"vishalsinha75@gmail.com", "value": "Operations Executive", "role": "7"},
{"key":"darshitshah@leadercare.in", "value": "Director", "role": "4"},
{"key":"rohan@leapgrowth.com", "value": "Partner", "role": "4"},
{"key":"samudra.sen@learningmate.com", "value": "none", "role": "4"},
{"key":"legaleye.india@gmail.com", "value": "Partner", "role": "4"},
{"key":"corporate@leveragecp.com", "value": "Executive Director", "role": "1"},
{"key":"nilesh.sathe@licnomuramf.com", "value": "Managing Director", "role": "0"},
{"key":"mohanmdu@hotmail.com", "value": "Development Officer", "role": "4"},
{"key":"siddharthvipula@rediffmail.com", "value": "Insurance", "role": "4"},
{"key":"ajayfp07@gmail.com", "value": "Development Officer", "role": "4"},
{"key":"sanjaysanghavi@live.com", "value": "Developement Officer", "role": "4"},
{"key":"vipul213@gmail.com", "value": "Advisor", "role": "4"},
{"key":"vishalgawand@gmail.com", "value": "Agent", "role": "4"},
{"key":"vbrai2000@yahoo.com", "value": "Chief Life Insurance Advisor", "role": "4"},
{"key":"pradeepksawant@yahoo.co.in", "value": "Agent", "role": "4"},
{"key":"upenkg@yahoo.com", "value": "Development Officer", "role": "4"},
{"key":"sklala@hotmail.com", "value": "Insurance Agent", "role": "4"},
{"key":"satishmanjure@gmail.com", "value": "Development Officer", "role": "4"},
{"key":"spkubde@yahoo.co.in", "value": "Insurance Advisor", "role": "4"},
{"key":"sangeetavaryani@gmail.com", "value": "Developement Officer", "role": "4"},
{"key":"sshetty2007@yahoo.co.in", "value": "Insurance Advisor", "role": "4"},
{"key":"sachingupta24@yahoo.com", "value": "Advisor", "role": "4"},
{"key":"rajivshally@hotmail.com", "value": "Supervisor", "role": "4"},
{"key":"rsnprasanna@hotmail.com", "value": "Development Officer", "role": "4"},
{"key":"maheshlmotwani@yahoo.co.in", "value": "Agent", "role": "4"},
{"key":"nbr3782@yahoo.com", "value": "Agent", "role": "4"},
{"key":"niravdeep@rediffmail.com", "value": "Agent", "role": "4"},
{"key":"naveen197923@yahoo.co.in", "value": "Financial Advisor", "role": "4"},
{"key":"sindheent@yahoo.com", "value": "Legal Manager", "role": "4"},
{"key":"kagur64@gmail.com", "value": "Development Officer", "role": "4"},
{"key":"nagarajk_dvg@rediffmail.com", "value": "Advisor", "role": "4"},
{"key":"kanchan.ubale@gmail.com", "value": "Development Officer", "role": "4"},
{"key":"ganesh.sherkhane8@gmail.com", "value": "Agent", "role": "4"},
{"key":"masterschetan@gmail.com", "value": "Agent", "role": "4"},
{"key":"ajn_bkg@rediffmail.com", "value": "Development Officer", "role": "4"},
{"key":"tsapadmanabhan@yahoo.co.in", "value": "Insurance Advisor", "role": "4"},
{"key":"aswath947@yahoo.com", "value": "Developement Officer", "role": "4"},
{"key":"ajit_2amintoroad@yahoo.co.in", "value": "Chairmans Club Member", "role": "4"},
{"key":"ganjaneyaprasad@yahoo.com", "value": "Branch Manager Legal Officer", "role": "4"},
{"key":"absonegara@yahoo.co.in", "value": "Agent", "role": "4"},
{"key":"rrsiddiqui@hotmail.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"masilamani53@yahoo.co.in", "value": "Divisional Manager(retd)", "role": "4"},
{"key":"aharvande@gmail.com", "value": "Agent", "role": "4"},
{"key":"devarchana72@hotmail.com", "value": "none", "role": "4"},
{"key":"balvir@life-lite.com", "value": "Chief Financial Architect", "role": "4"},
{"key":"abhayparekh_1977@yahoo.co.in", "value": "Financial Coach", "role": "4"},
{"key":"r.karthik@lodhagroup.com", "value": "Chief Marketing Officer", "role": "2"},
{"key":"subba@lotuspoolcapital.com", "value": "Founder and Managing Partner", "role": "0"},
{"key":"jainlokesh82@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"kediaanand@vsnl.net", "value": "Partner", "role": "4"},
{"key":"mukeshbba@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"ajaipurwar@gmail.com", "value": "Distributor", "role": "4"},
{"key":"nagpalharish@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"viralshah999@gmail.com", "value": "Finacial Advisor", "role": "4"},
{"key":"adv.uday53@gmail.com", "value": "Finance and Accounts", "role": "1"},
{"key":"verma.neeraj2@mahindra.com", "value": "Head - Compliance Mutual Funds", "role": "4"},
{"key":"manoj@mainstream.co.in", "value": "Director and Chief Financial Planner", "role": "4"},
{"key":"sumeet.nagar@malabarinvest.com", "value": "Managing Partner", "role": "0"},
{"key":"akshay.mansukhani@malabarinvest.com", "value": "Partner", "role": "4"},
{"key":"mstumkur@gmail.com", "value": "Managing Partner and Principal Financial Planner", "role": "4"},
{"key":"aditspace@gmail.com", "value": "Assistant", "role": "4"},
{"key":"sonesh_dedhia@hotmail.com", "value": "Partner", "role": "4"},
{"key":"mangsidh@gmail.com", "value": "Managing Director", "role": "0"},
{"key":"emani@manimatters.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"ruteshraval@yahoo.com", "value": "Managing Director", "role": "0"},
{"key":"aruj@marsmillennium.com", "value": "Senior Consultant", "role": "4"},
{"key":"mksingal1@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"leena_chheda@yahoo.co.in", "value": "Partner", "role": "4"},
{"key":"shailesh.singh@maxlifeinsurance.com", "value": "Chief People Officer", "role": "7"},
{"key":"vishal.rijia@kotak.com", "value": "Customer Relationship Officer", "role": "4"},
{"key":"sandhyamaradi@yahoo.com", "value": "Agent Advisor", "role": "4"},
{"key":"abhi.raja@gmail.com", "value": "Sales Associate", "role": "2"},
{"key":"Abhinav.Rahul@maxlifeinsurance.com", "value": "Corporate Vice President - Corporate Communications", "role": "2"},
{"key":"Sehgal.Sumit@maxlifeinsurance.com", "value": "Corporate Vice President - Marketing", "role": "2"},
{"key":"anisha.motwani@maxlifeinsurance.com", "value": "Director and Chief Marketing Officer", "role": "2"},
{"key":"prashant.tripathy@maxlifeinsurance.com", "value": "Chief Financial Officer", "role": "7"},
{"key":"ashish.vohra@maxlifeinsurance.com", "value": "Senior Director and Chief Distribution Officer", "role": "4"},
{"key":"rajesh.sud@maxlifeinsurance.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"anshumangarg@rediffmail.com", "value": "Manager Training", "role": "4"},
{"key":"prakash.praharaj@gmail.com", "value": "Proprietor and Chief Financial Planner", "role": "4"},
{"key":"naveen_tahilyani@mckinsey.com", "value": "Director", "role": "4"},
{"key":"alok_kshirsagar@mckinsey.com", "value": "Director", "role": "4"},
{"key":"jatin_pant@mckinsey.com", "value": "Partner", "role": "4"},
{"key":"roopank.chaudhary@aonhewitt.com", "value": "Director", "role": "0"},
{"key":"vwaghule@yahoo.com", "value": "Accounts Manager", "role": "7"},
{"key":"lionel.andrade@mentorcap.net", "value": "none", "role": "4"},
{"key":"madhur@meramoney.in", "value": "Managing Director", "role": "0"},
{"key":"Shanthi.Naresh@mercer.com", "value": "Principal Consultant", "role": "4"},
{"key":"aumerchaant@miconline.co.in", "value": "Director", "role": "4"},
{"key":"ruth.saldanha@mergermarket.com", "value": "Financial Reporter", "role": "4"},
{"key":"sundara.rajan@baml.com", "value": "Country Compliance Manager", "role": "4"},
{"key":"pavit.chadha@juliusbaer.com", "value": "Associate Director", "role": "4"},
{"key":"varadaraya_mallya@juliusbaer.com", "value": "Director DSP ML Trust Services", "role": "4"},
{"key":"sarwate.prasad@gmail.com", "value": "Senior Private Wealth Associate", "role": "4"},
{"key":"sanjay.bhuwania@juliusbaer.com", "value": "Director", "role": "4"},
{"key":"michelle_baptist@ml.com", "value": "none", "role": "4"},
{"key":"mehul.marfatia@juliusbaer.com", "value": "Assistant Vice President", "role": "4"},
{"key":"adityavikram.dube@juliusbaer.com", "value": "Associate Director - investments", "role": "3"},
{"key":"siddharth_mishra@juliusbaer.com", "value": "Director - Investments", "role": "3"},
{"key":"asingh06@gmail.com", "value": "Managing Director and Head Global Wealth & Investment Management", "role": "0"},
{"key":"nikhil.samant@juliusbaer.com", "value": "Director - Technology", "role": "7"},
{"key":"satwick@yahoo.com", "value": "Managing Director - Global Investment Solutions", "role": "5"},
{"key":"chirag.gokani@juliusbaer.com", "value": "Vice President - Global Wealth Management Technology", "role": "7"},
{"key":"Managing", "value": "Director - Warmond Trustees", "role": "0"},
{"key":"METLIFEPRASANNA@GMAIL.COM", "value": "Financial Planner", "role": "4"},
{"key":"adarshns001@yahoo.co.in", "value": "Senior Sales Manager", "role": "2"},
{"key":"manojvchawla@yahoo.com", "value": "Chief Manager", "role": "4"},
{"key":"raman_7a@rediffmail.com", "value": "Channel Sales Manager", "role": "2"},
{"key":"swatiagarwal21@hotmail.com", "value": "Financial Planning Head", "role": "4"},
{"key":"ranawat_ms@yahoo.co.in", "value": "Branch Manager", "role": "4"},
{"key":"michaelpduarte@gmail.com", "value": "Owner", "role": "4"},
{"key":"shujatali25@gmail.com", "value": "Private Banking Consultant", "role": "4"},
{"key":"vinayakwagh2005@rediffmail.com", "value": "Propreitor", "role": "4"},
{"key":"hase6153@yahoo.co.in", "value": "Financial Consultant", "role": "4"},
{"key":"marcom@milessoft.com", "value": "Manager", "role": "4"},
{"key":"tanmay.parmekar@gmail.com", "value": "Associate Manager Marketing", "role": "2"},
{"key":"tanmay.parmekar@milessoft.com", "value": "Associate Manager Marketing", "role": "2"},
{"key":"vinay.tiwari@milessoft.com", "value": "Sales Manager", "role": "2"},
{"key":"nithya.mahesh@milessoft.com", "value": "Assistant Vice President - Marketing", "role": "2"},
{"key":"Sandeep.lalwani@milessoft.com", "value": "Business Development", "role": "2"},
{"key":"milan@milessoft.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"ajay.aswani@milestonecapital.in", "value": "Sr Manager", "role": "4"},
{"key":"navin@milestonecapital.in", "value": "Executive Director - Fund Raising & Investor Relations", "role": "1"},
{"key":"ved@milestonecapital.in", "value": "CEO & Managing Director", "role": "0"},
{"key":"surajit@milestonecapital.in", "value": "Head - Brand Communications", "role": "2"},
{"key":"SURAJ@MONEYFACTOR.NET", "value": "Partner", "role": "4"},
{"key":"info@milestonecapital.in", "value": "CEO", "role": "0"},
{"key":"anand@mfl.in", "value": "Founder", "role": "4"},
{"key":"kpkrishnan@nic.in", "value": "Joint Secretary,  Department of Economic Affairs", "role": "0"},
{"key":"rsingh@nic.in", "value": "Joint Secretary (Revenue)", "role": "0"},
{"key":"cea@nic.in", "value": "Chief Economic Advisor", "role": "4"},
{"key":"kayezad.a@livemint.com", "value": "Senior Journalist", "role": "4"},
{"key":"shah.vaibhav@miraeasset.com", "value": "Head - Product", "role": "6"},
{"key":"ritesh.patel@miraeassetmf.co.in", "value": "Head - Compliance & Company Secretary", "role": "7"},
{"key":"surbhi.shweta@miraeassetmf.co.in", "value": "Head-Human Resource", "role": "7"},
{"key":"thakkar.prashant@miraeassetmf.co.in", "value": "Head - Information Technology", "role": "7"},
{"key":"neelesh.surana@miraeassetmf.co.in", "value": "Head of Equity", "role": "5"},
{"key":"agrawal.gopal@miraeassetmf.co.in", "value": "Chief Investment Officer", "role": "5"},
{"key":"vvsvaibhav@yahoo.com", "value": "Assistant Vice President -Products", "role": "6"},
{"key":"mohanty.swarup@miraeassetmf.co.in", "value": "Head - Sales", "role": "2"},
{"key":"jisang.yoo@miraeassetmf.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"gyandeep_mishra@yahoo.co.in", "value": "Sales Manager", "role": "2"},
{"key":"ankur.executive@gmail.com", "value": "Manager", "role": "4"},
{"key":"smittal@mittaladvisors.com", "value": "Director", "role": "4"},
{"key":"divya.dayal@mizuho-cb.com", "value": "Chief Executive Officer - India", "role": "0"},
{"key":"umesh.cfp@gmail.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"anuraag.gupta@gmail.com", "value": "Head - Research", "role": "4"},
{"key":"g_thiaga_rajan@yahoo.com", "value": "Proporeitor", "role": "4"},
{"key":"mokshco@gmail.com", "value": "Director", "role": "4"},
{"key":"anup@moneyhoney.co.in", "value": "Director", "role": "4"},
{"key":"moneeykare@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"viralbhatt@gmail.com", "value": "sole propritor", "role": "4"},
{"key":"tejalgandhi01@yahoo.com", "value": "Founder and Chief Executive Officer", "role": "1"},
{"key":"gautam@moneymatterz.co.in", "value": "Financial Planner", "role": "4"},
{"key":"ajaykinjawadekar@yahoo.co.in", "value": "Proprieor", "role": "4"},
{"key":"dhirensshah@gmail.com", "value": "Managing Director", "role": "0"},
{"key":"ydjoshi@yahoo.com", "value": "Director", "role": "4"},
{"key":"harishbarke@gmail.com", "value": "Sales Manager", "role": "2"},
{"key":"nisreen.mamaji@gmail.com", "value": "none", "role": "4"},
{"key":"gautam@monsooncapital.com", "value": "Founder and Senior Managing Director", "role": "0"},
{"key":"chetan.modi@moodys.com", "value": "Representative Director", "role": "0"},
{"key":"nikita.more@morningstar.com", "value": "Head of Marketing", "role": "2"},
{"key":"dhruva.chatterji@morningstar.com", "value": "Senior Research Analyst", "role": "5"},
{"key":"atul.sharma@morningstar.com", "value": "ISS-Sales Specialist", "role": "2"},
{"key":"kalpesh.shah@morningstar.com", "value": "Manager", "role": "4"},
{"key":"deepak.khurana@morningstar.com", "value": "Sales Director", "role": "2"},
{"key":"ashutosh@mosaiccap.com", "value": "Director", "role": "4"},
{"key":"sameerkamath@motilaloswal.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"dhruv.muni@motilaloswal.com", "value": "Assistant Vice President - Corporate Planning", "role": "4"},
{"key":"ddramanathan@hotmail.com", "value": "National Head - sales & dist", "role": "2"},
{"key":"charles.nadar@motilaloswal.com", "value": "Manager- Marketing", "role": "2"},
{"key":"taher.badshah@motilaloswal.com", "value": "Senior VP & Co-Head of Equities", "role": "4"},
{"key":"chandrakant.soni@motilaloswal.com", "value": "Vice President - Sales & Distribution", "role": "2"},
{"key":"abhishek.agrawal@motilaloswal.com", "value": "Senior Manager - Sales & Distribution", "role": "2"},
{"key":"akhil.chaturvedi@motilaloswal.com", "value": "Senior Vice President & Head - Sales and Distribution", "role": "2"},
{"key":"aashishps@motilaloswal.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"vishalt@motilaloswal.com", "value": "Director & CEO", "role": "0"},
{"key":"vishal.mhaiskar@motilaloswal.com", "value": "Associate Vice President", "role": "4"},
{"key":"ashish.shanker@motilaloswal.com", "value": "Head - Investment Advisory", "role": "5"},
{"key":"amit.dassani@motilaloswal.com", "value": "Deputy Head - Investment Advisory", "role": "5"},
{"key":"mukeshnpunjabi@gmail.com", "value": "Vice President", "role": "4"},
{"key":"dhavalkapadia@gmail.com", "value": "Manager", "role": "4"},
{"key":"godsbounty@rediffmail.com", "value": "Compliance and Internal Audit", "role": "4"},
{"key":"rhmehra@gmail.com", "value": "Stock Broking Advisor", "role": "4"},
{"key":"mukesh.punjabi@motilaloswal.com", "value": "Vice President - Wealth Management", "role": "4"},
{"key":"pravin@finanzindia.com", "value": "Financial Planner", "role": "4"},
{"key":"malgonkar@vsnl.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"info@msventures.co.in", "value": "Partner", "role": "4"},
{"key":"hellisdangerous@yahoo.co.in", "value": "Head - Financial Learning Programmes", "role": "4"},
{"key":"welcome@sahayak.com", "value": "Corporate Accounts Executive", "role": "7"},
{"key":"poojarajpalcfp@yahoo.com", "value": "Partner", "role": "4"},
{"key":"mukeshmedal@yahoo.com", "value": "none", "role": "4"},
{"key":"mukeshnvora@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"mansi.desai@multi-act.com", "value": "Client Counsellor", "role": "4"},
{"key":"prakash.nene@multiplesequity.com", "value": "Managing Director", "role": "0"},
{"key":"renuka.ramnath@multiplesequity.com", "value": "Managing Director & CEO", "role": "0"},
{"key":"amitmurarka@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"shreeramadvisors@yahoo.co.in", "value": "Independent Financial Advisor", "role": "4"},
{"key":"apurva@leading-properties.com", "value": "none", "role": "4"},
{"key":"milin.shah@myfinad.com", "value": "Head Financial Planner", "role": "4"},
{"key":"neerajwagh22@yahoo.co.in", "value": "Wealth Advisor", "role": "4"},
{"key":"pravinjain@desaibrothers.com", "value": "Proprietor", "role": "4"},
{"key":"pravinjain@desaibrothers.com", "value": "Proprietor", "role": "4"},
{"key":"mayur24solanki@rediffmail.com", "value": "Director", "role": "4"},
{"key":"pareshashah@vsnl.net", "value": "Proprietor", "role": "4"},
{"key":"pawan.ajay@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"pawan.ajay@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"neogiami@gmail.com", "value": "none", "role": "4"},
{"key":"jshriji2013@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"atulsuchak02@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"hjhurani@gmail.com", "value": "Family Welfare Planner", "role": "4"},
{"key":"hukaka@gmail.com", "value": "Independent Financial Advisor", "role": "4"},
{"key":"anmol_consultancy@yahoo.co.in", "value": "none", "role": "4"},
{"key":"purohitcm1234@yahoo.com", "value": "none", "role": "4"},
{"key":"hkotian15@gmail.com", "value": "none", "role": "4"},
{"key":"jayesh@growrich.in", "value": "none", "role": "4"},
{"key":"manishjhunjhunwala1@gmail.com", "value": "none", "role": "4"},
{"key":"consuultme@gmail.com", "value": "none", "role": "4"},
{"key":"sameerhlalwani@gmail.com", "value": "none", "role": "4"},
{"key":"medicloud@live.com", "value": "Doctor", "role": "4"},
{"key":"67.VIMAL@GMAIL.COM", "value": "Proprietor Member", "role": "4"},
{"key":"resh.dave@gmail.com", "value": "Manager", "role": "4"},
{"key":"priyanksinghvi@live.com", "value": "Consultant", "role": "4"},
{"key":"arvajani@gmail.com", "value": "Managing Director", "role": "0"},
{"key":"acpata@gmail.com", "value": "Director", "role": "4"},
{"key":"shashank_manohar@yahoo.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"abhinavmehta2002@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"abhisheksinghvi2006@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"kabra_adheesh@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"ajay5712@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"ajay7895@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"deshmukh.ajit@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"amitgoel@pacefin.com", "value": "Founder", "role": "4"},
{"key":"pagare.amol@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"anilkhera@investexcel.in", "value": "Proprietor", "role": "4"},
{"key":"ashwani.tiwari@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"sekhar030850@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"vsfinancialadvisors@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"brthakkar111@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"bhavik_udeshi@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"pankajdoshi1982@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"swastik1994@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"birendra.mf@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"bbmarwaha@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"brijesh.damodaran@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"afj1103@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"adaljamehul@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"deepakbaks@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"deepanshu1980@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"difcoinv@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"palani_dhamodar@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"dhanesh1956@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"dilipsahakari@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"dsvayeda@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"dk45939@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"dineshkothawade@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"pavri101@hotmail.com", "value": "Director", "role": "4"},
{"key":"gagan212@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"gauravpatna@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"rathoregautam@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"harjimadhaparia@mail.com", "value": "Proprietor", "role": "4"},
{"key":"hareshjain_1974@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"hareshshah@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"hari_kamat@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"hmginvestment@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"hemant_hirjee@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"hemlatas@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jainy.shah@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"emailtojanki@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"1jayanta@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jaideepdoshi@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"shahnilesh55@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"jennifermendes1@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"kifs123@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"jvshah101@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jkmarwaha@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"premkumarreddy76@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"kunw_2006@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"raminvestdgl@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"mymutualfund@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"manjusk@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"mmotani@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"mtsh_dave@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"mohit@itkolkata.in", "value": "Proprietor", "role": "4"},
{"key":"moneeykare@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"chandrahyd73@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"dokania3@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"mookeshp@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"mayur24solanki@rediffmail.com", "value": "none", "role": "4"},
{"key":"marwaha475@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"naveen_rego@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"neha_ttc@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"mbboda@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"nikhil2557@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"palkesh123@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"paresh@aargus.in", "value": "Proprietor", "role": "4"},
{"key":"parekhinvest@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"g_p_kumar@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"lohana_prakash@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"suduprasad@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"rsrini68@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"hiralic@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"rachitparikh@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"gupta_km@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"amogh7@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"seth.utialigarh@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"rajatb@lycos.com", "value": "Proprietor", "role": "4"},
{"key":"rgandhi.reliance@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"rrjainbrothers@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"pioneerinvest2003@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"viraatfinancial@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"nainanir@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"ram@ashokindia.com", "value": "Proprietor", "role": "4"},
{"key":"raunakroongta@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"ravi@prodigyinvest.com", "value": "Proprietor", "role": "4"},
{"key":"renukajain1@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"rittique@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"riturawat1983@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"maurya_rohan@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"balajiruchi@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"ruchikasuri@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"ryanel_c@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"saibalbiswas11@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"samit_j@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"krushnafinance@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"sanj_chbra@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"satishghia@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jainscapital@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"balajishashank@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"sschilana@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"mutualfundwala@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"cninvestors@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"chhajedab@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"s.mahore123@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"rangwala_uti@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"akjfca@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"shrikantabhyankar@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"shobha@shobhapai.com", "value": "Proprietor", "role": "4"},
{"key":"sskapasi@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"sodhanki_7@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"sonianagpal22@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"sunilmatta1968@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"tejash1027@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"rameshgmehta16@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"vibhasethia2003@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"vidya.prabhu@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"bhagwatvijay@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"vikraminsure@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"aptevilas@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"vinayrai123@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"vinaykudtarkar@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jain_vp@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"vcskenkare@sancharnet.in", "value": "Proprietor", "role": "4"},
{"key":"suninv2003@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"feathercom@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"paawan.investment@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"nimishu@gmail.com", "value": "none", "role": "4"},
{"key":"skabraji@gmail.com", "value": "none", "role": "4"},
{"key":"pareshashah@vsnl.net", "value": "Proprietor", "role": "4"},
{"key":"pagadgil@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"s_jeenu@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"Neyha.srivastava@gmail.com", "value": "none", "role": "4"},
{"key":"srvmum53@hotmail.com", "value": "Investment Advisor", "role": "5"},
{"key":"vipulshah.mumbai1@gmail.com", "value": "Mutual Fund Investment Consultant", "role": "4"},
{"key":"mrinagarwal@gmail.com", "value": "Portfolio Advisor", "role": "4"},
{"key":"ravendra@consultant.com", "value": "none", "role": "4"},
{"key":"amit.kallianpur@gmail.com", "value": "Partner", "role": "4"},
{"key":"motiwala_js@yahoo.com", "value": "Independent Financial Advisor", "role": "4"},
{"key":"vinodrlic@yahoo.co.in", "value": "Insurance", "role": "4"},
{"key":"vsp.prakash@gmail.com", "value": "Investment Advisor", "role": "5"},
{"key":"shiva_konduru@yahoo.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"zankhana@moneycareplanner.com", "value": "none", "role": "4"},
{"key":"yeshwant.a@gmail.com", "value": "none", "role": "4"},
{"key":"umesh.rathi@arihantcapital.com", "value": "none", "role": "4"},
{"key":"uma_velan@yahoo.com", "value": "none", "role": "4"},
{"key":"ssshahani@vsnl.net", "value": "none", "role": "4"},
{"key":"sunil.date@gmail.com", "value": "none", "role": "4"},
{"key":"sumtya@rediffmail.com", "value": "none", "role": "4"},
{"key":"suhas_akole@hotmail.com", "value": "none", "role": "4"},
{"key":"shashankkashettiwar@yahoo.co.in", "value": "none", "role": "4"},
{"key":"svdoshi2003@gmail.com", "value": "none", "role": "4"},
{"key":"sandeepsah@gmail.com", "value": "none", "role": "4"},
{"key":"sadhanaahuja@gmail.com", "value": "none", "role": "4"},
{"key":"rohancfp@yahoo.in", "value": "none", "role": "4"},
{"key":"rimaparikh@yahoo.com", "value": "none", "role": "4"},
{"key":"rajendra.bhatia@arthashastra.net", "value": "none", "role": "4"},
{"key":"rahul_shringarpure@hotmail.com", "value": "none", "role": "4"},
{"key":"prateekbhootra@gmail.com", "value": "none", "role": "4"},
{"key":"psawant77@yahoo.com", "value": "none", "role": "4"},
{"key":"pralhadmali@gmail.com", "value": "none", "role": "4"},
{"key":"ninadmondkar@gmail.com", "value": "none", "role": "4"},
{"key":"nilesh19@gmail.com", "value": "none", "role": "4"},
{"key":"neepa.chheda@yahoo.co.in", "value": "none", "role": "4"},
{"key":"naveensethia@hotmail.com", "value": "none", "role": "4"},
{"key":"nandinimathure@yahoo.co.in", "value": "none", "role": "4"},
{"key":"rajeshdossa@yahoo.com", "value": "none", "role": "4"},
{"key":"krhemaraval@gmail.com", "value": "none", "role": "4"},
{"key":"friendinsurance@yahoo.com", "value": "none", "role": "4"},
{"key":"manojvaidya30@gmail.com", "value": "none", "role": "4"},
{"key":"manojsbendre@gmail.com", "value": "none", "role": "4"},
{"key":"manishdutia@rediffmail.com", "value": "none", "role": "4"},
{"key":"CFPmahesh@gmail.com", "value": "none", "role": "4"},
{"key":"hegdeap123@rediffmail.com", "value": "none", "role": "4"},
{"key":"leena.tychee@gmail.com", "value": "none", "role": "4"},
{"key":"kirtisagarwal@gmail.com", "value": "none", "role": "4"},
{"key":"kptelang@gmail.com", "value": "none", "role": "4"},
{"key":"kssplg@gmail.com", "value": "none", "role": "4"},
{"key":"kapiladventure@gmail.com", "value": "none", "role": "4"},
{"key":"jubin_7@yahoo.co.in", "value": "none", "role": "4"},
{"key":"jitendra@yugmaa.com", "value": "none", "role": "4"},
{"key":"janakisoman@yahoo.com", "value": "none", "role": "4"},
{"key":"srshirsat@gmail.com", "value": "none", "role": "4"},
{"key":"khandelwal.divya@rediffmail.com", "value": "none", "role": "4"},
{"key":"finsmithindia@gmail.com", "value": "none", "role": "4"},
{"key":"potdarchitra@gmail.com", "value": "none", "role": "4"},
{"key":"chhaya.kothari@gmail.com", "value": "none", "role": "4"},
{"key":"charulshah@gmail.com", "value": "none", "role": "4"},
{"key":"bina_invest@yahoo.com", "value": "none", "role": "4"},
{"key":"balvirchawla@gmail.com", "value": "none", "role": "4"},
{"key":"shreesidvin@yahoo.co.in", "value": "none", "role": "4"},
{"key":"avjconsultants@gmail.com", "value": "none", "role": "4"},
{"key":"arvind@arvindhirlekar.com", "value": "none", "role": "4"},
{"key":"dreamzinfinite@gmail.com", "value": "none", "role": "4"},
{"key":"hi_qfp@yahoo.co.in", "value": "none", "role": "4"},
{"key":"aparnakool2668@yahoo.com", "value": "none", "role": "4"},
{"key":"anupshah.cfp@gmail.com", "value": "none", "role": "4"},
{"key":"anilkale@rediffmail.com", "value": "none", "role": "4"},
{"key":"amit_ens@yahoo.com", "value": "none", "role": "4"},
{"key":"getnair@gmail.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"coachashwin@gmail.com", "value": "none", "role": "4"},
{"key":"moneymanaging@gmail.com", "value": "Senior Manager", "role": "4"},
{"key":"bimalmp@gmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"saphene@rediffmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"santosh_shrikhande@yahoo.co.in", "value": "none", "role": "4"},
{"key":"hasitjagasheth@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"aceinsurance@hotmail.com", "value": "Sales Manager", "role": "2"},
{"key":"prakashmthakkar@gmail.com", "value": "Investments Consultant", "role": "4"},
{"key":"sandeeplic@hotmail.com", "value": "Independent Financial Advisor", "role": "4"},
{"key":"sa_zaveri@rediffmail.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"rachnashroff@gmail.com", "value": "none", "role": "4"},
{"key":"medhashah.ms@gmail.com", "value": "none", "role": "4"},
{"key":"akashmk007@gmail.com", "value": "none", "role": "4"},
{"key":"seetharaman.priya@gmail.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"jainjayesh02@yahoo.com", "value": "Student", "role": "4"},
{"key":"sdahima20@hotmail.com", "value": "Training", "role": "4"},
{"key":"gaddi.manjunath@gmail.com", "value": "Associate", "role": "4"},
{"key":"j.k@live.in", "value": "Dealer", "role": "4"},
{"key":"tridibkdas@gmail.com", "value": "none", "role": "4"},
{"key":"vinodlkrao@gmail.com", "value": "Propreitor", "role": "4"},
{"key":"vinayan@yahoo.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"pramod_kanipakam@yahoo.com", "value": "Self-employed", "role": "4"},
{"key":"pramodbajaj6@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"bhindepooja@gmail.com", "value": "none", "role": "4"},
{"key":"sachdevapk@gmail.com", "value": "CEO", "role": "0"},
{"key":"pankajghia@yahoo.com.sg", "value": "Proprietor", "role": "4"},
{"key":"upadhyaysandeep123@rediffmail.com", "value": "Financial Planner", "role": "4"},
{"key":"amano_11@yahoo.com", "value": "Faculty", "role": "4"},
{"key":"ngumaste1@yahoo.com", "value": "Financial Planner", "role": "4"},
{"key":"kanakaasai24@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"lalitvermaonline@yahoo.co.in", "value": "CFP", "role": "4"},
{"key":"jaypar10@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"himanshu4_in@yahoo.com", "value": "Independent Financial Advisor", "role": "4"},
{"key":"hemthakur50@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"bhaveshcfp@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"ashishg27@gmail.com", "value": "Owner", "role": "4"},
{"key":"alamuvenkat@yahoo.com", "value": "Financial Advisor", "role": "4"},
{"key":"sunnybhujbal46@gmail.com", "value": "Student", "role": "4"},
{"key":"BIMALSHAH9664@YAHOO.CO.IN", "value": "Investment Advisor", "role": "5"},
{"key":"mukeshmedal@gmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"shoba.sriaiyer@gmail.com", "value": "Investment Advisor", "role": "5"},
{"key":"khush.jain@gmail.com", "value": "Associate Vice President", "role": "4"},
{"key":"vpotbhare@eth.net", "value": "Proprietor", "role": "4"},
{"key":"zarana_s@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"sangeetha.atreya@gmail.com", "value": "Assoc Director", "role": "4"},
{"key":"info@nadathur.com", "value": "Partner", "role": "4"},
{"key":"nams_vashi@yahoo.co.in", "value": "Financial Consultant", "role": "4"},
{"key":"namrataattal@gmail.com", "value": "Chartered Accountant", "role": "4"},
{"key":"sahilgupte2001@yahoo.com", "value": "Investment Executive", "role": "5"},
{"key":"npmaru@gmail.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"rajesh.iyer@nabasia.com", "value": "Director -Migrant & Expatriate Banking", "role": "0"},
{"key":"ajayshah@mayin.org", "value": "Senior Fellow", "role": "4"},
{"key":"sukumaran@nism.ac.in", "value": "Dean - School for Investor Education & Financial Literacy", "role": "4"},
{"key":"sunder.korivi@nism.ac.in", "value": "Dean- School for Securities Education & School for Securities Information & Research", "role": "4"},
{"key":"director@nism.ac.in", "value": "Director", "role": "4"},
{"key":"avsankar16@gmail.com", "value": "none", "role": "4"},
{"key":"paritosh.sharma@nism.ac.in", "value": "Consultant", "role": "4"},
{"key":"mitu.bhardwaj@nism.ac.in", "value": "Programme Manager", "role": "4"},
{"key":"chaitanya.nemali@nism.ac.in", "value": "Manager", "role": "4"},
{"key":"rohit.jain@nism.ac.in", "value": "Project Manager", "role": "4"},
{"key":"dinesh.gupta14@yahoo.co.in", "value": "Insurance Agent", "role": "4"},
{"key":"sumeet.kohli@npci.org.in", "value": "Business Development Manager - National ACH", "role": "2"},
{"key":"grai@nsdl.co.in", "value": "Executive Director - Operations", "role": "7"},
{"key":"tejasd@nsdl.co.in", "value": "AVP- Issuer Interface & Finance", "role": "4"},
{"key":"dilip.chenoy@nsdcindia.org", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"jayna_gandhi@hotmail.com", "value": "Chief Manager-Treasury", "role": "4"},
{"key":"chitrar@nse.co.in", "value": "Deputy Managing Director", "role": "0"},
{"key":"rnarain@nse.co.in", "value": "Managing Director", "role": "0"},
{"key":"cmukherjee@nse.co.in", "value": "Vice President - Human Resources", "role": "8"},
{"key":"sameer.dalal@natverlal.com", "value": "Proprietor", "role": "4"},
{"key":"enhancek@gmail.com", "value": "Managing Principal", "role": "0"},
{"key":"nayaneshmehta@yahoo.com", "value": "Partner", "role": "4"},
{"key":"Nilesh_c_shah@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"jyosanto@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"manoj_munot@rediffmail.com", "value": "Director", "role": "4"},
{"key":"nlmkmr@yahoo.com", "value": "Partner", "role": "4"},
{"key":"info@nereuscap.com", "value": "Vice President", "role": "4"},
{"key":"pranav.khanna@nerine.com.hk", "value": "Managing Director", "role": "0"},
{"key":"abhi_leekha@yahoo.com", "value": "Director", "role": "4"},
{"key":"balraj@networthfp.com", "value": "Certified Financial planner", "role": "4"},
{"key":"surajnri9@yahoo.com", "value": "Independent Financial Advisor", "role": "4"},
{"key":"r.jagannathan@network18online.com", "value": "Editor-in-Chief", "role": "4"},
{"key":"anil.uniyal@network18online.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sourav.majumdar@network18publishing.com", "value": "Managing Editor, Forbes India", "role": "0"},
{"key":"sadique@networkfp.com", "value": "Founder", "role": "4"},
{"key":"priti@networkfp.com", "value": "Co-founder", "role": "4"},
{"key":"dinesh.waghela@newindia.co.in", "value": "none", "role": "4"},
{"key":"kr.sethuraman@newindia.co.in", "value": "Chief Manager - Investments", "role": "5"},
{"key":"atul.sahai@newindia.co.in", "value": "Manager - Investments", "role": "5"},
{"key":"chinsi.chandra@newindia.co.in", "value": "Administrative Officer", "role": "10"},
{"key":"sb.shukla@newindia.co.in", "value": "Investment Manager", "role": "5"},
{"key":"cmd.nia@newindia.co.in", "value": "Chairman/ Managing Director", "role": "0"},
{"key":"rush_510@yahoo.co.in", "value": "Agent", "role": "4"},
{"key":"vivek@nsradvisors.com", "value": "Partner", "role": "4"},
{"key":"darius@nsradvisors.com", "value": "Partner", "role": "4"},
{"key":"atul@nextadvisors.in", "value": "Chief Technology Officer", "role": "4"},
{"key":"ronakace@gmail.com", "value": "Investment Adviser", "role": "5"},
{"key":"suvir@nexusvp.com", "value": "Co Founder", "role": "4"},
{"key":"sandeep@nexusvp.com", "value": "Co Founder", "role": "4"},
{"key":"agg.ravi@gmail.com", "value": "VP", "role": "4"},
{"key":"bipindhannawat@yahoo.com", "value": "Director", "role": "4"},
{"key":"aparna.r28@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"anish.arora@nirmalbang.com", "value": "Head-Third Party Distribution", "role": "4"},
{"key":"mehraboon.irani@nirmalbang.com", "value": "Principal and Head - Private Client Group", "role": "4"},
{"key":"prirules@yahoo.com", "value": "Managing Director", "role": "0"},
{"key":"ashish.sodhani@nishithdesai.com", "value": "Tax Expert", "role": "4"},
{"key":"rajesh.simhan@nishithdesai.com", "value": "Head - Tax", "role": "4"},
{"key":"nishith.desai@nishithdesai.com", "value": "Owner", "role": "0"},
{"key":"nivvayoosuf@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"sunil.jani@njgroup.in", "value": "Deputy General Manager - Sales", "role": "2"},
{"key":"samanvay@njgroup.in", "value": "Head - Marketing", "role": "2"},
{"key":"niranshah@hotmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"naveen@njgroup.in", "value": "Wealth Advisor", "role": "4"},
{"key":"vinayak@njgroup.in", "value": "Operations & Customer Care", "role": "7"},
{"key":"abhishekgdubey@gmail.com", "value": "Head of Business Process Management", "role": "4"},
{"key":"Viral@njgroup.in", "value": "Head of Research", "role": "4"},
{"key":"husaini@njgroup.in", "value": "Head - Investments", "role": "5"},
{"key":"tushar@njgroup.in", "value": "Zonal Manager", "role": "4"},
{"key":"Sarfaraz@njgroup.in", "value": "Zonal Manager", "role": "4"},
{"key":"Manish@njgroup.in", "value": "Zonal Manager", "role": "4"},
{"key":"Kulbhushan@njgroup.in", "value": "Assistant - Vice President", "role": "4"},
{"key":"misbah@njgroup.in", "value": "National Sales Head", "role": "2"},
{"key":"dkokil@yahoo.com", "value": "Agency Manager", "role": "4"},
{"key":"neeraj@njgroup.in", "value": "Joint Managing Director", "role": "0"},
{"key":"jignesh@njgroup.in", "value": "Jt Managing Director", "role": "0"},
{"key":"shirish@njgroup.in", "value": "Head of Information Technology", "role": "7"},
{"key":"kalpesh@njgroup.in", "value": "Head-International Business", "role": "0"},
{"key":"007binish@gmail.com", "value": "Manager", "role": "4"},
{"key":"nmfinancial@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"tomar.deepak@gmail.com", "value": "Vice President", "role": "4"},
{"key":"salony05@gmail.com", "value": "Analyst", "role": "5"},
{"key":"chitra.mathur1@yahoo.com", "value": "Sr Analyst", "role": "5"},
{"key":"srinivasa.sharan@o3securities.com", "value": "Associate Vice President", "role": "4"},
{"key":"ankitanarsey@gmail.com", "value": "Owner", "role": "4"},
{"key":"rikesh@occa.in", "value": "Founder & Chief Executive Officer", "role": "1"},
{"key":"david.bergeron@oliverwyman.com", "value": "Principal", "role": "4"},
{"key":"amit.deshpande@oliverwyman.com", "value": "Consultant", "role": "4"},
{"key":"sridhar.srinivasan@oliverwyman.com", "value": "Partner", "role": "4"},
{"key":"shivam@omcapital.co.in", "value": "MD", "role": "4"},
{"key":"omspectrum@gmail.com", "value": "Director", "role": "4"},
{"key":"sachin_nadkarni@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"gaurav.kcpl@gmail.com", "value": "Product Manager", "role": "3"},
{"key":"psangani@omnimaxsoftware.com", "value": "Head-Sales & Product development", "role": "2"},
{"key":"nitin@omnimaxsoftware.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"ravimalhotra.ca@gmail.com", "value": "Director", "role": "4"},
{"key":"nvaradarajan@hotmail.com", "value": "Executive Director", "role": "1"},
{"key":"pankaj@optimamoney.com", "value": "Managing Director", "role": "0"},
{"key":"dhairavs@gmail.com", "value": "Partner", "role": "4"},
{"key":"amit.b@optimumfintech.com", "value": "Director", "role": "4"},
{"key":"apeksha.singh@oracle.com", "value": "Field Marketing Specialist - Financial Services", "role": "2"},
{"key":"Tushar.chitra@oracle.com", "value": "Senior Director Product Marketing", "role": "2"},
{"key":"jayakumars.babu@orbisfinancial.in", "value": "Director - Marketing", "role": "2"},
{"key":"vineet.parekh@orbisfinancial.in", "value": "Executive Vice President - Sales", "role": "2"},
{"key":"bankimj.dalal@orbisfinancial.in", "value": "Vice President", "role": "4"},
{"key":"atul.gupta@orbisfinancial.in", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"cmkhurana@obc.co.in", "value": "Chief Financial Officer", "role": "4"},
{"key":"info@oriosvp.com", "value": "Founder & Partner", "role": "4"},
{"key":"contact@oriosvp.com", "value": "General Partner", "role": "4"},
{"key":"hiteshjain69@gmail.com", "value": "Director", "role": "4"},
{"key":"m.nagpal@outlook.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"maadhu.menon@gmail.com", "value": "Director", "role": "4"},
{"key":"poonamrungta@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"phf@vsnl.com", "value": "Director", "role": "4"},
{"key":"dialsushma@hotmail.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"nikhil@pacifiqueinvestments.com", "value": "Owner", "role": "4"},
{"key":"bakul.m.mehta@gmail.com", "value": "Director - Business Development", "role": "4"},
{"key":"parag@pifaindia.com", "value": "Director", "role": "4"},
{"key":"neilparikh@ppfas.com", "value": "Wealth Management Group", "role": "4"},
{"key":"aalok@ppfas.com", "value": "Investor Relations", "role": "4"},
{"key":"jayant@ppfas.com", "value": "Vice President", "role": "4"},
{"key":"paraminvestments@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"vismay@parimalshroff.com", "value": "Advocate & Solicitor", "role": "4"},
{"key":"dharmeshCFP@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"pshejwal@rediffmail.com", "value": "Partner", "role": "4"},
{"key":"ritesh@pashminarealty.com", "value": "Financial Advisor", "role": "4"},
{"key":"manishkishu@hotmail.com", "value": "Director", "role": "4"},
{"key":"rohinton.bharucha@patniadvisors.com", "value": "Executive Vice President", "role": "1"},
{"key":"arihant.patni@patniadvisors.com", "value": "Director", "role": "4"},
{"key":"r.yashwant@gmail.com", "value": "Director", "role": "4"},
{"key":"kunalchess@rediffmail.com", "value": "Assistant Manager", "role": "4"},
{"key":"s.swaminathan@peerlessmf.co.in", "value": "Financial Controller and Company Secretary", "role": "4"},
{"key":"sanjay@sanjaysondhi.com", "value": "Director", "role": "4"},
{"key":"aanandjitsunderaj@peninsula.co.in", "value": "Managing Partner", "role": "0"},
{"key":"ncontractor@perfectrelations.com", "value": "Image Manager", "role": "4"},
{"key":"nag@perfios.com", "value": "Head - Marketing", "role": "2"},
{"key":"sp@phiadvisors.com", "value": "none", "role": "4"},
{"key":"eshwar.karra@phoenixarc.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"durgeshvazare@highstreetphoenix.com", "value": "none", "role": "4"},
{"key":"sastha.g@phoenixmarketcity.in", "value": "AGM Finance", "role": "4"},
{"key":"shishir.s@phoenixmarketcity.in", "value": "Chief Executive Officer & Joint Managing Director", "role": "0"},
{"key":"amit.s@phoenixmarketcity.in", "value": "Vice President - Sales & Marketing", "role": "2"},
{"key":"shifa.hasanali@gmail.com", "value": "Business Owner", "role": "4"},
{"key":"rohit.gupte@pinebridge.com", "value": "Compliance officer & Company Secretary", "role": "4"},
{"key":"vikrant.mehta@pinebridge.com", "value": "Fund Manager", "role": "5"},
{"key":"amit.phadnis@pinebridge.com", "value": "Head of Retail sales", "role": "2"},
{"key":"siddhartha.singh@pinebridge.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"nilesh.chonkar@pinebridge.com", "value": "Head of Operations", "role": "7"},
{"key":"srk@pinnaclefinancialplanners.com", "value": "Partner", "role": "4"},
{"key":"sradhakrishnan995@gmail.com", "value": "none", "role": "4"},
{"key":"dhvani30@gmail.com", "value": "Partner", "role": "4"},
{"key":"ashokarajan72@gmail.com", "value": "financial planner", "role": "4"},
{"key":"ujas.popat@piramal.com", "value": "Chief Manager Corporate Finance", "role": "4"},
{"key":"dinesh.ajwani@piramal.com", "value": "Vice President - Funds", "role": "4"},
{"key":"vishal.dhawan@planahead.in", "value": "Chief Financial Planner", "role": "4"},
{"key":"shalini@planaheadindia.com", "value": "Director", "role": "4"},
{"key":"vishal@planaheadindia.com", "value": "Founder Director and Chief Financial Planner", "role": "4"},
{"key":"arun.mehak@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"vinay.k@polarisFT.com", "value": "Head of Wealth Management", "role": "4"},
{"key":"arun.jain@polarisFT.com", "value": "Chairman and CEO", "role": "0"},
{"key":"ruchira@positronservices.com", "value": "Managing Partner", "role": "0"},
{"key":"rthakkar@ppfas.com", "value": "CIO & Director", "role": "4"},
{"key":"pparikh@ppfas.com", "value": "Chairman", "role": "0"},
{"key":"darakalyaniwala@plindia.com", "value": "Head-Investment Banking", "role": "5"},
{"key":"sunitasave@plindia.com", "value": "Vice President-Client Relations", "role": "4"},
{"key":"namitagodbole@plindia.com", "value": "Compliance officer and Company Secretary", "role": "4"},
{"key":"vijayshah@plindia.com", "value": "Head-Retail Client Group", "role": "4"},
{"key":"rahuljain@plindia.com", "value": "Vice President-India Sales", "role": "2"},
{"key":"sandipraichura@plindia.com", "value": "Head-Retail", "role": "4"},
{"key":"paragpaigankar@plindia.com", "value": "Whole Time Director", "role": "4"},
{"key":"pankajshrestha@plindia.com", "value": "Assistant Vice President", "role": "4"},
{"key":"mybiren@gmail.com", "value": "Sales Manager", "role": "2"},
{"key":"robinson.francis@pramerica.com", "value": "Director & Head-Operations and Customer Services", "role": "7"},
{"key":"brahmaprakash.singh@pramerica.com", "value": "Executive Director and CIO-Equity", "role": "5"},
{"key":"vikram.akhaury@pramerica.com", "value": "National Sales Head - Retail", "role": "4"},
{"key":"vijai.mantri@pramerica.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"ravi.kumar@pramerica.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"hetalpranjal@gmail.com", "value": "none", "role": "4"},
{"key":"ppgajjar2001@yahoo.co.in", "value": "Propritor", "role": "4"},
{"key":"prparikhlic@gmail.com", "value": "Insurance Investment Advisor", "role": "5"},
{"key":"pratham.manglani.1@gmail.com", "value": "MT", "role": "4"},
{"key":"navneet_pvs@yahoo.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"sangeeta@prescient.in", "value": "Owner", "role": "4"},
{"key":"nandini.chatterjee@hotmail.com", "value": "Brand & Communications Director", "role": "4"},
{"key":"dhirajmittal_in@yahoo.com", "value": "Director", "role": "4"},
{"key":"dhiraj.cfp@gmail.com", "value": "CEO", "role": "0"},
{"key":"prithvi@primedatabase.com", "value": "Chairman", "role": "0"},
{"key":"jain.rajat@principalindia.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"rohan.lotia@gmail.com", "value": "Assistant Vice President - Distribution Partnerships", "role": "4"},
{"key":"ghotgalkar.rajan@principalindia.com", "value": "Managing Director", "role": "0"},
{"key":"kumar.alok@principalindia.com", "value": "Business Analyst", "role": "4"},
{"key":"roy.sudipto@principalindia.com", "value": "Business Head - India", "role": "0"},
{"key":"Vipsdev@yahoo.com", "value": "Owner", "role": "4"},
{"key":"narendra2965@gmail.com", "value": "Director", "role": "4"},
{"key":"prithvisecurities@yahoo.com", "value": "Director", "role": "4"},
{"key":"ejazsiddi@gmail.com", "value": "Manager", "role": "4"},
{"key":"sjain@proalphaadvisors.com", "value": "Director - Marketing", "role": "2"},
{"key":"knnarendra@procyonfp.com", "value": "Director", "role": "4"},
{"key":"kailashmalpani@gmail.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"madhup_kumar2000@yahoo.com", "value": "Managing Director", "role": "0"},
{"key":"Archanasb2002@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"vpg@prrsaar.com", "value": "Broker", "role": "4"},
{"key":"jigar261@gmail.com", "value": "Zonal Head", "role": "4"},
{"key":"nileshkarkare@hotmail.com", "value": "Director", "role": "4"},
{"key":"vijay@prudentpartners.com", "value": "Partner", "role": "4"},
{"key":"vivek@prudentpartners.com", "value": "Partner", "role": "4"},
{"key":"paraglife@rediffmail.com", "value": "Financial Planner", "role": "4"},
{"key":"kannan@chadhainvestment.com", "value": "Senior Manager Private Client Group", "role": "4"},
{"key":"mukul@chadhainvestment.com", "value": "Protfolio Officer", "role": "4"},
{"key":"chougulepankaj@yahoo.com", "value": "Financial Planning Manager", "role": "4"},
{"key":"anil@purnimasecurities.com", "value": "Director", "role": "4"},
{"key":"operations@quadriacapital.com", "value": "Managing Partner", "role": "0"},
{"key":"nallasamy_v@yahoo.com", "value": "Certified Financial Planner", "role": "4"},
{"key":"raman.grover@quantcapital.co.in", "value": "Head - Global Wealth Management", "role": "4"},
{"key":"Sandeep.Tandon@quantcapital.co.in", "value": "Managing Director & CEO", "role": "0"},
{"key":"prashant.mohanraj@gmail.com", "value": "Principal", "role": "4"},
{"key":"Hardik.Ruparel@quantcapital.co.in", "value": "Senior Manager", "role": "4"},
{"key":"Aniket.Dogra@quantcapital.co.in", "value": "Senior Manager", "role": "4"},
{"key":"Bhaumik.Vora@quantcapital.co.in", "value": "Assistant Vice President", "role": "4"},
{"key":"Vikas.Puri@quantcapital.co.in", "value": "Assistant Vice President", "role": "4"},
{"key":"rishav.dev@quantcapital.co.in", "value": "Deputy Vice President", "role": "4"},
{"key":"desaibhakti22@gmail.com", "value": "Management Trainee", "role": "4"},
{"key":"amit.jain@quantcapital.co.in", "value": "Senior Manager - Product Development", "role": "3"},
{"key":"anurag.seth@quantcapital.co.in", "value": "Head - Global Wealth Management", "role": "4"},
{"key":"subbu@qasl.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"piyusht@QASL.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"atul@QuantumAMC.com", "value": "Head - Equity Fundss", "role": "5"},
{"key":"chirag@quantumamc.com", "value": "Commodities", "role": "5"},
{"key":"janish@qasl.com", "value": "Analyst - Equity", "role": "5"},
{"key":"sameer@quantumamc.com", "value": "Finance", "role": "4"},
{"key":"harshad@quantumamc.com", "value": "Vice President - Sales", "role": "2"},
{"key":"hichandrasen@yahoo.co.in", "value": "Manager", "role": "4"},
{"key":"ajit@quantumamc.com", "value": "Director", "role": "4"},
{"key":"jimmy@quantumamc.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sridhar1605@gmail.com", "value": "Business Development", "role": "2"},
{"key":"rahul@equitymaster.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"gopalkrishnamc@gmail.com", "value": "Senior Accounts Officer", "role": "7"},
{"key":"ashisherry@hotmail.com", "value": "Financial Planner", "role": "4"},
{"key":"rakesh_lahori@yahoo.com", "value": "Asst Manager", "role": "4"},
{"key":"anjalis31@rediffmail.com", "value": "Propriter", "role": "4"},
{"key":"benaifer@raayinvestments.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"rajesh.srivastava@raboequity.in", "value": "Managing Director", "role": "0"},
{"key":"rachit1_consultant@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"nraheja@rada-advisors.co.in", "value": "Chief Investment Officer & Director", "role": "5"},
{"key":"kishorkumar.bg@gmail.com", "value": "founder", "role": "4"},
{"key":"s.bharathan@rakftz.com", "value": "Business Development Manager", "role": "2"},
{"key":"rashmin@rashminsanghvi.com", "value": "Partner", "role": "4"},
{"key":"rathi.lic@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"pradeephattangadi@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"shriram_singh@rediffmail.com", "value": "Vice President", "role": "4"},
{"key":"sagar.sachdeva@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"pooja.vyas@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"geetika.vaid@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"sonia.verma@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"tinaz.misra@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"amit.sinha@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"madhurjya.lahkar@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"sonali.pradhan@sanctumwealth.com", "value": "Managing Director & Head - Wealth Planning", "role": "0"},
{"key":"fay.gomes@sanctumwealth.com", "value": "Business Management & Support ", "role": "10"},
{"key":"prateek.nijhawan@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"arif_moh@hotmail.com", "value": "Vice President", "role": "4"},
{"key":"sagar.kapoor@sanctumwealth.com", "value": "Associate Director", "role": "4"},
{"key":"amit.trivedi@sanctumwealth.com", "value": "Head - Risk", "role": "3"},
{"key":"anila.ahuja@sanctumwealth.com", "value": "Director & Market Head - North", "role": "1"},
{"key":"sameersrana@yahoo.co.in", "value": "Vice President", "role": "4"},
{"key":"vivek.syal@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"dhaval.kothari@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"Viswanadha.Raju@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"vivek.rajaraman@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"Senthil.Nathan@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"Vikas.Garg@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"sumona.b.kundu@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"Aditya.Sambhy@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"farhad.captain@sanctumwealth.com", "value": "Senior Private Banker", "role": "4"},
{"key":"kapil.bhushan@sanctumwealth.com", "value": "Private Banker", "role": "4"},
{"key":"rohit.wadhwa@sanctumwealth.com", "value": "Head - Active Advisory Service", "role": "3"},
{"key":"darjirahul@gmail.com", "value": "Senior Executive", "role": "1"},
{"key":"vishal.makani@sanctumwealth.com", "value": "Investment Advisor", "role": "5"},
{"key":"Pallavi.Gholap@sanctumwealth.com", "value": "Human Resources", "role": "8"},
{"key":"caroline.kulkarni@sanctumwealth.com", "value": "Vice President - Human Resources", "role": "8"},
{"key":"neeraj.sirur@sanctumwealth.com", "value": "Director - Business Process", "role": "7"},
{"key":"Abhishek.Khandelwal@sanctumwealth.com", "value": "Vice President - Credit and Investment Products", "role": "3"},
{"key":"anand.moorthy@sanctumwealth.com", "value": "Head- Real Estate Services", "role": "3"},
{"key":"Apoorv.Govil@sanctumwealth.com", "value": "Equity Derivatives Trading", "role": "5"},
{"key":"rama.biyani@sanctumwealth.com", "value": "Fixed Income Market Specialist", "role": "5"},
{"key":"prateek.pant@sanctumwealth.com", "value": "Director - Products and Services", "role": "3"},
{"key":"vishal.soni@sanctumwealth.com", "value": "Head - Business & Sales Management", "role": "2"},
{"key":"puneet.periwal@sanctumwealth.com", "value": "Executive Director", "role": "1"},
{"key":"shiv.gupta@sanctumwealth.com", "value": "Head - Private Banking", "role": "4"},
{"key":"rajesh.cheruvu@sanctumwealth.com", "value": "Head of Investment Strategy", "role": "5"},
{"key":"kumkum.nongrum@sanctumwealth.com", "value": "Head- Leadership and Learning", "role": "7"},
{"key":"Geetika.B.Arora@sanctumwealth.com", "value": "Learning & Development", "role": "7"},
{"key":"rajeshcheruvu@yahoo.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"shantanu.sengupta@sanctumwealth.com", "value": "Head - Investments,  Bancassurance & Retail Brokerage", "role": "5"},
{"key":"sujata.20jan@gmail.com", "value": "CM", "role": "4"},
{"key":"Parry@RedFortCapital.com", "value": "Managing Partner", "role": "0"},
{"key":"sbedi@RedFortCapital.com", "value": "Managing Director", "role": "0"},
{"key":"zahir.babar@redvisiontech.com", "value": "Chief Financial Officer and Head - Marketing", "role": "2"},
{"key":"jagdishshetty45@gmail.com", "value": "Director", "role": "4"},
{"key":"relacsinvestment@gmail.com", "value": "Director", "role": "4"},
{"key":"vinuss59@gmail.com", "value": "Partner", "role": "4"},
{"key":"abhijeet.patoley@relianceada.com", "value": "Marketing & Communications-Reliance Mutual Fund", "role": "2"},
{"key":"mihir.sundhani@relianceada.com", "value": "Vice President", "role": "4"},
{"key":"sampat.kumar@relianceada.com", "value": "none", "role": "4"},
{"key":"shuporna.chakraborty@relianceada.com", "value": "Senior Manager- Corporate Communication", "role": "2"},
{"key":"bhalchandra.joshi@relianceada.com", "value": "Head-Service Delivery & Investor Relations", "role": "7"},
{"key":"mohit.totlani@relianceada.com", "value": "Chief Manager-Marketing", "role": "2"},
{"key":"Sumit.Kapoor@relianceada.com", "value": "Marketing", "role": "2"},
{"key":"raghuvir.mukherji@relianceada.com", "value": "Head-Risk Management", "role": "7"},
{"key":"muneesh.sud@relianceada.com", "value": "Head Legal,  Compliance & Secretarial", "role": "7"},
{"key":"lav.chaturvedi@relianceada.com", "value": "Head - Risk Management", "role": "7"},
{"key":"ashish.p.srivastava@relianceada.com", "value": "Chief Manager Legal", "role": "7"},
{"key":"vinay.nigudkar@relianceada.com", "value": "Head-IT", "role": "7"},
{"key":"amit.bapna@relianceada.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"krishan.daga@relianceada.com", "value": "Vice President", "role": "4"},
{"key":"saurabh.bihani@relianceada.com", "value": "Manager", "role": "4"},
{"key":"yatin.matta@relianceada.com", "value": "Equities Analyst", "role": "5"},
{"key":"arun.sundaresan@relianceada.com", "value": "Chief Manager - Corporate Strategy", "role": "1"},
{"key":"amit.tripathi@relianceada.com", "value": "Head-Fixed Income", "role": "5"},
{"key":"omprakash.kuckian@relianceada.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"hiren.chandaria@relianceada.com", "value": "Fund Manager-Commodities", "role": "5"},
{"key":"samir.rachh@relianceada.com", "value": "Assistant Fund Manager", "role": "5"},
{"key":"shrey.loonker@relianceada.com", "value": "Assistant Fund Manager", "role": "5"},
{"key":"viral.berawala@relianceada.com", "value": "Assistant Fund Manager", "role": "5"},
{"key":"anju.chhajer@relianceada.com", "value": "Fund Manager", "role": "5"},
{"key":"jahnvee.shah@relianceada.com", "value": "Fund Manager", "role": "5"},
{"key":"Govind.N.Agrawal@Relianceada.com", "value": "Senior Vice President - Equities", "role": "5"},
{"key":"abhay.kadaskar@relianceada.com", "value": "Products", "role": "6"},
{"key":"abhigyan.pal@relianceada.com", "value": "Product Management Group", "role": "6"},
{"key":"ananti.saboo@relianceada.com", "value": "Regional Manager - PMS", "role": "4"},
{"key":"ankush.gadi@relianceada.com", "value": "Product Manager", "role": "3"},
{"key":"ashish.mehta@relianceada.com", "value": "Equity Fund Manager", "role": "5"},
{"key":"kinshuk.sharma@relianceada.com", "value": "Portfolio Manager", "role": "6"},
{"key":"madhusudan.kela@relianceada.com", "value": "Head of Equity Investments", "role": "5"},
{"key":"rajesh.jayaraman@relianceada.com", "value": "Banks & National Distributors", "role": "4"},
{"key":"shuchita.mishra@relianceada.com", "value": "Reliance PMS Sales Delhi", "role": "2"},
{"key":"sunil.singhania@relianceada.com", "value": "Head - Equities", "role": "5"},
{"key":"sameer.s.gupte@relianceada.com", "value": "A.V.P - Business Retention & Sales Support", "role": "2"},
{"key":"nitin.gupta@relianceada.com", "value": "Dy V.P & Segment Head - Retail Debt Distribution", "role": "4"},
{"key":"sambath.kumar@relianceada.com", "value": "Segment Head Alternate Channel", "role": "4"},
{"key":"sanjaykumar.singh@rcap.co.in", "value": "Head-ETF", "role": "5"},
{"key":"rajnish.girdhar@relianceada.com", "value": "International Business", "role": "4"},
{"key":"saugata.chatterjee@relianceada.com", "value": "Head  Distribution", "role": "4"},
{"key":"shamit.chokshi@relianceada.com", "value": "Products", "role": "3"},
{"key":"ashwani.kumar@relianceada.com", "value": "Equity Fund Manager", "role": "5"},
{"key":"atika.agarwal@relianceada.com", "value": "PMS", "role": "4"},
{"key":"aum.manchanda@relianceada.com", "value": "Mar-04", "role": "2"},
{"key":"balasubramani.velayutham@relianceada.com", "value": "PMS", "role": "4"},
{"key":"kinjal.r.shah@relianceada.com", "value": "Relationship Manager", "role": "4"},
{"key":"mihir.shah@relianceada.com", "value": "Relationship Manager", "role": "4"},
{"key":"ramanathan.dwarakanathan@relianceada.com", "value": "Assistant Vice President - Structured Product & Debt Sales", "role": "2"},
{"key":"rashmi.bahl@relianceada.com", "value": "Regional Manager - Andhra Pradesh", "role": "3"},
{"key":"shailendra.dubey@relianceada.com", "value": "PMS", "role": "4"},
{"key":"shashi.singh@relianceada.com", "value": "Segment Head - Banks & National Distributors", "role": "4"},
{"key":"sujata.gokhale@relianceada.com", "value": "Product Management", "role": "4"},
{"key":"karthi.elango@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"amitabh.jhunjhunwala@relianceada.com", "value": "Director", "role": "4"},
{"key":"sundeep.sikka@relianceada.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"himanshu.vyapak@relianceada.com", "value": "Deputy Chief Executive Officer", "role": "1"},
{"key":"anurag.saraswat@rediffmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"sumitkati@gmail.com", "value": "Manager Training", "role": "7"},
{"key":"rajesh.bahl@relianceada.com", "value": "Chief Financial Officer", "role": "7"},
{"key":"sameer.karekatte@relianceada.com", "value": "Head - Legal and Compliance", "role": "7"},
{"key":"sunder.krishnan@relianceada.com", "value": "Chief Risk officer", "role": "7"},
{"key":"andleeb.rabbi@relianceada.com", "value": "Chief Human Resources Officer", "role": "8"},
{"key":"rajesh.dalmia@relianceada.com", "value": "Appointed Actuary", "role": "6"},
{"key":"sunil.agrawal@relianceada.com", "value": "Chief Financial Officer", "role": "7"},
{"key":"srinivasan.Iyengar@relianceada.com", "value": "Chief Operating Officer", "role": "7"},
{"key":"murli.nambiar@relianceada.com", "value": "Chief Technology Officer", "role": "7"},
{"key":"manoranjan.sahoo@relianceada.com", "value": "Head- Agency", "role": "7"},
{"key":"anup.rau@relianceada.com", "value": "Chief Executive Officer and Executive Director", "role": "0"},
{"key":"palem.bharathi@yahoo.com", "value": "Zonal Operations Manager", "role": "7"},
{"key":"shahzad.madon@relianceada.com", "value": "Head - PMS & Alternate Assets", "role": "7"},
{"key":"rahul.manek@relianceada.com", "value": "Director", "role": "4"},
{"key":"ramesh.venkat@relianceada.com", "value": "CEO & Managing Director", "role": "0"},
{"key":"sankha.mukherjee@rcap.co.in", "value": "Associate Vice President Training", "role": "7"},
{"key":"tejash.valla@rcap.co.in", "value": "Associate Director", "role": "4"},
{"key":"vinayak.y.singh@rcap.co.in", "value": "Sales & Structuring", "role": "2"},
{"key":"Umesh.M.Gupta@rcap.co.in", "value": "Fund Manager", "role": "5"},
{"key":"Fayeza.Hafizee@rcap.co.in", "value": "Associate Director", "role": "4"},
{"key":"Amit.A.Kumar@rcap.co.in", "value": "Associate Director", "role": "4"},
{"key":"Navin.Gera@rcap.co.in", "value": "Senior Director", "role": "4"},
{"key":"mahesh.kuppannagari@rcap.co.in", "value": "Deputy Vice President", "role": "4"},
{"key":"radhika.garg@relianceada.com", "value": "Assistant Vice President - Wealth Management", "role": "4"},
{"key":"rajnish.gupta@relianceada.com", "value": "Senior Wealth Manager", "role": "4"},
{"key":"mohan.mg@religaremf.com", "value": "Channel Head", "role": "4"},
{"key":"abhishek.taliwal@gmail.com", "value": "Channel Manager - Business Development", "role": "4"},
{"key":"haresh.sadani@religare.com", "value": "Head-Marketing and Products", "role": "2"},
{"key":"suresh.jakhotiya@religare.com", "value": "Head-Compliance", "role": "4"},
{"key":"surinder.negi@religare.com", "value": "Head of Operations", "role": "7"},
{"key":"pranav.gokhale@religare.com", "value": "Fund Manager-Equity", "role": "5"},
{"key":"sujoy.das@religare.com", "value": "Head - Fixed Income", "role": "5"},
{"key":"vetri.subramaniam@religare.com", "value": "Head of Equities & Chief Investment Officer", "role": "5"},
{"key":"madhu.nair@religare.com", "value": "National Sales Head(Institutional & Off Shore Business)", "role": "2"},
{"key":"ankit_parekh2006@yahoo.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"saurabh.nanavati@religare.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"hemal1407@gmail.com", "value": "Assistant Vice President", "role": "4"},
{"key":"22.anshul@gmail.com", "value": "Manager - Private Clients", "role": "4"},
{"key":"vishal243@gmail.com", "value": "Investment Advisor", "role": "5"},
{"key":"sumaiya.ssf@gmail.com", "value": "Senior Investment Advisor", "role": "5"},
{"key":"surajsinha29@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"deepak_august31@yahoo.co.in", "value": "Senior Manager - Private Clients", "role": "4"},
{"key":"charmi.cfp@gmail.com", "value": "Assistant Professor", "role": "4"},
{"key":"reenabanerjee@rbi.org.in", "value": "Deputy General Manager", "role": "4"},
{"key":"devinderkumar@rbi.org.in", "value": "Department of External Investment & Operations", "role": "4"},
{"key":"dimplebhandia@rbi.org.in", "value": "Assistant General Manager", "role": "4"},
{"key":"gmahalingam@rbi.org.in", "value": "Chief General Manager - IDMD", "role": "4"},
{"key":"jaganmohan@rbi.org.in", "value": "Departmnet of External Investments & Operations", "role": "4"},
{"key":"anup@rbi.org.in", "value": "Departmnet of External Investments & Operations", "role": "4"},
{"key":"saikat.chatterjee@reuters.com", "value": "Correspondent", "role": "4"},
{"key":"manish.patel@reuters.com", "value": "Contributions Relationship Manager", "role": "4"},
{"key":"vijay.chand@reuters.com", "value": "Head of Marketing Communications & Public Relation", "role": "2"},
{"key":"charlotte.cooper@reuters.com", "value": "Bureau Chief", "role": "4"},
{"key":"kalpesh.thakar@reuters.com", "value": "Data Manager - Treasury & Fixed Income", "role": "5"},
{"key":"anshu.shrivastava@revyqa.com", "value": "Director", "role": "4"},
{"key":"jkallelil@ivey.ca", "value": "Director-Executive Development", "role": "1"},
{"key":"ricsindia@rics.org", "value": "CEO", "role": "0"},
{"key":"contactus@righthorizons.com", "value": "none", "role": "4"},
{"key":"vinayak.k@righthorizons.com", "value": "Portfolio Manager", "role": "4"},
{"key":"devang@rightreturns.com", "value": "Proprietor", "role": "4"},
{"key":"rahul@ripplewave.net", "value": "none", "role": "4"},
{"key":"cn_prasad59@yahoo.com", "value": "CEO", "role": "0"},
{"key":"barikmanoj@hotmail.com", "value": "Product Manager", "role": "3"},
{"key":"ravi.kumar@rksv.in", "value": "Head of Business Strategy", "role": "0"},
{"key":"raghu.kumar@rksv.in", "value": "Head of Operations", "role": "0"},
{"key":"mlvohra_38@yahoo.com", "value": "Faculty", "role": "4"},
{"key":"geethasubhas@yahoo.co.uk", "value": "Consultant Trainer", "role": "4"},
{"key":"suresh.fp@hotmail.com", "value": "Programe Director", "role": "4"},
{"key":"salimrazas@yahoo.co.in", "value": "Regional Co-Cordinator", "role": "4"},
{"key":"rspl_hub@rediffmail.com", "value": "Consultant", "role": "4"},
{"key":"cfpdeepshikha@gmail.com", "value": "Founder", "role": "4"},
{"key":"lifewithgautam@yahoo.com", "value": "Sole Proprietor", "role": "4"},
{"key":"ralph.robert@rra.in", "value": "Director", "role": "4"},
{"key":"vishrammodak@gmail.com", "value": "none", "role": "4"},
{"key":"mutualfunds@rushilfinancial.com", "value": "Director", "role": "4"},
{"key":"rameshsel@gmail.com", "value": "Senior Analyst", "role": "5"},
{"key":"upendra_sheth@yahoo.com", "value": "none", "role": "4"},
{"key":"gs_rajput77@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"sandeep@srinvestmentsonline.com", "value": "Proprietor", "role": "4"},
{"key":"subbaiah_s@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"svgsarma@illiscapital.com", "value": "none", "role": "4"},
{"key":"info@scvasudeva.com", "value": "none", "role": "4"},
{"key":"pravinseth2004@yahoo.com", "value": "Chartered Accountants", "role": "4"},
{"key":"s9financialplanners@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"bimalparekhca@yahoo.com", "value": "none", "role": "4"},
{"key":"nilesh@safeinvestmentonline.com", "value": "Director", "role": "4"},
{"key":"bhavik.taunk@safeinvest.co.in", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"integrowth@gmail.com", "value": "Director", "role": "4"},
{"key":"naik@saharamutual.com", "value": "Head-Investor relations", "role": "4"},
{"key":"npnagpal@gmail.com", "value": "Sr Executive Sales and Investor Relations", "role": "2"},
{"key":"puneetsharad2000@gmail.com", "value": "Area Manager", "role": "2"},
{"key":"sahyogm@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"src@saisecurities.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"admin@salsecurities.com", "value": "Admin", "role": "10"},
{"key":"pallav@salasarcapital.com", "value": "Owner", "role": "4"},
{"key":"prakash.sambare@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"krishnan@samhita.org", "value": "Managing Director", "role": "0"},
{"key":"priya@samhita.org", "value": "Founder", "role": "4"},
{"key":"samir@samirsanghavi.com", "value": "Founder", "role": "4"},
{"key":"divya8209@yahoo.com", "value": "Director", "role": "4"},
{"key":"lakshyainvestment@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"sdthakker@yahoo.co.in", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"sanjivslchadha@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"venkatraman.sankar@gmail.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"mshah_iconsult@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"monica_mokashi@hotmail.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"satyamlife@vsnl.net", "value": "Chief Financial Advisor", "role": "4"},
{"key":"kamalsi05@yahoo.com", "value": "Financial Advisor", "role": "4"},
{"key":"sachin@snpfp.com", "value": "Owner", "role": "4"},
{"key":"tanya.dere@sbimf.com", "value": "Manager-International Development", "role": "4"},
{"key":"r.srinivas@sbimf.com", "value": "Chief Marketing Officer", "role": "2"},
{"key":"ramkiraj@hotmail.com", "value": "Head of Human Resources", "role": "8"},
{"key":"awin1905@yahoo.com", "value": "Branch Head", "role": "4"},
{"key":"sandeep.kalsi@alumni.insead.edu", "value": "Vice President", "role": "4"},
{"key":"ruchit.mehta@sbimf.com", "value": "Fund Manager", "role": "5"},
{"key":"tanmaya.desai@sbimf.com", "value": "Fund Manager", "role": "5"},
{"key":"sohini.andani@sbimf.com", "value": "Fund Manager", "role": "5"},
{"key":"suchita.shah@sbimf.com", "value": "Fund Manager", "role": "5"},
{"key":"navneet.munot@sbimf.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"jayesh.shroff@sbimf.com", "value": "Fund Manager", "role": "5"},
{"key":"vijay.prabhu@sbimf.com", "value": "Assistant Vice President - Wealth", "role": "2"},
{"key":"srinivasjain@gmail.com", "value": "Senior Fund Manager", "role": "5"},
{"key":"s.mahadevan@sbimf.com", "value": "Assistant Vice President - Head National Distributor channel", "role": "2"},
{"key":"kishorekumar.p@sbi.co.in", "value": "Assistant Vice President - Operations", "role": "7"},
{"key":"dinesh.khara@sbimf.com", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"shyogesh@yahoo.com", "value": "Senior Manager Marketing", "role": "2"},
{"key":"ghaisas_swati@yahoo.com", "value": "Assistant Vice President", "role": "4"},
{"key":"nladiwala@gmail.com", "value": "VP Head PMS", "role": "4"},
{"key":"nirmal.gandhi@sbilife.co.in", "value": "Manager - Investments", "role": "5"},
{"key":"anand.pejawar@sbilife.co.in", "value": "Executive Director-Marketing", "role": "2"},
{"key":"chandrajit.ranavde@sbilife.co.in", "value": "Head - Debt", "role": "4"},
{"key":"abhishekbondia@securenow.in", "value": "Director", "role": "4"},
{"key":"jainendras@sebi.gov.in", "value": "AGM - Special Enforcement Cell", "role": "4"},
{"key":"nila@sebi.gov.in", "value": "AGM - Investment Management Department", "role": "5"},
{"key":"jitendrak@sebi.gov.in", "value": "AGM - Investment Management Department", "role": "5"},
{"key":"mdrao@sebi.gov.in", "value": "ED - Investment Management Department", "role": "5"},
{"key":"paragb@sebi.gov.in", "value": "GM - Division of Funds 2", "role": "4"},
{"key":"ashas@sebi.gov.in", "value": "DGM - Investment Management Department", "role": "5"},
{"key":"maninderc@sebi.gov.in", "value": "DGM - Investment Management Department", "role": "5"},
{"key":"jeevans@sebi.gov.in", "value": "GM - Investment Management Department", "role": "5"},
{"key":"smadhu@sebi.gov.in", "value": "DGM - Investment Management Department", "role": "5"},
{"key":"medhad@sebi.gov.in", "value": "DGM - Investment Management Department", "role": "5"},
{"key":"sanjayp@sebi.gov.in", "value": "DGM - Investment Management Department", "role": "5"},
{"key":"gyanbhushan@sebi.gov.in", "value": "CGM - Investor Awareness Division", "role": "4"},
{"key":"yogeshe@sebi.gov.in", "value": "Manager", "role": "4"},
{"key":"ravindran@sebi.gov.in", "value": "ED - Investment Management Division", "role": "5"},
{"key":"chairman@sebi.gov.in", "value": "Chairman", "role": "0"},
{"key":"info@seedfund.in", "value": "Partner", "role": "4"},
{"key":"mohit.bhatnagar@sequoiacap.com", "value": "Managing Director", "role": "0"},
{"key":"abhay.pandey@sequoiacap.com", "value": "Managing Director", "role": "0"},
{"key":"rks.supreme@gmail.com", "value": "Director", "role": "4"},
{"key":"maithili_faith@yahoo.com", "value": "Team Leader Financial Planning", "role": "4"},
{"key":"rohit@gettingyourich.com", "value": "Director", "role": "4"},
{"key":"shanbhag.wm@gmail.com", "value": "Director", "role": "4"},
{"key":"shantanupatki@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"jimmy@shapoorji.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"chhabria.rajiv@gmail.com", "value": "Sales Manager", "role": "2"},
{"key":"vinayca_fazilka@rediffmail.com", "value": "Partner", "role": "4"},
{"key":"Patkisa@gmail.com", "value": "Independant Financial Advisor", "role": "4"},
{"key":"kale.invest@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"venkat.profit@gmail.com", "value": "Consultatn", "role": "4"},
{"key":"raman104@gmail.com", "value": "Director", "role": "4"},
{"key":"srini.shreesidvin@gmail.com", "value": "Director", "role": "4"},
{"key":"siddhi_811@yahoo.co.in", "value": "Relationship Management Business Communications", "role": "4"},
{"key":"nanduchirag@rediffmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"sanjaypateluti@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"deevyesh@shriramwealth.com", "value": "Director", "role": "4"},
{"key":"cr.nagar@gmail.com", "value": "Partner", "role": "4"},
{"key":"cr.nagar@gmail.com", "value": "Partner", "role": "4"},
{"key":"romil1205@yahoo.co.in", "value": "Marketing Executive", "role": "2"},
{"key":"info@sidbiventure.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"ashishshah.cfp@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"vineet@siftcapital.com", "value": "Director", "role": "4"},
{"key":"my.simple.equation@gmail.com", "value": "Money Management coach", "role": "4"},
{"key":"rajas.kelkar@simplusinfo.com", "value": "Founder and Publisher", "role": "4"},
{"key":"mimi@sinhasi.com", "value": "Director", "role": "4"},
{"key":"ramaraosbilife@gmail.com", "value": "Financial Consultant", "role": "4"},
{"key":"directswan@rediffmail.com", "value": "Proprietor", "role": "4"},
{"key":"skmmanagement@yahoo.com", "value": "Director", "role": "4"},
{"key":"ruchi.kulkarni@hotmail.com", "value": "Lecturer", "role": "4"},
{"key":"vatsala.pachisia@skpmoneywise.com", "value": "Financial Advisor", "role": "4"},
{"key":"rajesh.pachisia@skpmoneywise.com", "value": "Managing Director", "role": "0"},
{"key":"rajesh.maloo@skpmoneywise.com", "value": "Mutual Fund Advisory Head", "role": "4"},
{"key":"naresh.pachisia@skpmoneywise.com", "value": "Managing Director", "role": "0"},
{"key":"sskapur@hotmail.com", "value": "Senior Manager", "role": "4"},
{"key":"ashish.modani@slainvestment.com", "value": "Proprietor", "role": "4"},
{"key":"sudhir12192@gmail.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"asmita_karanje@yahoo.co.in", "value": "Manager", "role": "4"},
{"key":"rooppradhan@gmail.com", "value": "Director", "role": "4"},
{"key":"shah_ronak76@yahoo.com", "value": "Advisory PMS", "role": "4"},
{"key":"dka@smcindiaonline.com", "value": "Director", "role": "4"},
{"key":"mukesh@smrconsultancy.com", "value": "none", "role": "4"},
{"key":"ganesh@smsfs.com", "value": "Managing Director & CEO", "role": "0"},
{"key":"anju_gandhi@sngpartners.in", "value": "Partner", "role": "4"},
{"key":"virendra@sngpartners.in", "value": "Partner", "role": "4"},
{"key":"manjeeri@sngpartners.in", "value": "Senior Manager - Business Coordination", "role": "4"},
{"key":"rajesh_narain@sngpartners.in", "value": "Managing Partner", "role": "0"},
{"key":"paras@sobaindia.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"sandra.martyres@sgcib.com", "value": "Chief Operations Officer", "role": "7"},
{"key":"uday.jena@sgcib.com", "value": "Head of Fixed Income", "role": "5"},
{"key":"ydjoshi@gmail.com", "value": "Secretary", "role": "4"},
{"key":"ageorge@sofgen.com", "value": "Director", "role": "4"},
{"key":"omar.vanjara@slmnco.in", "value": "Partner", "role": "4"},
{"key":"s.jhalani@live.com", "value": "Proprietor", "role": "4"},
{"key":"sougata.mitra@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"southerncapital@gmail.com", "value": "none", "role": "4"},
{"key":"sanjay@spacapital.com", "value": "President", "role": "4"},
{"key":"sandeep@spacapital.com", "value": "Managing Director", "role": "0"},
{"key":"spectrumpatil@yahoo.com", "value": "Senior Partner", "role": "4"},
{"key":"patilmus@yahoo.com", "value": "Co-Chief Investment Officer", "role": "5"},
{"key":"vinod.ambavat@spireindia.com", "value": "Director", "role": "4"},
{"key":"swatiakedia@gmail.com", "value": "Business Head", "role": "0"},
{"key":"info@srinidhihomes.in", "value": "Chairman and Managing Director", "role": "0"},
{"key":"tasneem_allana@rediffmail.com", "value": "Partner", "role": "4"},
{"key":"deepali.sen@srujanfa.com", "value": "Partner", "role": "4"},
{"key":"roopali.prabhu@srujanfa.com", "value": "Partner", "role": "4"},
{"key":"pitamber.lulla@gmail.com", "value": "Dealer", "role": "4"},
{"key":"waseem15_2000@yahoo.com", "value": "Director", "role": "4"},
{"key":"ghosh_sandeep97@rediffmail.com", "value": "Financial Planner", "role": "4"},
{"key":"sukhdeep1785@gmail.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"sikharendra.datta@sc.com", "value": "Training Manager", "role": "4"},
{"key":"ravi.duvvuru@sc.com", "value": "Head of Compliance & Assurance for India and South Asia", "role": "4"},
{"key":"aditya.sharma4@sc.com", "value": "Investment Strategist", "role": "5"},
{"key":"nairut.kapadia@sc.com", "value": "Director - Client Advisor", "role": "4"},
{"key":"deepavali.rao@gmail.com", "value": "Associate Director", "role": "4"},
{"key":"ekta.keswani@sc.com", "value": "Associate Director", "role": "4"},
{"key":"Jaiveet.dhillon@sc.com", "value": "none", "role": "4"},
{"key":"anurag.jain@sc.com", "value": "none", "role": "4"},
{"key":"vijay.kalsi@sc.com", "value": "none", "role": "4"},
{"key":"akshaya.kamath@sc.com", "value": "none", "role": "4"},
{"key":"Shayne.Caldeira@sc.com", "value": "none", "role": "4"},
{"key":"shamin.dalal@sc.com", "value": "Wealth Advisory", "role": "4"},
{"key":"probal.ghosh@sc.com", "value": "Zonal Head - Advisory", "role": "4"},
{"key":"gopal.lakhotia@sc.com", "value": "Investment Advisor", "role": "5"},
{"key":"victor.daniel7@gmail.com", "value": "Experienced Investment Advisor", "role": "5"},
{"key":"rajat.sinha@sc.com", "value": "Head HR Consumer Banking", "role": "8"},
{"key":"rajrishi.jain@sc.com", "value": "Product Manager - Funds & Portfolio Solutions", "role": "3"},
{"key":"arrohi.a.bhatnagar@sc.com", "value": "Product Manager - Investments", "role": "3"},
{"key":"aman.rajoria@sc.com", "value": "Head - Funds", "role": "4"},
{"key":"Gaurav.tulsani@sc.com", "value": "Product Manager- Funds & Portfolio Solutions", "role": "3"},
{"key":"joti.joseph@sc.com", "value": "Head - Learning & CB Academy", "role": "4"},
{"key":"ami.g.ganjawalla@sc.com", "value": "Associate Director  Marketing", "role": "4"},
{"key":"medha32001@yahoo.co.in", "value": "Associate Director", "role": "4"},
{"key":"probalghosh2112@gmail.com", "value": "Zonal Head -- Wealth Management", "role": "4"},
{"key":"leyland.mendes@sc.com", "value": "Director", "role": "4"},
{"key":"santosh.k.bhaskar@sc.com", "value": "Director", "role": "4"},
{"key":"ashokkumar.pradeep@gmail.com", "value": "Investment Adviser", "role": "5"},
{"key":"raveendra.balivada@sc.com", "value": "Head Investment Advisory - West", "role": "5"},
{"key":"gaurav.perti@sc.com", "value": "Head - Investment Products", "role": "3"},
{"key":"sunil.kaushal@sc.com", "value": "Regional Chief Executive", "role": "1"},
{"key":"Sandeep.Das@sc.com", "value": "Managing Director and Head of Private Bank", "role": "0"},
{"key":"nainesh.jaisingh@sc.com", "value": "Managing Director & Head", "role": "0"},
{"key":"sirshendu.basu@sc.com", "value": "Head - Consumer Equity Strategy", "role": "5"},
{"key":"sachin.bhambani@sc.com", "value": "Head - Retail", "role": "4"},
{"key":"vimaljain@sbbj.co.in", "value": "DY Manager (Systems)", "role": "4"},
{"key":"rajni@sbbj.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"dronakumar@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"mbuvaria@yahoo.co.in", "value": "Senior Assistant", "role": "4"},
{"key":"dalal.praveen@gmail.com", "value": "Marketing and Recovery Officer", "role": "2"},
{"key":"gm.mcs@sbi.co.in", "value": "General Manager - Cross selling", "role": "4"},
{"key":"pc.thakurdipak@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"neeraj.kushwaha@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"s.yerawar@sbi.co.in", "value": "Senior Manager", "role": "4"},
{"key":"sbi.01102@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"dgm.fpwm@sbi.co.in", "value": "Deputy General Manager", "role": "4"},
{"key":"akella.v.prasad@sbi.co.in", "value": "Assistant General Manager", "role": "4"},
{"key":"venkat.s.b@sbi.co.in", "value": "Deputy General Manager - Advissory Services", "role": "4"},
{"key":"agmtmg3.ibg@sbi.co.in", "value": "Management Trainee  Treasury Management Group", "role": "4"},
{"key":"cgm.gm@sbi.co.in", "value": "Chief General Manager", "role": "4"},
{"key":"a.bhatia@sbi.co.in", "value": "none", "role": "4"},
{"key":"dgm.ibtmg@sbi.co.in", "value": "Deputy General Manager", "role": "4"},
{"key":"dgmmb.ibg@sbi.co.in", "value": "Deputy General Manager", "role": "4"},
{"key":"dgm.nri@sbi.co.in", "value": "Deputy General Manager - NRI Services", "role": "4"},
{"key":"agm.nri@sbi.co.in", "value": "Assistant General Manager  NRI Services", "role": "4"},
{"key":"agmtmg1.ibg@sbi.co.in", "value": "Assistant General Manager  Treasury Management Group", "role": "4"},
{"key":"cgm.fc@sbi.co.in", "value": "Chief General Manager", "role": "4"},
{"key":"cgm.fo@sbi.co.in", "value": "Chief General Manager", "role": "4"},
{"key":"cmtmg1.ibg@sbi.co.in", "value": "Chief Manager Treasury Management Group", "role": "4"},
{"key":"sourik.saha@sbi.co.in", "value": "Dealer - Money Market", "role": "4"},
{"key":"manish.raj@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"madhura.k@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"vivek.gangwar@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"vikas_bhagotra@yahoo.com", "value": "Deputy Manager", "role": "4"},
{"key":"vivek.mahajan@sbi.co.in", "value": "Aassistant General Manager", "role": "4"},
{"key":"bveee@rediffmail.com", "value": "Deputy Manager", "role": "4"},
{"key":"purnima.jindal161@yahoo.in", "value": "Assistant Manager", "role": "4"},
{"key":"prabakar.a@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"s.usha@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"pankaj.srivastava@sbi.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"vananchaldumka@rediffmail.com", "value": "Deputy General Manager", "role": "4"},
{"key":"vermaskboi@yahoo.com", "value": "Chief Manager", "role": "4"},
{"key":"sarkar.swapankumar@gmail.com", "value": "Manager", "role": "4"},
{"key":"sunil.srivastava@sbi.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"sanjeev.jain@sbi.co.in", "value": "Assistant General Manager", "role": "4"},
{"key":"sanjay.d.kulkarni@sbi.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"sandhya.sahay@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"sandeep.khurana@sbi.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"sushil.relan@sbi.co.in", "value": "Assistant General Manager", "role": "4"},
{"key":"rashmi.mehetre@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"r.pratap@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"raveendra.sawkar@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"Raman.jha@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"rakesh.sikka@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"raju_suram@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"rajesh.sahay@sbi.co.in", "value": "Investment Councellor", "role": "5"},
{"key":"rajesh.rai@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"rajeev.singhal@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"raghvendra.p.pankaj@gmail.com", "value": "Assistant Manager", "role": "4"},
{"key":"m.chaudhary@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"t.anifa@sbi.co.in", "value": "none", "role": "4"},
{"key":"m.puri@sbi.co.in", "value": "Deputy Manager", "role": "4"},
{"key":"manisha.r@sbi.co.in", "value": "Dy Manager", "role": "4"},
{"key":"prasad.barje@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"ome.srivastava@sbi.co.in", "value": "Assistant General Manager", "role": "4"},
{"key":"navneet.kumar@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"nakasrinivas.rao@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"bitun@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"kapil.joshi@sbi.co.in", "value": "Credit Officer", "role": "4"},
{"key":"laxmi.yadav@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"lalita.nanal@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"ksvkumar6@gmail.com", "value": "Assistant Manager", "role": "4"},
{"key":"k.d@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"l.gollapudi@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"lm.mishra@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"jitendra.kashyap@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"deepak.parab@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"jayanthiraghavan@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"dillip.mishra@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"dhiraj.jha@sbi.co.in", "value": "MMGS II", "role": "4"},
{"key":"hemant.karaulia@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"harish.sachdeva@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"harish.kumar@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"harish.chander@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"hamidullah.syed@sbi.co.in", "value": "Chief Manager (SYS)", "role": "4"},
{"key":"deepak.sisodiya@sbi.co.in", "value": "Manager", "role": "4"},
{"key":"deepak.lingwal@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"gomesisp123@gmail.com", "value": "Chief Manager", "role": "4"},
{"key":"debasish.mishra@sbi.co.in", "value": "none", "role": "4"},
{"key":"drajsrivastava@rediffmail.com", "value": "Assistant General Manager", "role": "4"},
{"key":"dk.kulkarni@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"chitra.basker@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"devarakonda.s@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"kumar.birendra@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"bs.niphade@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"arun_chaudhary12@yahoo.com", "value": "Manager", "role": "4"},
{"key":"abhishek.sharma@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"anand.h@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"bhuvaneshwari.c@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"ajay.k.saxena@sbi.co.in", "value": "Chief Manager", "role": "4"},
{"key":"ashoke.patra@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"akash.damniwala@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"a.pandey@sbi.co.in", "value": "Branch Manager", "role": "4"},
{"key":"ashutosh.bhide@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"amitverma_3@sbi.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"ashwini.tewari@sbi.co.in", "value": "Assistant General Manager", "role": "4"},
{"key":"jagadish.paul@sbi.co.in", "value": "Investment Counselor", "role": "5"},
{"key":"bhavna.shah@sbi.co.in", "value": "Relationship Manager Private Banking", "role": "4"},
{"key":"vasudha_joshi@sbi.co.in", "value": "Relationship Manager Private Banking", "role": "4"},
{"key":"chetan.damani@sbi.co.in", "value": "Relationship Manager Private Banking", "role": "4"},
{"key":"ram.kejriwal@sbi.co.in", "value": "Relationhip Manager", "role": "4"},
{"key":"dipannitasil@rediffmail.com", "value": "Customer Relationship Executive", "role": "1"},
{"key":"ch.usops@statebank.com", "value": "Country Head", "role": "4"},
{"key":"alok.s@sbi.co.in", "value": "Dealer", "role": "3"},
{"key":"pn.jha@sbi.co.in", "value": "Dealer", "role": "3"},
{"key":"vineeta.j@sbi.co.in", "value": "Credit Analyst", "role": "5"},
{"key":"neeraj.satote@sbi.co.in", "value": "Team Leader - CSP", "role": "4"},
{"key":"ashalatha.govind@sbi.co.in", "value": "Deputy General Manager", "role": "7"},
{"key":"ashutosh.sagar@sbi.co.in", "value": "Relationship Manager Private Banking", "role": "4"},
{"key":"sbi.06055@sbi.co.in", "value": "Relationship Manager Private Banking", "role": "4"},
{"key":"mail2arungoel@gmail.com", "value": "Sr Management", "role": "4"},
{"key":"aravindsumi@yahoo.com", "value": "Deputy Manager", "role": "4"},
{"key":"meenapednekar@yahoo.co.uk", "value": "Divisional Manager", "role": "4"},
{"key":"vikas.batra@stockmart.co.in", "value": "Partner", "role": "4"},
{"key":"subhamcapital@gmail.com", "value": "Director", "role": "4"},
{"key":"vishal.mehta@subrasinvestments.com", "value": "Head - Wealth Managment", "role": "4"},
{"key":"tinnoo70@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"suhaslele@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"ravindra.sharma@sunlife.com", "value": "Head- Investment Projects", "role": "5"},
{"key":"ajit@sundarammutual.com", "value": "Head - Investment Products", "role": "6"},
{"key":"jharnab14@yahoo.com", "value": "Deputy Manager", "role": "4"},
{"key":"singhnehas@gmail.com", "value": "Manager-Sales", "role": "2"},
{"key":"maheshanchan@sundarammutual.com", "value": "Mutual Fund", "role": "4"},
{"key":"ajayb@sundarammutual.com", "value": "Vice President-Distribution", "role": "4"},
{"key":"vijayendiran@sundarammutual.com", "value": "Head - Global Business Development", "role": "4"},
{"key":"riyaranj@yahoo.com", "value": "Assistant Manager - Sales Support", "role": "2"},
{"key":"jayavenkitesh@gmail.com", "value": "Regional Sales Officer", "role": "2"},
{"key":"rahul@sundaramfinance.in", "value": "none", "role": "4"},
{"key":"sunrise.pradeep@gmail.com", "value": "Properitor", "role": "4"},
{"key":"moderninsurance@yahoo.com", "value": "Director", "role": "4"},
{"key":"suriseetaram@yahoo.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"faridfwd@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"suriseetaram@yahoo.com", "value": "IFA", "role": "4"},
{"key":"skdugar@bmd.net.in", "value": "Director", "role": "4"},
{"key":"sureshnair.trivandrum@gmail.com", "value": "Insurance and Investment Consultant", "role": "4"},
{"key":"ashwani@susheninvestments.com", "value": "Managing Director", "role": "0"},
{"key":"praveen.aggarwal@swadesfoundation.org", "value": "Chief Operating Officer", "role": "4"},
{"key":"mehta.a.2000@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"ajayb_singh@yahoo.co.in", "value": "Financial Consultant", "role": "4"},
{"key":"pramod.indore@gmail.com", "value": "Director", "role": "4"},
{"key":"swapconsultants@yahoo.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"cfpdsk@gmail.com", "value": "Consultant", "role": "4"},
{"key":"mumbai@systematixshares.com", "value": "Managing Director", "role": "0"},
{"key":"amiarpitmehta@gmail.com", "value": "Manager", "role": "4"},
{"key":"fca@vsnl.com", "value": "Proprietor", "role": "4"},
{"key":"aditya.malik@talentedge.in", "value": "none", "role": "4"},
{"key":"suresh.talwar@talwarthakore.com", "value": "Partner", "role": "4"},
{"key":"feroz.dubash@talwarthakore.com", "value": "Managing Associate", "role": "0"},
{"key":"shobhan.thakore@talwarthakore.com", "value": "Partner", "role": "4"},
{"key":"prakash_ailani@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"pankaj.agarwal@tata-aig.com", "value": "Senior Product Manager", "role": "3"},
{"key":"stellarj@rediffmail.com", "value": "Financial Advisor", "role": "4"},
{"key":"vikasgupta14@rediffmail.com", "value": "Business Associate", "role": "4"},
{"key":"rsj2067@rediffmail.com", "value": "Senior Business Associate", "role": "4"},
{"key":"anahitadriver@yahoo.co.in", "value": "Executive Advisor", "role": "1"},
{"key":"anilrpp@gmail.com", "value": "Executive Advisor", "role": "1"},
{"key":"girish.aswani@gmail.com", "value": "Training Manager BSP and DSF", "role": "4"},
{"key":"saviocrasto@tataamc.com", "value": "Assistant Vice President - Marketing", "role": "2"},
{"key":"habulsara@tata.com", "value": "Sr. Vice President & Chief Financial Officer", "role": "4"},
{"key":"mavis@tataamc.com", "value": "Deputy Manager", "role": "4"},
{"key":"gbabu@tataamc.com", "value": "Head of Information Technology", "role": "4"},
{"key":"kkalwachwala@tataamc.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"racharya@tataamc.com", "value": "Fixed Income Portfolio Manager", "role": "5"},
{"key":"ajoglekar@tata.com", "value": "Head of Desk/Chief Dealer", "role": "4"},
{"key":"ajoglekar@tataamc.com", "value": "General Manager - Dealing", "role": "4"},
{"key":"abhole@tataamc.com", "value": "Research Analyst", "role": "5"},
{"key":"jshetty@tataamc.com", "value": "Dealer", "role": "4"},
{"key":"naineshr@tataamc.com", "value": "Research Analyst", "role": "5"},
{"key":"pgokhale@tataamc.com", "value": "Senior Portfolio Manager", "role": "4"},
{"key":"rsbhalerao@tataamc.com", "value": "Portfolio Manager", "role": "4"},
{"key":"vrana@tataamc.com", "value": "Dealer", "role": "4"},
{"key":"sdeshmukh@tataamc.com", "value": "Product Head - Institutional Sales", "role": "2"},
{"key":"pchowdhury@tata.com", "value": "Head International Business Division", "role": "6"},
{"key":"dmalik@tataamc.com", "value": "none", "role": "4"},
{"key":"sshrivastava@tataamc.com", "value": "Deputy Manager", "role": "4"},
{"key":"rrathore@tataamc.com", "value": "Senior Manager - Products", "role": "6"},
{"key":"smehta@tataamc.com", "value": "none", "role": "4"},
{"key":"sandhirsharma@tataamc.com", "value": "Head - Alliances,  Product & New Initiatives", "role": "6"},
{"key":"rsaxena@tataamc.com", "value": "Product Head - Alternate Channel", "role": "6"},
{"key":"fkkavarana@tata.com", "value": "Chairman", "role": "0"},
{"key":"asethi@tata.com", "value": "Managing Director and Chief Executive Officer", "role": "0"},
{"key":"amleshk@tataamc.com", "value": "Manager", "role": "4"},
{"key":"18.amit.kumar@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"amitkumar@tataamc.com", "value": "Relationship Manger -Sales", "role": "2"},
{"key":"swadesh@tataamc.com", "value": "Area Manager", "role": "2"},
{"key":"kashmira.mewawala@tatacapital.com", "value": "Head - Business Development", "role": "4"},
{"key":"privateequity@tatacapital.com", "value": "Managing partner", "role": "0"},
{"key":"ashish.jain@tatacapital.com", "value": "Product Manager", "role": "3"},
{"key":"kadambari.daptardar@tatacapital.com", "value": "Financial Advisor", "role": "4"},
{"key":"amit.mukherjee@tatacapital.com", "value": "National Sales Manager Õ¢ëÑëÐ Wealth Management & Distribution", "role": "2"},
{"key":"bobby.pauly@tatacapital.com", "value": "Private Equity", "role": "5"},
{"key":"vineet.chadha@tatacapital.com", "value": "Private Equity", "role": "5"},
{"key":"payal.bham@tatacapital.com", "value": "none", "role": "4"},
{"key":"devendra.sarmalkar@tatacapital.com", "value": "Senior Manager - Private Client Group", "role": "4"},
{"key":"praveenkadle@tatacapital.com", "value": "Chief Financial Officer", "role": "4"},
{"key":"sanjay.sharma@tatacapital.com", "value": "Head of Direct Sales and Investment Business", "role": "2"},
{"key":"govind.s@tatacapital.com", "value": "Chief Financial Officer and Chief Operating Officer", "role": "4"},
{"key":"mufaddal.pittalwala@tatacapital.com", "value": "A V P", "role": "4"},
{"key":"neilesh.nerurkar@tcs.com", "value": "General Manager", "role": "4"},
{"key":"sriram.chatty@gmail.com", "value": "Head of Technology Solutions", "role": "7"},
{"key":"ankitswaika@yahoo.com", "value": "Assistant Systems Engineer", "role": "4"},
{"key":"nachiappan.r@tatacapital.com", "value": "Senior Manager - Products and Investments", "role": "3"},
{"key":"kuheli.basu@tatacapital.com", "value": "Sr Manager", "role": "4"},
{"key":"taulafamily@hotmail.com", "value": "Propritor", "role": "4"},
{"key":"sadanand.shetty@taurusmutualfund.com", "value": "Vice President & Senior Fund Manager", "role": "5"},
{"key":"rahul.pal@taurusmutualfund.com", "value": "Head-Fixed Income", "role": "5"},
{"key":"ramesh.kabra@taurusmutualfund.com", "value": "Head-Product Development", "role": "6"},
{"key":"waqar.naqvi@taurusmutualfund.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"rkgupta@taurusmutualfund.com", "value": "Managing Director", "role": "0"},
{"key":"wm@tbngconsultants.com", "value": "Product Manager", "role": "3"},
{"key":"tarun@tbngconsultants.com", "value": "Founder & Chief Executive Officer", "role": "1"},
{"key":"n.vyas@ticb.com", "value": "Manager - Finance and Accounts", "role": "7"},
{"key":"riteshsheth@tejasconsultancy.co.in", "value": "Managing Director", "role": "0"},
{"key":"teena@teamgenus.com", "value": "Director", "role": "4"},
{"key":"ashley.coutinho@expressindia.com", "value": "Special Correspondent", "role": "4"},
{"key":"thefinancialmall@gmail.com", "value": "Planner", "role": "4"},
{"key":"sumitmehra04@yahoo.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"manishcfp@gmail.com", "value": "Senior Faculty", "role": "4"},
{"key":"sekaransc@gmail.com", "value": "Manager", "role": "4"},
{"key":"joy.c@timesgroup.com", "value": "Director", "role": "4"},
{"key":"prerana@thetippingpoint.firm.in", "value": "Partner", "role": "4"},
{"key":"a.apte@thetippingpoint.firm.in", "value": "Partner", "role": "4"},
{"key":"shefali.anand@wsj.com", "value": "Markets & Finance Editor,  India Bureau", "role": "4"},
{"key":"amit@thinkconsultants.net", "value": "Director", "role": "4"},
{"key":"parag@thinkconsultants.net", "value": "Cofounder", "role": "4"},
{"key":"ranjit@thinkconsultants.net", "value": "Cofounder", "role": "4"},
{"key":"simi.mishra@thomsonreuters.com", "value": "Assistant Vice President & Global Lead - Production", "role": "3"},
{"key":"sweety.sabhandasani@thomsonreuters.com", "value": "Account Manager", "role": "4"},
{"key":"Chetan.kajaria@thomsonreuters.com", "value": "Sales Specialist", "role": "2"},
{"key":"Shrikant.tiwari@thomsonreuters.com", "value": "Sales Specialist", "role": "2"},
{"key":"vikram.singh@thomsonreuters.com", "value": "Head of Sales-Investor & Trading", "role": "2"},
{"key":"balakrishnan.ilango@thomsonreuters.com", "value": "Business Development Manager - Solution Sales", "role": "2"},
{"key":"karan.batra@thomsonreuters.com", "value": "Global Accounts", "role": "7"},
{"key":"zulfiqar.naqvi@thomsonreuters.com", "value": "Business Community Owner - Trading india", "role": "4"},
{"key":"sangeetavaidy@hotmail.com", "value": "none", "role": "4"},
{"key":"timeinvestment@hotmail.com", "value": "Propreitor", "role": "4"},
{"key":"hemant.arora@timesgroup.com", "value": "Business Head - Branded Content", "role": "0"},
{"key":"nitin.shingala@tmf-group.com", "value": "Regional Director - India", "role": "4"},
{"key":"Prajit.Nanu@tmf-group.com", "value": "Director - Global Business Development", "role": "4"},
{"key":"baskaran4@yahoo.co.in", "value": "Manager", "role": "4"},
{"key":"samir@tradenetstockbroking.com", "value": "Director", "role": "4"},
{"key":"satish@transcend-india.com", "value": "Consultant", "role": "4"},
{"key":"bhakti_gashkata@ymail.com", "value": "Trainee - Financial Planner", "role": "4"},
{"key":"bronil@live.com", "value": "Trainee - Financial Planner", "role": "4"},
{"key":"harris_2591@yahoo.com", "value": "Trainee - Financial Planner", "role": "4"},
{"key":"nortonblaiseathaide@yahoo.in", "value": "Trainee - Financial Planner", "role": "4"},
{"key":"russellrockz@gmail.com", "value": "Trainee - Financial Planner", "role": "4"},
{"key":"kartik@transcend-india.com", "value": "Director", "role": "4"},
{"key":"trendy.investments@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"kcsvalsad@gmail.com", "value": "Owner", "role": "4"},
{"key":"utpal.sheth@trustgroup.co.in", "value": "Founder", "role": "4"},
{"key":"nipa.sheth@trustgroup.co.in", "value": "Director", "role": "4"},
{"key":"kuljit.kohli@gmail.com", "value": "Financial Architect", "role": "4"},
{"key":"heeru.pricelss@gmail.com", "value": "Relationship Manager - Debt Capital Markets", "role": "4"},
{"key":"jayeeta.sen@trustplutus.com", "value": "Director - Key Clients", "role": "4"},
{"key":"rajendra.kalur@trustplutus.com", "value": "Director and Chief Executive Officer", "role": "1"},
{"key":"vikash.kothari@trustplutus.com", "value": "Director - Client Relationship", "role": "4"},
{"key":"tharejasanjeev@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"tvkfinancialplanners@gmail.com", "value": "Partner", "role": "4"},
{"key":"shyamal.lahon@tvscapital.in", "value": "Associate", "role": "4"},
{"key":"gopal.srinivasan@tvscapital.in", "value": "Chairman and Managing Director", "role": "0"},
{"key":"anubhav.agarwal@ubs.com", "value": "Director", "role": "4"},
{"key":"aashish.kamat@ubs.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"aniruddha.ganguly@ubs.com", "value": "Chief of Staff for India", "role": "8"},
{"key":"bhaskarabhilash@gmail.com", "value": "Manager Products- Third Party", "role": "3"},
{"key":"vijaydnagrawal@gmail.com", "value": "Vice President - Products", "role": "3"},
{"key":"harsh@unificap.com", "value": "Senior Relationship Manager", "role": "4"},
{"key":"nitya.chatterjee@unionkbc.com", "value": "Assistant Vice President", "role": "4"},
{"key":"joseph.idichandy@unionkbc.com", "value": "Head-Customer Service", "role": "4"},
{"key":"compliance@unionkbc.com", "value": "Head - Compliance", "role": "4"},
{"key":"lovelish.solanki@unionkbc.com", "value": "Dealer-Equity", "role": "5"},
{"key":"tarun.singh@unionkbc.com", "value": "Dealer-Fixed Income", "role": "5"},
{"key":"devesh.thacker@unionkbc.com", "value": "Fund Manager-Fixed income", "role": "5"},
{"key":"parijat.agrawal@unionkbc.com", "value": "Head-Fixed Income", "role": "5"},
{"key":"arunava.chowdhury@unionkbc.com", "value": "Head - Institutional Sales", "role": "2"},
{"key":"p.jaideep@unionkbc.com", "value": "Head Retail Sales", "role": "2"},
{"key":"g.pradeepkumar@unionkbc.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"ajay.chandra@unitechgroup.com", "value": "Managing Director", "role": "0"},
{"key":"sri@usf.vc", "value": "Partner", "role": "4"},
{"key":"shailendra.dubey@universaltrustees.co.in", "value": "Business Development", "role": "2"},
{"key":"ashvini.chopra@universaltrustees.co.in", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"chanpreetss@yahoo.com", "value": "Vice President - Operationa", "role": "7"},
{"key":"rajiv_satija@yahoo.com", "value": "Proprietor", "role": "4"},
{"key":"bhushan@orbitfin.com", "value": "Managing Director", "role": "0"},
{"key":"biswanath_chowdhury2006@yahoo.com", "value": "none", "role": "4"},
{"key":"navnath.rundekar@uti.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"ns.ramesh@gmail.com", "value": "Senior Vice President - Head (Business Development) Banking Channel", "role": "4"},
{"key":"Khurshid.Mistry@uti.co.in", "value": "Associate Vice President - Corporate Communications Cell", "role": "4"},
{"key":"sanobar.pradhan@uti.co.in", "value": "Corporate Communication", "role": "2"},
{"key":"gaurav.suri@uti.co.in", "value": "Head of Marketing & Distribution", "role": "2"},
{"key":"satish.dikshit@uti.co.in", "value": "Head of Risk", "role": "7"},
{"key":"subicha2170@yahoo.co.in", "value": "Regional Operations Coordinator", "role": "7"},
{"key":"avshankar2002@yahoo.co.in", "value": "Manager General Business", "role": "4"},
{"key":"lalit.nambiar@uti.co.in", "value": "Fund Manager & Head Research", "role": "5"},
{"key":"Davino.Antony@uti.co.in", "value": "Product Head - Equities", "role": "6"},
{"key":"Niraj.Chandra@uti.co.in", "value": "Manager - Products", "role": "6"},
{"key":"anoop.bhaskar@uti.co.in", "value": "Head - Equity", "role": "5"},
{"key":"amandeep.chopra@uti.co.in", "value": "President and Head - Fixed Income", "role": "5"},
{"key":"k.basu@uti.co.in", "value": "Fund Manager", "role": "5"},
{"key":"sanjay.dongre@uti.co.in", "value": "Fund Manager", "role": "5"},
{"key":"utiwms@uti.co.in", "value": "Portfolio Manager", "role": "4"},
{"key":"swati.kulkarni@uti.co.in", "value": "Fund Manager", "role": "5"},
{"key":"v.srivatsa@uti.co.in", "value": "Fund Manager", "role": "5"},
{"key":"paresh.parikh@uti.co.in", "value": "Vice President", "role": "4"},
{"key":"ns.ramesh@uti.co.in", "value": "HEAD - BUSINESS DEVELOPMENT (BANKING CHANNEL)", "role": "2"},
{"key":"balram.bhagat@uti.co.in", "value": "CEO - UTI Pension Fund", "role": "0"},
{"key":"prerak_desai@yahoo.com", "value": "Chief Manager", "role": "4"},
{"key":"parijat2k@gmail.com", "value": "Asst Vice President", "role": "4"},
{"key":"t.sreenivasan@uti.co.in", "value": "Manager", "role": "4"},
{"key":"satish.tonape@uti.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"santosh2a@yahoo.com", "value": "Relationship Manager", "role": "4"},
{"key":"s.subramonian@uti.co.in", "value": "Relationship Manager", "role": "4"},
{"key":"ruchira.a.singhal@gmail.com", "value": "Manager", "role": "4"},
{"key":"rajesh.bhagat@uti.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"rraja28@yahoo.com", "value": "Senior Vice President", "role": "4"},
{"key":"m.mukhopadhyay@uti.co.in", "value": "Chief Manager", "role": "4"},
{"key":"niranjan.das@uti.co.in", "value": "Assistant Manager", "role": "4"},
{"key":"dnyanendra@yahoo.com", "value": "Manager", "role": "4"},
{"key":"d.kallianpur@uti.co.in", "value": "Regional Head (West)", "role": "4"},
{"key":"h.ramani@uti.co.in", "value": "Head of Sales", "role": "2"},
{"key":"mandar.kadam@uti.co.in", "value": "Assistant Vice President - Sales & Marketing - PMS Division", "role": "2"},
{"key":"acting.ceo@uti.co.in", "value": "Acting CEO- Chief Financial officer", "role": "0"},
{"key":"md@uti.co.in", "value": "Managing Director", "role": "0"},
{"key":"karan.singh@uti.co.in", "value": "Executive Vice-President & Country Head Banking Channel", "role": "1"},
{"key":"manisha.shah@uti.co.in", "value": "Relationship Manager", "role": "4"},
{"key":"rajesh.lokhande@uti.co.in", "value": "none", "role": "4"},
{"key":"nitin.raje@uti.co.in", "value": "Chief Manager", "role": "4"},
{"key":"p.shunmugam@uti.co.in", "value": "Manager", "role": "4"},
{"key":"ramakrishna@utthishta.com", "value": "none", "role": "4"},
{"key":"vivekrege@vrwealthadvisors.com", "value": "Managing Director", "role": "0"},
{"key":"sandra.correia@vecinvestments.com", "value": "Investment Director", "role": "5"},
{"key":"santhosh.belavadi@investwise.in", "value": "Managing Director", "role": "0"},
{"key":"mehmoodkhan@v5financialplanners.org", "value": "Partner", "role": "4"},
{"key":"vlad6471@hotmail.com", "value": "Financial Planner", "role": "4"},
{"key":"bomi@vaishlaw.com", "value": "Partner", "role": "4"},
{"key":"ravikjain26@gmail.com", "value": "Investment Consultant", "role": "4"},
{"key":"psjayakumar@vbhc.com", "value": "Managing Director", "role": "0"},
{"key":"info@valueplusinv.com", "value": "Wealth Manager", "role": "4"},
{"key":"mili.valueplus@gmail.com", "value": "Wealth Manager", "role": "4"},
{"key":"hpshah@valueplusinv.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"bdm@valueplusinv.com", "value": "Senior Manager - Marketing", "role": "2"},
{"key":"janivarun04@gmail.com", "value": "Assistant Manager Financial Planning", "role": "4"},
{"key":"dhirendra@valueresearch.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"sanjay@sanjaybakshi.net", "value": "Managing Partner", "role": "0"},
{"key":"paresh@valuequestcapital.com", "value": "Founder", "role": "4"},
{"key":"bakhtavar4u@gmail.com", "value": "Faculty", "role": "4"},
{"key":"piyush.scorpion@gmail.com", "value": "Branch Manager", "role": "4"},
{"key":"sachin.gupta@varhadcapital.com", "value": "Director", "role": "4"},
{"key":"dahapute@varhadcapital.com", "value": "Managing Director", "role": "0"},
{"key":"larrycooperbanks@gmail.com", "value": "Associate Vice President", "role": "4"},
{"key":"kalpeshashar6@yahoo.co.in", "value": "Investment Advisor", "role": "5"},
{"key":"sahad@vccircle.com", "value": "Editor & Publisher", "role": "0"},
{"key":"lallit1@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"jeet@veerconsultancy.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"info@ventureintelligence.in", "value": "Founder and Director", "role": "0"},
{"key":"info@ventureast.net", "value": "Managing Partner", "role": "0"},
{"key":"ravi.kiran@venturenursery.com", "value": "Co-founder", "role": "4"},
{"key":"apoorv.sharma@venturenursery.com", "value": "Executive Vice President", "role": "1"},
{"key":"shravan.shroff@venturenursery.com", "value": "Co-founder", "role": "4"},
{"key":"puneetmalik235@yahoo.co.in", "value": "Manager", "role": "4"},
{"key":"ramandeep.singh@verdantindia.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"investments@veteassociates.com", "value": "none", "role": "4"},
{"key":"anthonys@vfsglobal.com", "value": "Assistant Manager", "role": "4"},
{"key":"murali.fp@live.in", "value": "Financial Planner", "role": "4"},
{"key":"vk_arya2007@yahoo.co.in", "value": "Propreitor", "role": "4"},
{"key":"vuyyala_raj1962@yahoo.co.in", "value": "Managing Partner", "role": "0"},
{"key":"vip_bhatt123@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"nitinjpopat@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"contact@vsoftsolutions.net", "value": "Founder and Director", "role": "4"},
{"key":"pinakin_net4u@yahoo.com", "value": "PROPRITOR", "role": "4"},
{"key":"viralbhatt5678@gmail.com", "value": "Partner", "role": "4"},
{"key":"hellovishalshah@yahoo.co.in", "value": "Associate Faculty (CFP) and Financial Planner", "role": "4"},
{"key":"vikranth.pothireddy@gmail.com", "value": "Financial Adviser / Financial Planner", "role": "4"},
{"key":"vsmp_lic@rediffmail.com", "value": "Advisor", "role": "4"},
{"key":"gaurangpg@gmail.com", "value": "Director", "role": "4"},
{"key":"vishal@cedarwood.co.in", "value": "Co-founder", "role": "4"},
{"key":"ymsabnis@vskindia.com", "value": "Director", "role": "4"},
{"key":"pvsupkca@yahoo.com", "value": "none", "role": "4"},
{"key":"vinayak.sapre@vvsventures.com", "value": "Director", "role": "4"},
{"key":"marylou.bilawala@wadiaghandy.com", "value": "Partner", "role": "4"},
{"key":"shabnum.kajiji@wadiaghandy.com", "value": "Partner", "role": "4"},
{"key":"ashish.ahuja@wadiaghandy.com", "value": "Managing Partner", "role": "0"},
{"key":"goswami@waltonst.com", "value": "Managing Director", "role": "0"},
{"key":"ghazala.khatri@warmond.co.in", "value": "Head - Legal and compliance", "role": "7"},
{"key":"gokul_das@warmond.co.in", "value": "Managing Director & CEO", "role": "0"},
{"key":"soumya.rajan@waterfieldadvisors.com", "value": "Managing Director", "role": "0"},
{"key":"sridhar.kurpad@waterfieldadvisors.com", "value": "Director - Operations", "role": "7"},
{"key":"arpan.des@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"msneela@rediffmail.com", "value": "Wealth Management", "role": "4"},
{"key":"jayantibose123@yahoo.com", "value": "Manager", "role": "4"},
{"key":"tssrini@yahoo.com", "value": "Financial Planner Chief Consultant and Trainer", "role": "4"},
{"key":"wealman@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"abhay.amrite@wai.in", "value": "none", "role": "4"},
{"key":"mahadevan@wai.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"shila.thakkar@gmail.com", "value": "Independent Financial Advisor", "role": "4"},
{"key":"rahuls@wealth-first.com", "value": "none", "role": "4"},
{"key":"nimeshk@wealth-first.com", "value": "none", "role": "4"},
{"key":"puravm@wealth-first.com", "value": "Financial Planner", "role": "4"},
{"key":"ashish@wealthfirst.biz", "value": "Director", "role": "4"},
{"key":"ajit@kucheria.co.in", "value": "Director", "role": "4"},
{"key":"priti@kucheria.co.in", "value": "Director", "role": "4"},
{"key":"srikanth@fundsindia.com", "value": "Chief Operating Officer", "role": "4"},
{"key":"narendra@wealthjunction.co.in", "value": "Chief Executive Officer", "role": "0"},
{"key":"rajen@wealthmanindia.com", "value": "Wealth Advisor", "role": "4"},
{"key":"ajit@wealthmanagers.co.in", "value": "Porfolio Manager", "role": "4"},
{"key":"bharat@wealthmanagers.co.in", "value": "Director", "role": "4"},
{"key":"smehta@wealthx.com", "value": "Head of Business Development", "role": "2"},
{"key":"wealthcare_hyd@yahoo.com", "value": "Founder", "role": "4"},
{"key":"wealthcarein@gmail.com", "value": "Owner", "role": "4"},
{"key":"padmacfp@gmail.com", "value": "Financial Planning and CFP Coaching", "role": "4"},
{"key":"vijayan.pankajakshan@welingkar.org", "value": "Dean - Human Resources", "role": "8"},
{"key":"nameeta.vaalanj@welingkar.org", "value": "Assistant Professor", "role": "4"},
{"key":"bijoy.bhattacharyya@welingkar.org", "value": "Professor", "role": "4"},
{"key":"ab.bajaj@gmail.com", "value": "none", "role": "4"},
{"key":"shanthiraj.p@wholelifefin.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"deven@wikipaisa.com", "value": "Founder", "role": "4"},
{"key":"kkmfinance@yahoo.com", "value": "Analyst", "role": "4"},
{"key":"vishalsvete@gmail.com", "value": "Financial Planner", "role": "4"},
{"key":"smart_hiten@yahoo.co.in", "value": "Proprietor", "role": "4"},
{"key":"muthu@wisewealthadvisors.com", "value": "Chief Financial Planner", "role": "4"},
{"key":"hrustagi@wiseinvestadvisors.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"rajalakshmi@wiseinvestadvisors.com", "value": "Vice President", "role": "4"},
{"key":"sunil.sharma@wodehousecapital.com", "value": "Chief Investment Officer", "role": "5"},
{"key":"manmohan.tiwana@wodehousecapital.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"Manish.Malhotra@gold.org", "value": "Key Relationships", "role": "4"},
{"key":"wudstreet@gmail.com", "value": "Chief Executive Officer", "role": "0"},
{"key":"rohit.lall@yesbank.in", "value": "Product Manager", "role": "3"},
{"key":"abhishek.anchlia@yesbank.in", "value": "Senior Manager", "role": "4"},
{"key":"ashutosh.mohta@yesbank.in", "value": "Corporate Finance", "role": "4"},
{"key":"niranjan.banodkar@yesbank.in", "value": "Senior Manager", "role": "4"},
{"key":"nirav.dalal@yesbank.in", "value": "Director", "role": "4"},
{"key":"rana.kapoor@yesbank.in", "value": "Managing Director & Chief Executive Officer", "role": "0"},
{"key":"gkkanth@gmail.com", "value": "Manager", "role": "4"},
{"key":"rohit.agarwal@yesbank.in", "value": "Vice President", "role": "4"},
{"key":"aujla22@gmail.com", "value": "Manager", "role": "4"},
{"key":"namita.vikas@yesbank.in", "value": "Country Head - Responsible Banking", "role": "3"},
{"key":"aditya.sanghi@yesbank.in", "value": "Co Founder and Senior Managing Director", "role": "0"},
{"key":"malhotrasvarun@gmail.com", "value": "Manager", "role": "4"},
{"key":"devamalya.dey@yesbank.in", "value": "Executive Vice President & Country Head - Audit & Compliance", "role": "1"},
{"key":"ashish.nasa@yesbank.in", "value": "Program Head - Yes First", "role": "4"},
{"key":"bhavani.ranjeet@gmail.com", "value": "Relationship Manager", "role": "4"},
{"key":"rajat.monga@yesbank.in", "value": "Group President- Financial Markets & Chief Financial Officer", "role": "1"},
{"key":"vanit.ladha@yesbank.in", "value": "Product Manager", "role": "3"},
{"key":"jacob.kurien@yesbank.in", "value": "Senior Vice President - Product Development", "role": "3"},
{"key":"shubhada.rao@yesbank.in", "value": "Chief Economist", "role": "5"},
{"key":"suren.shetty@yesbank.in", "value": "President & Chief Technology Officer - Banking Solutions", "role": "1"},
{"key":"prerana.langa@yesbank.in", "value": "Yes Foundation", "role": "0"},
{"key":"santosh.shetti@yesbank.in", "value": "Program Manager - Investment Products & Research", "role": "3"},
{"key":"dalvi.nandu@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"framrozshares@yahoo.com", "value": "Director", "role": "4"},
{"key":"rajesh_jogdand@hotmail.com", "value": "Partner", "role": "4"},
{"key":"yogeshjon_86@yahoo.com", "value": "Individual Financial Advisor", "role": "4"},
{"key":"zakirk@hotmail.com", "value": "Proprietor", "role": "4"},
{"key":"meenakshi.s@rediffmail.com", "value": "Senior Research Analyst", "role": "5"},
{"key":"jvg@zensecmail.com", "value": "Branch Manager", "role": "4"},
{"key":"zorbainvestments@gmail.com", "value": "Proprietor", "role": "4"},
{"key":"mkpatel141@gmail.com", "value": "Managing Director", "role": "0"},
{"key":"deb@zyfin.com", "value": "Vice President - Research", "role": "5"},
{"key":"mr.jignesh.shah@gmail.com", "value": "Founder & Owner", "role": "4"},
{"key":"krishnasheshan@gmail.com", "value": "Vice President", "role": "4"},
{"key":"ramesh@entrust.co.in", "value": "Director/ Partner", "role": "4"},
{"key":"priyanka@quantumamc.com", "value": "none", "role": "4"}
];
          // for (var i = emailArray.length - 1; i >= 0; i--) {
          //      $http({
          //       method: 'DELETE',
          //       url: '/api/mmiusers/deletemailusers/'+emailArray[i]
          //     }).
          //     success(function(data, status, headers, config) {
          //       console.log('delete---'+email);

          //     }).
          //     error(function(data, status, headers, config) {
          //       console.log('problem in delete --'+email);
          //      });
          //    }

             // for (var i = emailArray.length - 1; i >= 0; i--) {
             //   (function(j){
             //    setTimeout(function(){
             //    $http({
             //    method: 'PUT',
             //    url: '/api/mmiusers/updateemailusers/'+emailArray[j].key,
             //    data:{jobtitle:emailArray[j].value,adminrole:emailArray[j].role},
             //  }).
             //  success(function(data, status, headers, config) {
             //    console.log('update---'+emailArray[j].key);

             //  }).
             //  error(function(data, status, headers, config) {
             //    console.log('problem in update --'+emailArray[j].key);
             //   });
             //   },(emailArray.length-j)*1000);
             //  })(i);
             // }
             break;

        case 'articles':
          $scope.gridArticleData = {};
          $http({
            method: 'GET',
            url: 'api/articles/newbasic'
          }).
          success(function(data, status, headers, config) {
            $scope.gridArticleData = data.articles;
            $scope.originalArticalData = angular.copy(data.articles);

          }).
          error(function(data, status, headers, config) {

          });

          break;
          case 'discussion':
          $scope.gridArticleData = {};
          $http({
            method: 'GET',
            url: 'api/discussions'
          }).
          success(function(data, status, headers, config) {
            $scope.gridDiscussionData = data.discussion;
            $scope.originalDiscussionData = angular.copy(data.discussion);

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
            url: 'api/companys/basic?filter=' + JSON.stringify($scope.companyFilter)
          }).
          success(function(data, status, headers, config) {
            $scope.gridCompanyData = data.company;

          }).
          error(function(data, status, headers, config) {

          });

          break;

        case 'attachments':
          $scope.gridAttachmentsData = {};
          $http({
            method: 'GET',
            url: 'api/attachments/basic'
          }).
          success(function(data, status, headers, config) {
            $scope.gridAttachmentsData = data.attachments;

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
    $scope.setPagingData = function(data, page, pageSize) {
      // $scope.myData = data;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    //watch for pagination option.here pagingOptions will be watched each time value changes and then set the data accordingly
    $scope.$watch('pagingOptions', function(newVal, oldVal) {
      if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
          
          if ($scope.mainPage === 'articles') {
            $scope.filterArticle($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
          } else if ($scope.mainPage === 'mmiusers') {
            $scope.filterMMIUsers($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
          } else if ($scope.mainPage === 'users' || $scope.mainPage === 'contentexpert') {
            $scope.filterPINUsers($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
          }

       }
    }, true);

    $scope.$watch('filterOptions', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        if ($scope.mainPage === 'articles') {
          $scope.filterArticle($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        } else if ($scope.mainPage === 'mmiusers') {
          $scope.filterMMIUsers($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        } else if ($scope.mainPage === 'users' || $scope.mainPage === 'contentexpert') {
          $scope.filterPINUsers($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
      }
    }, true);

    var editDeleteArticleTemplate =
      '<a ng-click="deleteArticle(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/articles/view/{{row.entity._id}}"  id="view"  class="label label-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/articles/edit/{{row.entity._id}}"  id="view"  class="label label-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

    $scope.articleData = {
      data: 'gridArticleData',
      // enablePaging: true,
      // showFooter: true,
      // totalServerItems: 'totalServerItems',
      // pagingOptions: $scope.pagingOptions,
      enableColumnResize: true,
      enableCellSelection: true,
      enableRowSelection: false,
      showFilter: true,
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
        {
          field: 'createdAt',
          displayName: 'Date',
          cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
          cellClass: 'grid-align'
        }, {
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
   
   var editDeleteADMINuserTemplate =
      '<span ng-if="currentUser.superadmin === true && currentUser._id !== row.entity._id" ><span ng-if="row.entity.status" class="label label-info" ng-click="adminStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="adminStatus(row.entity._id)">Approve</span></span> <a ng-if="currentUser.superadmin === true && currentUser._id !== row.entity._id" ng-click="deleteAdminUser(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a>';

    $scope.adminuserData = {
      data: 'gridAdminUserData',
      showGroupPanel: false,
      // enableCellSelection: true,
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
          width: '300px',
          cellClass: 'grid-align'
        },
        //  {
        //   field: 'username',
        //   displayName: 'UserName',
        //   width: '200px',
        //   cellClass: 'grid-align'
        // },
         {
          field: 'lastLogin',
          displayName: 'Last logged in ',
          cellTemplate: '<span> {{row.entity.lastLogin|date:"dd-MM-yyyy hh:mm:ss"}}</span>',
          cellClass: 'grid-align'
        },
        // ,
        // {
        //   field: 'status',
        //   displayName: 'Status',
        //   cellTemplate: '<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'
        // }
         {
            field: 'status',
            displayName: 'Status',
            cellTemplate: '<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'
        },{
          field: '',
          displayName: '',
          cellTemplate: editDeleteADMINuserTemplate,
          maxWidth: 100
        }
      ],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.contentexpertData = {
      data: 'gridContentExpertData',
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
        width: '200px',
        cellClass: 'grid-align'
      }, {
        field: 'createdAt',
        displayName: 'Date',
        cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
        cellClass: 'grid-align'
      }, {
        field: 'madebyadmin',
        displayName: 'Made by Admin',
        cellTemplate: '<span ng-if="row.entity.madebyadmin" class="label label-success" >Yes</span><span ng-if="!row.entity.madebyadmin" class="label label-danger" >No</span>'
      }, {
        field: 'status',
        displayName: 'Status',
        cellTemplate: '<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'
      }, {
        field: 'action',
        displayName: 'Action',
        cellTemplate: '<span ng-if="row.entity.madebyadmin"><span ng-if="row.entity.status" class="label label-info" ng-click="contentexpertStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="contentexpertStatus(row.entity._id)">Approve</span></span> '
      }
      ],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };

    $scope.discussionData = {
      data: 'gridDiscussionData',
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
        field: 'title',
        displayName: 'Title',
        cellClass: 'grid-align'
      }, {
        field: 'topic',
        displayName: 'Topic',
        width: '200px',
        cellClass: 'grid-align'
      }, {
        field: 'createdAt',
        displayName: 'Date',
        cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
        cellClass: 'grid-align'
      },
        {
          field: 'pin',
          displayName: 'PIN',
          cellTemplate: '<span ng-if="row.entity.pin" class="label label-success" >YES</span><span ng-if="!row.entity.pin" class="label label-danger">NO</span>',
          width: '50px'
        },

        {
          field: 'money',
          displayName: 'MMI',
          cellTemplate: '<span ng-if="row.entity.money" class="label label-success" >YES</span><span ng-if="!row.entity.money" class="label label-danger" >NO</span>',
          width: '50px'
        },
         {
          field: 'money',
          displayName: 'TMH',
          cellTemplate: '<span ng-if="row.entity.hans" class="label label-success" >YES</span><span ng-if="!row.entity.hans" class="label label-danger" >NO</span>',
          width: '50px'
         },
        {
          field: 'status',
          displayName: 'Status',
          cellTemplate: '<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'
        },
        {
        field: 'action',
        displayName: 'Action',
        cellTemplate: '<a  ng-if="!row.entity.hans" ng-href="/discussion-start?cid={{row.entity.cid}}"  id="view"  class="label label-info" data-toggle="tooltip">Comments <i class="fa  fa-comment"></i></a><a  ng-if="row.entity.hans" href="https://disqus.com/"  id="view"  class="label label-info" data-toggle="tooltip" target="_blank">Comments <i class="fa  fa-comment"></i></a><span ng-if="row.entity.status" class="label label-info" ng-click="discussionStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="discussionStatus(row.entity._id)">Approve</span>'
         
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
          width: '200px',
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
        }, {
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
        }, {
          field: 'action',
          displayName: 'Action',
          cellTemplate: '<span ng-if="row.entity.status" class="label label-info" ng-click="userStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="userStatus(row.entity._id)">Approve</span> '
        }, {
          field: 'detail',
          displayName: 'Detail',
          cellTemplate: '<span  class="label label-info" ng-click="userDetail(row.entity._id,1)">Detail</span>'
        }
      ],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };
var editDeleteMMMIuserTemplate =
      '<a ng-click="deleteMMIUser(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a><a ng-href="/mmiusers/edit/{{row.entity._id}}"  id="view"  class="label label-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';


    $scope.mmiuserData = {
      data: 'gridMMIUserData',
      // showGroupPanel: true ,
      // enableCellSelection: true,
      enablePaging: true,
      showFooter: true,
      totalServerItem :'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      enableColumnResize: true,
      enableRowSelection: false,
      filterOptions: $scope.filterOptions,
      columnDefs: [{
          field: '_id',
          displayName: 'SN',
          cellTemplate: '<span> {{row.rowIndex+1}}</span>',
          cellClass: 'grid-align',
          width: '30px'
        }, {
          field: 'firstname',
          displayName: 'Name',
          cellTemplate: '<span> {{row.entity.firstname }} {{ row.entity.lastname }}</span>',
          cellClass: 'grid-align'
        }, {
          field: 'email',
          displayName: 'Email',
          cellClass: 'grid-align'
        },
        {
          field: 'company',
          displayName: 'Company',
          cellTemplate: '<span> {{row.entity.company.title}}</span>',
          cellClass: 'grid-align'
        },
        // { field: 'band' ,displayName:'Band',cellTemplate : '<span ng-show="!row.entity.status" >{{ row.entity.band }}</span><span ng-show="row.entity.status"><input  type="text" ng-model="row.entity.band" ng-blur="updateBand(row.entity,row.entity.band)" ng-value="row.entity.band" /></span>'},
        // { field: 'role' ,displayName:'Role'},
        // { field: 'commentvisible' ,displayName:'Commentvisible'},
        // { field: 'searchable' ,displayName:'Searchable'},
        // { field: 'adminrole' ,displayName:'Adminrole'},
        // { field: 'emailVerification' ,displayName:'EmailVerification',cellTemplate:'<span ng-if="row.entity.emailVerification" class="label label-success">Done</span><span ng-if="!row.entity.emailVerification" class="label label-danger" >Pending</span>' },
        // { field: 'username' ,displayName:'Username' },
        {
          field: 'createdAt',
          displayName: 'Date',
          cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
          width: '120px'
        }, {
          field: 'status',
          displayName: 'Status',
          cellTemplate: '<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>',
          width: '120px'
        }, {
          field: 'action',
          displayName: 'Action',
          cellTemplate: '<span ng-if="row.entity.status" class="label label-info" ng-click="mmiuserStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="label label-info" ng-click="mmiuserStatus(row.entity._id)">Approve</span> ',
          width: '80px'
        }, {
          field: 'detail',
          displayName: 'Detail',
          cellTemplate: '<span  class="label label-info" ng-click="userDetail(row.entity._id,0)">Detail</span>',
          width: '80px'
        },{
          field: '',
          displayName: '',
          cellTemplate: editDeleteMMMIuserTemplate,
          maxWidth: 100
        }
      ],
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
      }, {
        field: 'createdAt',
        displayName: 'Date',
        cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
        cellClass: 'grid-align'
      }, {
        field: '',
        displayName: 'Action',
        cellTemplate: editDeleteExpertTemplate,
        maxWidth: 100
      }],
      showFooter: true,
      plugins: [new ngGridFlexibleHeightPlugin()]
    };

    var editDeleteAttachmentTemplate =
      '<a ng-click="deleteAttachment(row.entity._id)"  id="delete"  class="label label-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a>';


    $scope.attachmentData = {
      data: 'gridAttachmentsData',
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
        cellClass: 'grid-align',
        width: '80px'
      }, {
        field: 'title',
        displayName: 'Title',
        cellClass: 'grid-align'
      },
       {
        field: 'media',
        displayName: 'Type',
        cellTemplate: '<span>{{row.entity.media.extension}}</span>',
        cellClass: 'grid-align'
      },
       {
        field: 'media',
        displayName: 'address',
        cellTemplate: '<textarea style="width: 383px;height:73px">http://themoneyhans.com/{{row.entity.media.path }}</textarea>',
         cellClass: 'grid-align',
        width: '400px'
      },
       {
        field: 'createdAt',
        displayName: 'Date',
        cellTemplate: '<span> {{row.entity.createdAt|date:"dd-MM-yyyy"}}</span>',
         cellClass: 'grid-align',
        width: '100px'
      }, {
        field: '',
        displayName: 'Action',
        cellTemplate: editDeleteAttachmentTemplate,
        cellClass: 'grid-align',
         width: '100px'
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
        { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger">NOT APPROVED</span>'},
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
  .controller('ViewDetailCtrl', function($scope, $modalInstance, $rootScope, User, $http,
    userId, type) {
    $scope.userType = type;

    if (type) {
      User.get({
        id: userId
      }, function(user) {
        $scope.userDetailData = user;
      });
    } else {
      $http.get("/api/mmiusers/" + userId).then(function(user) {
        $scope.userDetailData = user.data;
        $scope.$apply();
      });
    }

    $scope.roletypes = [
      'CEO/business head',
      'Management',
      'Sales/Marketing',
      'Investment/Product',
      'RM/client facing',
      'Investment Mgmt (Sell side)',
      'Product Mgmt (Sell side)',
      'Operations',
      'HR',
      'Head Investment Solutions Group',
      'Admin'
    ];

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
  .controller('AssignRoleMMICtrl', function($scope, $modalInstance, $rootScope, $http, $location, $window, $controller, searchable, adminrole, familyrole, userid, removeIndex, commentvisible, roletype, $templateCache, $route) {
    $scope.userupdate = {
      familyrole: familyrole,
      searchable: searchable,
      adminrole: adminrole,
      commentvisible: commentvisible,
      roletype: roletype
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


    $scope.roletypes = [
      'CEO/business head',
      'Management',
      'Sales/Marketing',
      'Investment/Product',
      'RM/client facing',
      'Investment Mgmt (Sell side)',
      'Product Mgmt (Sell side)',
      'Operations',
      'HR',
      'Head Investment Solutions Group',
      'Admin'
    ];


    $scope.saveRole = function() {
      $http({
        method: 'PUT',
        url: '/api/mmiusers/status/' + userid,
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