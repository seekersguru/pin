'use strict';
angular.module('pinApp')
  .controller('ArticleCtrl', function($scope, Auth, $location, $rootScope,
    $routeParams, $http, articles, $sce, $timeout, $filter,
    localStorageService, $modal) {
    $scope.article = {};
    $scope.descriptionLimit = 80;
    $scope.titleLimit = 45;
    $scope.currentPage = 0;
    $scope.pageSize = 20;
    $scope.numberOfPage = 25;
    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];
    $scope.hanscategory = ['Architect Blueprint', 'Essentials Foundation',
      'Growth Pillars', 'Freedom Slab', 'Fun Money Roof'
    ];

    $scope.model = {
      'Architect Blueprint': 'Before you build a house, you need a plan. Write down your goals and figure out how much they cost. Also, think about any attitudes or knowledge gaps that might stop you from building your dream house.',
      'Essentials Foundation': 'These are things you cannot afford to lose. The most important is your life and health,soget insurance.The next is having emergency cash for any unforeseen events.Some need to have their house, while others need to have part of their wealth in very safe investments with minimal risk.',
      'Growth Pillars': 'Your job or business is your biggest source of income; keep investing to ensure they stay relevant. But also accumulate some solid growth assets such as income-producing real estate or blue-chip stock portfolio that may fluctuate slightly but likely to give decent returns.',
      'Freedom Slab': 'To really get ahead and be able to stop working, you need to some risks. If they pay off, you get great returns; if they don’t, you need to be able to write them off and start again. For employed people, it could be your ESOPS or start-up. For business people, it could be a new idea. It could also be illiquid investments.',
      'Fun Money Roof': 'You only live once. You want to pursue some intellectually or soul-stimulating project. Or give it away.'
    };

    $scope.openArticle = function(categoryname) {
      if (!localStorageService.cookie.get([categoryname])) {

        $scope.message = {
          'title': categoryname,
          'description': $scope.model[categoryname]
        };

        localStorageService.cookie.set([categoryname], 1, 1800);
        var modalInstance = $modal.open({
          templateUrl: 'messageContainer.html',
          controller: 'messageContainerCtrl',
          resolve: {
            article: function() {
              return $scope.message;
            }
          }
        });

      } else {
        $location.path("/category/" +
          categoryname);
      }

    };

    $scope.currentCategoryName = '';
    $scope.HOSTPATH = $location.protocol() +
      '://' + $location.host();

    var col1_data, col2_data, col3_data, w;

    col1_data = $("#arch").html();
    col2_data = $("#home").html();
    col3_data = $(
      "#navtop").html();
    w = $(window).width();

    if (w < 768) {
      swap_columns();
    }

    function swap_columns() {
      var w = $(window).width();
      if (w < 768) {
        $("#arch").html(col3_data);
        $("#home").html(col1_data);
        $("#navtop").html(col2_data);
      } else {
        $("#arch").html(col1_data);
        $("#home").html(col2_data);
        $("#navtop").html(col3_data);
      }
    }


    $(window).resize(function() {
      swap_columns();
    });

    $scope.color = {
      'Architect Blueprint': {
        'caption': 'caption',
        'colorclass': 'blueprint-box',
        'videoclass': 'video-caption-yallow',
        'bodyClass': 'blueprint'
      },
      'Essentials Foundation': {
        'caption': 'caption-red',
        'colorclass': 'red-box',
        'videoclass': 'video-caption-blue',
        'bodyClass': 'foundation'
      },
      'Growth Pillars': {
        'caption': 'caption-aqua',
        'colorclass': 'blue-box',
        'videoclass': 'video-caption-red',
        'bodyClass': 'growth'
      },
      'Freedom Slab': {
        'caption': 'caption-pink',
        'colorclass': 'green-box',
        'videoclass': 'video-caption-green',
        'bodyClass': 'freedom'
      },
      'Fun Money Roof': {
        'caption': 'caption-pink',
        'colorclass': 'yallow-box',
        'videoclass': 'video-caption-yallow',
        'bodyClass': 'funroof'
      }
    };

    $scope.mmicategorysetting = {
      'Investments': {
        'main-image': 'investment-img.png',
        'icon-img': 'investment-icon.jpg',
        'classname': 'investment-iocn'
      },

      'WM/distribution': {
        'main-image': 'welath-img.png',
        'icon-img': 'wealth.png',
        'classname': 'wealth-iocn'
      },

      'Communication': {
        'main-image': 'communicationlarge-img.png',
        'icon-img': 'cummunaction.png',
        'classname': 'communication-iocn'
      }

    };

    $scope.mmicategory = [{
      'name': 'Investments',
      'sub': [{
        'name': 'Traditional',
        'tags': ['Equities', 'Fixed Interest', 'Real Estate',
          'Cash',
          'Global'
        ]
      }, {
        'name': 'Alternative',
        'tags': ['Private Equity', 'Hedge Fund', 'Venture, Angel',
          'Real Estate'
        ]
      }, {
        'name': 'Portfolios Construction',
        'tags': []
      }, {
        'name': 'Markets',
        'tags': []
      }]
    }, {
      'name': 'WM/distribution',
      'sub': [{
        'name': 'Wealth planning',
        'tags': ['Trusts', 'Wills', 'Governance']
      }, {
        'name': 'Business issues',
        'tags': ['Strategy', 'marketing', 'sales, operations']
      }, {
        'name': 'Advisory process',
        'tags': ['Client onboarding', 'risk profiling',
          'behavioural finance'
        ]
      }]
    }, {
      'name': 'Communication',
      'sub': [{
        'name': 'Investor comms',
        'tags': []
      }]
    }];
    //if in url category is found then apply color and
    //category name to article listing section
    if ($routeParams.categoryname) {
      $scope.currentCategoryName = $routeParams.categoryname;
      $rootScope.bodyMainClass = $scope.color[$scope.currentCategoryName]
        .bodyClass +
        "-bg";
      $rootScope.bodyDoodleMainClass = "-" + $scope.color[$scope.currentCategoryName]
        .bodyClass;
    } else {
      $rootScope.bodyDoodleMainClass = '';
      $rootScope.bodyMainClass = '';
    }
    $scope.articles = articles;
    $scope.exceptonearticle = angular.copy(articles);
    $scope
      .rightnav = "right-nav.html";

    $scope.comments = articles.scomments;
    if ($location.path() == "/articles/view/" + articles._id && articles.media) {

      $scope.config = {
        'sources': [{
          src: $sce.trustAsResourceUrl('../' + articles.media.path),
          type: 'video/mp4'
        }],
        'theme': 'bower_components/videogular-themes-default/videogular.css',
        'plugins': {
          'poster': 'http://www.videogular.com/assets/images/videogular.png'
        }
      };

    }

    $scope.getLatest = function() {

      $http({
        method: 'GET',
        url: 'api/articles?limit=5&pageno=01'
      }).
      success(function(data, status, headers, config) {

        $scope.latestcomments = data.articles;

      }).
      error(function(data, status, headers, config) {

      });

    };

    $scope.getLatest();


    $scope.deleteComment = function(commentId) {

      var yes = confirm('Are you sure you want to delete this Comment?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/comments/' + articles._id + "/" + commentId
        }).
        success(function(data, status, headers, config) {
            $scope.deleteStatus = 1;

            var removeIndex = $scope.comments
              .map(function(item) {
                return item._id;
              })
              .indexOf(commentId);

            $scope.comments.splice(removeIndex, 1);

          })
          .error(function(data, status, headers, config) {

          });
      }

    };


    $scope.addComment = function(form) {

      if (form.$valid) {
        var comment = {
          user: $rootScope.currentUser._id,
          username: $rootScope.currentUser.name,
          post: $scope.article.comment
        };

        $http({
          method: 'POST',
          url: '/api/comments/' + articles._id,
          data: comment
        }).
        success(function(data, status, headers, config) {
          // ...
          console.log(data);
          comment.posted = new Date();
          comment._id = data.scomments[data.scomments.length - 1]._id;

          $scope.comments.push({
            user: {
              _id: $rootScope.currentUser._id,
              fullname: $rootScope.currentUser.fullname,
              following: $rootScope.currentUser.following
            },
            username: $rootScope.currentUser.name,
            post: $scope.article.comment,
            posted: new Date()
          });

          $scope.article = {};

          // $scope.form.$setPristine();

        }).
        error(function(data, status, headers, config) {
          $scope.article = {};
        });
      }

    };

    $scope.editComment = function(form, commentId, editcomment, key) {
      if (form.$valid) {
        var comment = {
          post: editcomment,
          username: $rootScope.currentUser.name,
          user: $rootScope.currentUser._id
        };

        $http({
          method: 'PUT',
          url: '/api/comments/' + articles._id + '/' + commentId,
          data: comment
        }).
        success(function(data, status, headers, config) {
          // $scope.form.$setPristine();

          var removeIndex = $scope.comments
            .map(function(item) {
              return item._id;
            })
            .indexOf(commentId);

          $scope.comments[removeIndex].post = editcomment;
          // $scope.editcomment_id=0;
          // $scope.article={};

          $timeout(function() {

            angular.element("#" + key + "-a").trigger("click");

          }, 200);

        }).
        error(function(data, status, headers, config) {
          // $scope.article={};
          alert(
            "there is something technical problem please try after some time"
          );
        });
      }
    };

    $scope.numberOfPages = function() {
      // return Math.ceil($scope.articles.length/$scope.pageSize);
    };

    // $scope.$on('$routeUpdate', function(){
    //   $scope.currentPage = parseInt($routeParams.pageno) - 1;
    // });

    $scope.changePage = function() {
      $location.path('/articles/' + $scope.currentPage + 1);
    };

    // if($routeParams.pageno){
    //   if($routeParams.pageno > $scope.numberOfPages()){
    //     $location.search({'page' : $scope.numberOfPages()});
    //   }
    //   else if($routeParams.pageno < 1){
    //     $location.search({'page' : 1});
    //   }
    //   $scope.currentPage = parseInt($routeParams.pageno) - 1;
    // }
    // else{
    //   $scope.changePage();
    // }

    $scope.navigation_control = function(page_no) {
      $scope.currentPage = page_no;
      $scope.changePage();
    };

    $scope.checkcommitstatus = function(userid, following) {

      if (following) {
        var removeIndex = following
          .map(function(item) {
            return item.user;
          })
          .indexOf(userid);

        if (removeIndex != -1) {
          return following[removeIndex].status;
        } else {
          return false;
        }

      } else {

        return 0;
      }


    };

  });

angular.module('pinApp')
  .controller('ArticleSearchCtrl', function($scope, $http, $sce, $upload,
    $timeout, $routeParams) {


    $scope.searchterm = $routeParams.search;
    $scope.articleload = 0;

    $http({
      method: 'GET',
      url: '/api/articles/search/' + $routeParams.search
    }).
    success(function(data, status, headers, config) {
        $scope.articles = data.articles;
        $scope.articleload = 1;
      })
      .error(function(data, status, headers, config) {

      });

  });

angular.module('pinApp')
  .controller('ArticleViewEditCtrl', function($scope, Auth, $location,
    $rootScope, $routeParams, article, $sce, $http, $upload, $timeout) {
    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];
    $scope.article = article;

    $scope.article.tags = "";
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);
    $scope.mmicategorysetting = {
      'Investments': {
        'main-image': 'investment-img.png',
        'icon-img': 'investment-icon.jpg'
      },

      'WM/distribution': {
        'main-image': 'welath-img.png',
        'icon-img': 'wealth.png'
      },

      'Communication': {
        'main-image': 'communicationlarge-img.png',
        'icon-img': 'cummunaction.png'
      }

    };

    if ($location.path() == "/articles/edit/" + article._id && article.media) {

      $scope.config = {
        'sources': [{
          src: $sce.trustAsResourceUrl('../' + article.media.path),
          type: 'video/mp4'
        }],
        'theme': 'bower_components/videogular-themes-default/videogular.css',
        'plugins': {
          'poster': 'http://www.videogular.com/assets/images/videogular.png'
        }
      };

    }

    $scope.removeMedia = function() {
      var remove = confirm("Are you sure you want to remove this Media");
      if (remove) {

        $http({
          method: 'PUT',
          url: '/api/articles/removemedia/' + $scope.article._id
        }).
        success(function(data, status, headers, config) {
            $scope.article.media = "";

          })
          .error(function(data, status, headers, config) {

            alert(
              'There is something technical problem.Please try after some time.'
            );

          });
      };

    };

    $scope.uploadPic = function(files) {
      $scope.formUpload = true;
      if ($scope.mainFIle[0] !== null) {
        generateThumbAndUpload($scope.mainFIle[0])
      }
    };

    function generateThumbAndUpload(file) {
      $scope.errorMsg = null;
      $scope.generateThumb(file);
      uploadUsing$upload(file);

    }

    function uploadUsing$upload(file) {

      $scope.mainData = {
        author: $rootScope.currentUser._id,


      };

      var original = $scope.article.tags;
      // $scope.article.tags=[];
      // for (var t = 0; t < original.length; t++) {
      //   $scope.article.tags[t] = original[t].text;
      // }

      $scope.articleput = {

        title: $scope.article.title,
        description: $scope.article.description,
        category: $scope.article.category

      };


      file.upload = $upload.upload({
        url: '/api/articles/' + article._id,
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        data: $scope.articleput,
        file: file
      });

      file.upload.then(function(response) {
        $timeout(function() {
          console.log(response);
          $location.path('/articles/view/' + $scope.article._id);
        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        $location.path('/articles/view/' + $scope.article._id);
      });

      file.upload.progress(function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt
          .total));
      });

      file.upload.xhr(function(xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    }


    $scope.generateThumb = function(file) {
      if (file !== null) {
        if ($scope.fileReaderSupported && (file.type.indexOf('image') > -
            1 ||
            file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                file.dataUrl = e.target.result;
              });
            };
          });
        }
      }
    };

    $scope.setFiles = function(element) {
      $scope.filearticle = 1;
      var file = element.files[0];
      $scope.$apply(function($scope) {
        // console.log('files:', element.files);
        if ($scope.fileReaderSupported && (file.type.indexOf('image') >
            -1 || file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                element.files[0].dataUrl = e.target.result;
                $scope.mainFIle = element.files;
              });
            };
          });
        }
        // Turn the FileList object into an Array
        $scope.files = [];
        for (var i = 0; i < element.files.length; i++) {
          $scope.files.push(element.files[i]);
        }
        $scope.progressVisible = false;
      });
    };

    //update
    $scope.updateArticle = function(form) {
      if (form.$valid) {
        $scope.article.author = $rootScope.currentUser._id;
        console.log($scope.article.tags);
        console.log($scope.article);
        // var original=$scope.article.tags;
        // for (var t = 0; t < original.length; t++) {
        //   $scope.article.tags[t] = original[t].text;
        // }
        $scope.articleDone = 1;
        $scope.form.$setPristine();
        $http({
          method: 'PUT',
          url: '/api/articles/' + $scope.article._id,
          data: $scope.article
        }).
        success(function(data, status, headers, config) {
          // ...
          $location.path('/articles/view/' + $scope.article._id);
          $scope.updateStatus = 1;

        }).
        error(function(data, status, headers, config) {
          // ...
          // $scope.article={};
        });
      }
    };

    $scope.reset = function(form) {
      $scope.form.$setPristine();
    };

    $scope.remove = function(form) {
      var yes = confirm('Are you sure you want to delete this Article?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/articles/' + $scope.article._id
        }).
        success(function(data, status, headers, config) {
            $scope.form.$setPristine();
            $scope.deleteStatus = 1;
          })
          .error(function(data, status, headers, config) {

          });
      }
    };
  });

angular.module('pinApp')
  .controller('ArticleAddCtrl', function($scope, Auth, $location, $rootScope,
    $routeParams, $http, $upload, $timeout) {
    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];

    $scope.article = {};
    $scope.preview = 0;
    $scope.article.category = $scope.category[0];
    // $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);

    $scope.template = function(templateno) {
      $scope.article.title = "Set your Title Name";
      $scope.article.description =
        "<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>" +

        "<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>" +

        "<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>" +

        "<b>berspiciatis unde omnis </b>" +

        "<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>" +

        "<b> At vero eos et accusamus</b>" +

        "<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>" +

        "<b>Commodo Consequat</b>" +

        "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";
      $scope.article.tags = ['tag1', 'tag2'];
    };
    $scope.uploadPic = function(files) {
      $scope.formUpload = true;
      if ($scope.mainFIle[0] !== null) {
        generateThumbAndUpload($scope.mainFIle[0])
      }
    };

    function generateThumbAndUpload(file) {
      $scope.errorMsg = null;
      $scope.generateThumb(file);
      uploadUsing$upload(file);

    }

    function uploadUsing$upload(file) {

      $scope.article.author = $rootScope.currentUser._id;

      var original = $scope.article.tags;
      // $scope.article.tags=[];
      // for (var t = 0; t < original.length; t++) {
      //   $scope.article.tags[t] = original[t].text;
      // }

      file.upload = $upload.upload({
        url: '/api/articles',
        method: 'POST',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        data: $scope.article,
        file: file
      });

      file.upload.then(function(response) {
        $timeout(function() {
          console.log(response);
          // $location.path('articles/view/'+response.data.article._id);
          file.result = response.data;
          if ($rootScope.currentUser.role == 'admin') {

            $location.path('/admin').search({
              'articles': 1
            });

          } else {
            $location.path('/notification').search({
              'type': 'article'
            });

          }

          $scope.article = {};
          $scope.articleDone = 1;
          $scope.articleResponse = response.data;
          $scope.form.$setPristine();
        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        $scope.article = {};
        if ($rootScope.currentUser.role == 'admin') {

          $location.path('/admin').search({
            'articles': 1
          });

        } else {
          $location.path('/notification').search({
            'type': 'article'
          });

        }
        $scope.articleDone = 1;
        $scope.articleResponse = response.data;
        // $location.path('articles/view/'+response.data.article._id);
        $scope.form.$setPristine();

      });

      file.upload.progress(function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt
          .total));
      });

      file.upload.xhr(function(xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    }


    $scope.generateThumb = function(file) {
      if (file !== null) {
        if ($scope.fileReaderSupported && (file.type.indexOf('image') > -
            1 ||
            file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                file.dataUrl = e.target.result;
              });
            };
          });
        }
      }
    };

    $scope.setFiles = function(element) {
      $scope.filearticle = 1;
      var file = element.files[0];
      $scope.$apply(function($scope) {
        console.log('files:', element.files);
        if ($scope.fileReaderSupported && (file.type.indexOf('image') >
            -1 || file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                element.files[0].dataUrl = e.target.result;
                $scope.mainFIle = element.files;

              });
            };
          });
        }
        // Turn the FileList object into an Array
        $scope.files = [];
        for (var i = 0; i < element.files.length; i++) {
          $scope.files.push(element.files[i]);
        }
        $scope.progressVisible = false;
      });
    };

    $scope.saveArticle = function(form) {
      //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
      // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));


      if (form.$valid) {
        // var formData = new FormData();
        // formData.append("file", $scope.article.file);
        // console.log(formData);

        $scope.article.author = $rootScope.currentUser._id;
        // var original=$scope.article.tags;
        //  $scope.article.tags=[];
        //  for (var t = 0; t < original.length; t++) {
        //    $scope.article.tags[t] = original[t].text;
        //   }
        $scope.form.$setPristine();
        $http({
          method: 'POST',
          url: '/api/articles',
          data: $scope.article
        }).
        success(function(data, status, headers, config) {
          // ...
          // console.log(data);
          if ($rootScope.currentUser.role == 'admin') {

            $location.path('/admin').search({
              'articles': 1
            });

          } else {
            $location.path('/notification').search({
              'type': 'article'
            });
          }

          $scope.article = {};
          $scope.articleDone = 1;
          $scope.articleResponse = data;

        }).
        error(function(data, status, headers, config) {
          // ...
          $scope.article = {};
        });
      }

    };

    $scope.reset = function(form) {
      $scope.form.$setPristine();
    };

  });


angular.module('pinApp')
  .controller('messageContainerCtrl', function($scope, $modalInstance, article,
    $templateCache, $location) {
    $scope.messagemodel = {
      title: article.title,
      description: article.description
    };

    $scope.closeMessagePopup = function() {
      $modalInstance.close();
      $location.path("/category/" + article.title);
    }
    $scope.closePopup = function() {
      $modalInstance.close();

    }
  });
