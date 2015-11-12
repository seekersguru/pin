'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', ['$scope','Auth','$location','Article','$rootScope','$routeParams','$http','articles','$sce','$timeout','$filter',function ($scope,Auth,$location,Article,$rootScope,$routeParams,$http,articles,$sce,$timeout,$filter) {

  $scope.article={};
  $scope.descriptionLimit=80;
  $scope.titleLimit=45;
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.numberOfPage=25;
  $scope.limit=12;
  $scope.category=['Grow','Protect','Manage','Give'];
  $scope.color={
    'Grow':
    {'caption':'caption',
    'colorclass':'greenbox',
    'image':'green-chat.jpg'
  },
  'Protect':
  {
    'caption':'caption-red',
    'colorclass':'redbox',
    'image':'red-chat.jpg'
  },
  'Manage':
  {
   'caption':'caption-aqua',
   'colorclass':'aquanbox',
    'image':'blue-chat.jpg'
 },
 'Give':
 { 'caption':'caption-pink',
 'colorclass':'pinkbox',
    'image':'purple-chat.jpg'
}
};


$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg',
  'classname':'investment-iocn'
},
'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png',
  'classname':'wealth-iocn'
},
'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png',
  'classname':'communication-iocn'
}
};



$scope.mmicategory=[
   {
    'name':'Investments',
    'sub': [
    {
      'name':'Traditional',
      'tags':['Equities','Fixed Interest','Real Estate', 'Cash','Global']
    },
    {
      'name':'Alternative',
      'tags':['Private Equity', 'Hedge Fund', 'Venture, Angel', 'Real Estate']
    },
    {
      'name':'Portfolios Construction',
      'tags':[]
    },
    {
      'name':'Markets',
      'tags':[]
    }
    ]
    },
  {
    'name':'WM/distribution',
    'sub':[
          {
          'name':'Wealth planning',
          'tags':['Trusts', 'Wills', 'Governance']
          },
          {
            'name':'Business issues',
            'tags':['Strategy', 'marketing', 'sales, operations']
          },
          {
            'name':'Advisory process',
            'tags':['Client onboarding', 'risk profiling','behavioural finance']
          }
        ]
   },
  {
    'name':'Communication',
    'sub': [
      {
      'name':'Investor comms',
      'tags':[]
       }
      ]
  }
  ];
 if(!$routeParams.articleid ){
    $scope.selectcategory=$location.search() && $location.search().mmisubcategory ? $location.search().mmisubcategory:'';
    setTimeout(function(){
      $("#sel1").val($scope.selectcategory);
    },300);
   $scope.$watch('selectcategory',function(newValue,oldvalue) {
    if(!$location.search() || $location.search() && $location.search().mmisubcategory !== newValue){
       $location.path('/home').search({mmisubcategory:newValue});
    }
  });
  }
$scope.articles=articles.articles;
$scope.pageno=articles.current;
$scope.total=articles.total;

if($scope.articles.youtubeurl){
    $scope.articleyoutubeurl = $sce.trustAsResourceUrl($scope.articles.youtubeurl);
}

$scope.loadMore = function(){
$scope.startLoading=true;
  var query={
              limit : $scope.limit,
              pageno: $scope.pageno+1
            };
    Article.get(query, function(articles) {
      $.each(articles.articles,function(i,article){
        article.description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')(article.description, $scope.descriptionLimit)));

        $scope.exceptonearticle.push(article);

      })
      $scope.pageno=articles.current;
      $scope.total=articles.total;
      $scope.startLoading=false;

      // $scope.pageno=
    },
    function(err) {
    });
};

// articles=articles.articles;
$scope.exceptonearticle=angular.copy(articles.articles);
if( Object.prototype.toString.call( $scope.exceptonearticle ) === '[object Array]' ) {
  var removeIndex=0;
     removeIndex = $scope.exceptonearticle
    .map(function(item)
    {
      return item.mmibanner;
    })
    .indexOf(true);

  if(removeIndex <= 0)
   {
      $scope.exceptonearticle.splice(0, 1);
      $scope.bannerArticle=articles.articles[0];

   }
   else
   {
        $scope.mainlist=$scope.exceptonearticle.splice(removeIndex,1);
        $scope.bannerArticle=articles.articles[removeIndex];

   }

}

for(var i = 0; i < $scope.exceptonearticle.length; i++){

    // $scope.exceptonearticle[i].title = $sce.trustAsHtml($filter('limitTo')($scope.exceptonearticle[i].title, $scope.titleLimit));
    $scope.exceptonearticle[i].description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')($scope.exceptonearticle[i].description, $scope.descriptionLimit)));

}

$scope.rightnav="right-nav.html";

setTimeout(function(){
  // $('.post-box').hover(
  //   function(){
  //           $(this).find('.caption, .caption-red, .caption-pink, .caption-aqua').slideDown(250); //.fadeIn(250)
  //         },
  //         function(){
  //           $(this).find('.caption, .caption-red, .caption-pink, .caption-aqua').slideUp(250); //.fadeOut(205)
  //         });

  $(".filterArticle li").find("a").click(function(){

    var filter = $(this).data("filter");
    $("#article-container").find(".article-post").fadeOut(205);
    $("#article-container").find(filter).fadeIn(205);

  });
},1000);


$scope.comments=articles.scomments;
if($location.path()=="/articles/view/"+articles.articles._id && articles.articles.thumblemedia )
{

  $scope.config=
  {
    'sources': [
    {src: $sce.trustAsResourceUrl('http://moneymanagementindia.net//'+articles.articles.media.path), type: 'video/mp4'}
    ],
    'theme': 'bower_components/videogular-themes-default/videogular.css',
    'plugins': {
      'poster': 'http://moneymanagementindia.net//'+articles.articles.thumblemedia.path
    }
  };

}

$scope.getLatest=function(){

  $http({ method: 'GET', url: 'api/articles?limit=5&pageno=01' }).
  success(function (data, status, headers, config) {

    $scope.latestcomments=data.articles;

  }).
  error(function (data, status, headers, config) {

  });

};

// $scope.getLatest();


$scope.deleteComment=function(commentId){

  var yes=confirm('Are you sure you want to delete this Comment?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/comments/'+articles._id+"/"+commentId
    }).
    success(function (data,status,headers,config){
      $scope.deleteStatus=1;

      var removeIndex = $scope.comments
      .map(function(item)
      {
        return item._id;
      })
      .indexOf(commentId);

      $scope.comments.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

};


$scope.addComment=function(form){

 if(form.$valid)
 {
    var comment={ user: $rootScope.currentUser._id ,username:$rootScope.currentUser.name, post: $scope.article.comment};

    $http({ method: 'POST', url: '/api/comments/'+articles._id,data:comment }).
    success(function (data, status, headers, config) {
          // ...
          console.log(data);
          comment.posted=new Date();
          comment._id=data.scomments[data.scomments.length-1]._id;

          $scope.comments.push({ user:{ _id: $rootScope.currentUser._id,fullname:$rootScope.currentUser.fullname,following:$rootScope.currentUser.following },username:$rootScope.currentUser.name, post: $scope.article.comment,posted : new Date()});

          $scope.article={};

          // $scope.form.$setPristine();

        }).
    error(function (data, status, headers, config) {
      $scope.article={};
    });
  }

};

$scope.editComment=function(form,commentId,editcomment,key){
if(form.$valid)
 {
  var comment={ post: editcomment,username:$rootScope.currentUser.name,user:$rootScope.currentUser._id};

    $http({ method: 'PUT', url: '/api/comments/'+articles._id+'/'+commentId,data:comment}).
    success(function (data, status, headers, config) {
          // $scope.form.$setPristine();

          var removeIndex = $scope.comments
          .map(function(item)
          {
            return item._id;
          })
          .indexOf(commentId);

          $scope.comments[removeIndex].post= editcomment;
          // $scope.editcomment_id=0;
          // $scope.article={};

        $timeout(function(){

           angular.element("#"+key+"-a").trigger("click");

        },200);

        }).
    error(function (data, status, headers, config) {
      // $scope.article={};
      alert("there is something technical problem please try after some time");
    });
}
};

$scope.numberOfPages = function(){
    // return Math.ceil($scope.articles.length/$scope.pageSize);
  };

  // $scope.$on('$routeUpdate', function(){
  //   $scope.currentPage = parseInt($routeParams.pageno) - 1;
  // });

$scope.changePage = function(){
  $location.path('/articles/'+$scope.currentPage+1);
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

  $scope.navigation_control= function(page_no){
    $scope.currentPage = page_no;
    $scope.changePage();
  };

  $scope.checkcommitstatus=function(userid,following){

    if(following)
    {
      var removeIndex = following
      .map(function(item)
      {
        return item.user;
      })
      .indexOf(userid);

      if(removeIndex != -1)
      {
        return following[removeIndex].status;
      }else{
        return  false;
      }

    }
    else
    {

      return 0;
    }


  };

}]);

angular.module('pinApp')
.controller('ArticleSearchCtrl', ['$scope','$http','$sce','$upload','$timeout','$routeParams','$filter',function ($scope,$http,$sce,$upload,$timeout,$routeParams,$filter) {


  $scope.searchterm=$routeParams.search;
  $scope.articleload=0;
  $scope.descriptionLimit=80;


$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg',
  'classname':'investment-iocn'
},

'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png',
  'classname':'wealth-iocn'
},

'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png',
  'classname':'communication-iocn'
}

};

$http({ method: 'GET', url: '/api/articles/search/'+$routeParams.search}).
        success(function (data, status, headers, config) {
          
          $scope.articleload=1;
          $.each(data.articles,function(i,article){
           article.description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')(article.description, $scope.descriptionLimit)));
           });
          $scope.articles=data.articles;
        })
        .error(function (data, status, headers, config) {
        
      });

}]);


angular.module('pinApp')
.controller('ArticleViewEditCtrl', ['$scope','Auth','$location','$rootScope','$routeParams','article','$sce','$http','$upload','$timeout',function ($scope,Auth,$location,$rootScope,$routeParams,article,$sce,$http,$upload,$timeout) {
  $scope.category=['Grow','Protect','Manage','Give'];
  $scope.article=article;

  $scope.article.tags="";
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg'
},

'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png'
},

'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png'
}

};

if($location.path()=="/articles/edit/"+article._id && article.media)
{

  $scope.config=
  {
    'sources': [
    {src: $sce.trustAsResourceUrl('../'+article.media.path), type: 'video/mp4'}
    ],
    'theme': 'bower_components/videogular-themes-default/videogular.css',
    'plugins': {
      'poster': 'http://www.videogular.com/assets/images/videogular.png'
    }
  };

}

$scope.removeMedia=function(){
  var remove=confirm("Are you sure you want to remove this Media");
  if(remove)
  {

    $http({ method: 'PUT', url: '/api/articles/removemedia/'+$scope.article._id}).
      success(function (data, status, headers, config) {
        $scope.article.media="";

      })
      .error(function (data, status, headers, config) {

      alert('There is something technical problem.Please try after some time.');

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

    $scope.mainData={
        author:$rootScope.currentUser._id,


    };

    var original=$scope.article.tags;
    // $scope.article.tags=[];
    // for (var t = 0; t < original.length; t++) {
    //   $scope.article.tags[t] = original[t].text;
    // }

    $scope.articleput={

      title:$scope.article.title,
      description:$scope.article.description,
      category:$scope.article.category

    };


    file.upload = $upload.upload({
      url: '/api/articles/'+article._id,
      method: 'PUT',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.articleput,
      file: file
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        $location.path('/articles/view/'+$scope.article._id);
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
        $location.path('/articles/view/'+$scope.article._id);
      });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
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
    $scope.filearticle=1;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      // console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
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
  $scope.updateArticle=function(form){
    if(form.$valid)
    {
      $scope.article.author=$rootScope.currentUser._id;
      console.log($scope.article.tags);
      console.log($scope.article);
      // var original=$scope.article.tags;
      // for (var t = 0; t < original.length; t++) {
      //   $scope.article.tags[t] = original[t].text;
      // }
      $scope.articleDone=1;
      $scope.form.$setPristine();
      $http({ method: 'PUT', url: '/api/articles/'+$scope.article._id,data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        $location.path('/articles/view/'+$scope.article._id);
        $scope.updateStatus=1;

      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
    }
  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

  $scope.remove=function(form){
    var yes=confirm('Are you sure you want to delete this Article?');
    if(yes)
    {
      $http({
        method:"DELETE",
        url:'/api/articles/'+$scope.article._id
      }).
      success(function (data,status,headers,config){
        $scope.form.$setPristine();
        $scope.deleteStatus=1;
      })
      .error(function (data,status,headers,config){

      });
    }
  };
}]);

angular.module('pinApp')
.controller('ArticleAddCtrl',['$scope','Auth','$location','$rootScope','$routeParams','$http','$upload','$timeout', function ($scope,Auth,$location,$rootScope,$routeParams,$http,$upload,$timeout) {
  $scope.category=['Grow','Protect','Manage','Give'];

  $scope.article={};
  $scope.preview=0;
  $scope.article.category=$scope.category[0];
  // $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

$scope.template=function(templateno){
$scope.article.title="Set your Title Name";
$scope.article.description="<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>"+

"<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>"+

"<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"+

"<b>berspiciatis unde omnis </b>"+

"<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>"+

"<b> At vero eos et accusamus</b>"+

"<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>"+

"<b>Commodo Consequat</b>"+

"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";
$scope.article.tags=['tag1','tag2'];
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

    $scope.article.author= $rootScope.currentUser._id;

    var original=$scope.article.tags;
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
      data:$scope.article,
      file: file
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        // $location.path('articles/view/'+response.data.article._id);
        file.result = response.data;
         if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/admin').search({ 'articles':1});

        }
        else{
            $location.path('/notification').search({ 'type':'article'});

        }

        $scope.article={};
        $scope.articleDone=1;
        $scope.articleResponse=response.data;
        $scope.form.$setPristine();
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
      $scope.article={};
       if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/admin').search({ 'articles':1});

        }
        else{
            $location.path('/notification').search({ 'type':'article'});

        }
      $scope.articleDone=1;
      $scope.articleResponse=response.data;
      // $location.path('articles/view/'+response.data.article._id);
      $scope.form.$setPristine();

    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
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
    $scope.filearticle=1;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;

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

  $scope.saveArticle=function(form){
    //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
    // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));


    if(form.$valid)
    {
      // var formData = new FormData();
      // formData.append("file", $scope.article.file);
      // console.log(formData);

      $scope.article.author=$rootScope.currentUser._id;
       // var original=$scope.article.tags;
       //  $scope.article.tags=[];
       //  for (var t = 0; t < original.length; t++) {
       //    $scope.article.tags[t] = original[t].text;
       //   }
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/articles',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        // console.log(data);
        if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/admin').search({ 'articles':1});

        }
        else{
            $location.path('/notification').search({ 'type':'article'});
        }

        $scope.article={};
        $scope.articleDone=1;
        $scope.articleResponse=data;

      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });
    }

  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

}]);
