'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', function ($scope,Auth,$location,$rootScope,$routeParams,$http,articles,$sce,$timeout) {
  $scope.article={};
  $scope.articles=articles;
  $scope.descriptionLimit=100;
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.numberOfPage=25;
  if($scope.articles.youtubeurl){
    $scope.articleyoutubeurl = $sce.trustAsResourceUrl($scope.articles.youtubeurl);
  }

  $scope.category=['Grow','Protect','Manage','Give'];
  $scope.hanscategory=['Architect Blueprint','Essentials Foundation','Growth Pillars','Freedom Slab','Fun Money Roof'];
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
$scope.rightnav="right-nav.html";

setTimeout(function(){
  $('.post-box').hover(
    function(){
            $(this).find('.caption, .caption-red, .caption-pink, .caption-aqua').slideDown(250); //.fadeIn(250)
          },
          function(){
            $(this).find('.caption, .caption-red, .caption-pink, .caption-aqua').slideUp(250); //.fadeOut(205)
          });

  $(".filterArticle li").find("a").click(function(){
    $(".filterArticle li").find("a").removeClass("current");
    var filter = $(this).data("filter");
    $("#article-container").find(".article-post").fadeOut(205);
    $("#article-container").find(filter).fadeIn(205);

    $(this).addClass("current");

  });

  $(".clear-filter").find("a").click(function(){
    $(".filterArticle li").find("a").removeClass("current");

    $("#article-container").find(".article-post").fadeIn(205);

  });


},1000);


  $scope.searcharticle=function(form)
  {

   if(form.$valid)
      {
       $location.path('/articles/search/'+$scope.search);

      }

  };




$scope.comments=articles.comments;
if($location.path()=="/articles/view/"+articles._id && articles.media)
{

  $scope.config=
  {
    'sources': [
    {src: $sce.trustAsResourceUrl('../'+articles.media.path), type: 'video/mp4'}
    ],
    'theme': 'bower_components/videogular-themes-default/videogular.css',
    'plugins': {
      'poster': 'http://www.videogular.com/assets/images/videogular.png'
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

$scope.getLatest();


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
          comment._id=data.comments[data.comments.length-1]._id;

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

});

angular.module('pinApp')
.controller('ArticleViewEditCtrl', function ($scope,Auth,$location,$rootScope,$routeParams,article,$sce,$http,$upload,$timeout) {
  $scope.category=['Grow','Protect','Manage','Give'];
  $scope.hanscategory=['Architect Blueprint','Essentials Foundation','Growth Pillars','Freedom Slab','Fun Money Roof'];
  
  $scope.column=[1,2];

     $http({ method: 'GET', url: '/api/users/adminrole' }).
      success(function (data, status, headers, config) {
        var me={
                    _id: $rootScope.currentUser._id,
                    name: 'ME'
                };

        data.users.push(me);
        $scope.experts=data.users;
      }).
      error(function (data, status, headers, config) {
        $scope.experts={};
      }
      );

  $scope.tagcategory={
        'Grow':['Equities','Fixed Interest','Real Estate', 'Cash','Global','Alternatives'],
        'Protect':['Trusts','Wills','Governance'],
        'Manage':[],
        'Give':[]
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

  $scope.article=article;
   var removeIndex = $scope.mmicategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmicategory);

   $scope.mmisubcategory=$scope.mmicategory[removeIndex].sub;



    $scope.changemmicategory=function(){

     var removeIndex = $scope.mmicategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmicategory);

      $scope.mmisubcategory=$scope.mmicategory[removeIndex].sub;
      $scope.article.mmitags=$scope.mmicategory[removeIndex].sub;

  };



  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);


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

$scope.today = function() {
    $scope.article.eventdate = new Date();
  };
  // $scope.today();

  $scope.clear = function () {
    $scope.article.eventdate = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };


$scope.removeThumble=function(){
  var remove=confirm("Are you sure you want to remove this Thumble");
  if(remove)
  {

    $http({ method: 'PUT', url: '/api/articles/removethumble/'+$scope.article._id}).
      success(function (data, status, headers, config) {
        $scope.article.thumblemedia="";

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

      // $scope.article.mmitags=$scope.mmisubcategory[removeIndex].tags;
       var removeIndex = $scope.mmisubcategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmisubcategory);

      $scope.article.mmitags=$scope.mmisubcategory[removeIndex].tags;
      $scope.article.tags=$scope.tagcategory[$scope.article.category];

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
      category:$scope.article.category,
      hanscategory:$scope.article.hanscategory,
      mmicategory:$scope.article.mmicategory,
      mmisubcategorycategory:$scope.article.mmisubcategorycategory,
      mmitags:$scope.article.mmitags,
      tags:$scope.article.tags,
      column:$scope.article.column,
      youtubeurl:$scope.article.youtubeurl,
      metadescription:$scope.article.metadescription,
      metatitle:$scope.article.metatitle,
      canonical:$scope.article.canonical,
      metakeywords:$scope.article.metakeywords
       };

     var mainfiles=[];
      mainfiles[0]=file;
    if($scope.thumbleFile)
    {
        mainfiles.push($scope.thumbleFile[0]);
    }
      if(!$scope.article.author)
    {
      $scope.articleput.author= $rootScope.currentUser._id;
    }else{
      $scope.articleput.author=$scope.article.author;
    }


    file.upload = $upload.upload({
      url: '/api/articles/'+article._id,
      method: 'PUT',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.articleput,
      file: mainfiles
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
    $scope.videoupload=0;
    $scope.imageupload=0;
    $scope.articletype="image";
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
              if(file.type.indexOf('image') > -1)
              {
                $scope.articletype='image';

              }else{

                $scope.articletype='video';
              }
                if(file.type.indexOf('video') > -1){

            $scope.videoupload=1;
          }
          if(file.type.indexOf('image') > -1){

            $scope.imageupload=1;
          }

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

  $scope.setThumbleFiles = function(element) {
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
              $scope.thumbleFile=element.files;

            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.thumblefiles = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.thumblefiles.push(element.files[i]);
      }
      // $scope.progressVisible = false;
    });
  };

  //update
  $scope.updateArticle=function(form){
    if(form.$valid)
    {
        if(!$scope.article.author)
      {
        $scope.article.author= $rootScope.currentUser._id;
      }else{
        $scope.article.author= $scope.article.author;

      }

     var removeIndex = $scope.mmisubcategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmisubcategory);

      $scope.article.mmitags=$scope.mmisubcategory[removeIndex].tags;

      $scope.article.tags=$scope.tagcategory[$scope.article.category];
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
});


angular.module('pinApp')
.controller('ArticleSearchCtrl', function ($scope,$http,$sce,$upload,$timeout,$routeParams) {

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
  $scope.searchterm=$routeParams.search;
  $scope.articleload=0;

    $http({ method: 'GET', url: '/api/articles/search/'+$routeParams.search}).
        success(function (data, status, headers, config) {
          $scope.articles=data.articles;
          $scope.articleload=1;
        })
        .error(function (data, status, headers, config) {

        });

});

angular.module('pinApp')
.controller('ArticleAddCtrl', function ($scope,Auth,$location,$rootScope,$routeParams,$http,$upload,$timeout) {
  $scope.category=['Grow','Protect','Manage','Give'];

  $scope.column=[1,2];
  $scope.hanscategory=['Architect Blueprint','Essentials Foundation','Growth Pillars','Freedom Slab','Fun Money Roof'];


  $scope.tagcategory={
        'Grow':['Equities','Fixed Interest','Real Estate', 'Cash','Global','Alternatives'],
        'Protect':['Trusts','Wills','Governance'],
        'Manage':[],
        'Give':[]
  };

  $scope.article={};
  $scope.preview=0;

  $scope.today = function() {
      $scope.article.eventdate = new Date();
    };
    // $scope.today();

    $scope.clear = function () {
      $scope.article.eventdate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      // return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

  $scope.article.category=$scope.category[0];
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

   $http({ method: 'GET', url: '/api/users/adminrole' }).
      success(function (data, status, headers, config) {
        // ...
        var me={
                    _id: $rootScope.currentUser._id,
                    name: 'ME'
                };

        data.users.push(me);
        $scope.experts=data.users;
      }).
      error(function (data, status, headers, config) {
        $scope.experts={};
      }
      );


  $scope.changemmicategory=function(){

     var removeIndex = $scope.mmicategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmicategory);

      $scope.mmisubcategory=$scope.mmicategory[removeIndex].sub;
      $scope.article.mmitags=$scope.mmicategory[removeIndex].sub;

  };

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

   var removeIndex = $scope.mmisubcategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmisubcategory);

      $scope.article.mmitags=$scope.mmisubcategory[removeIndex].tags;
      // $scope.article.mmitags=$scope.article.mmitags[removeIndex].tags;
      $scope.article.tags=$scope.tagcategory[$scope.article.category];



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
    if(!$scope.article.author)
    {
      $scope.article.author= $rootScope.currentUser._id;
    }

    var original=$scope.article.tags;

    // $scope.article.tags=[];
    // for (var t = 0; t < original.length; t++) {
    //   $scope.article.tags[t] = original[t].text;
    // }
    var mainfiles=[];
      mainfiles[0]=file;
    if($scope.thumbleFile)
    {
        mainfiles.push($scope.thumbleFile[0]);
    }

    file.upload = $upload.upload({
      url: '/api/articles',
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.article,
      file: mainfiles
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
    $scope.videoupload=0;
    $scope.imageupload=0;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          if(file.type.indexOf('video') > -1){

            $scope.videoupload=1;
          }
          if(file.type.indexOf('image') > -1){

            $scope.imageupload=1;
          }


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

  $scope.setThumbleFiles = function(element) {
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
              $scope.thumbleFile=element.files;

            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.thumblefiles = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.thumblefiles.push(element.files[i]);
      }
      // $scope.progressVisible = false;
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

     var removeIndex = $scope.mmisubcategory
      .map(function(item)
      {
        return item.name;
      })
      .indexOf($scope.article.mmisubcategory);

      $scope.article.mmitags=$scope.mmisubcategory[removeIndex].tags;
      $scope.article.tags=$scope.tagcategory[$scope.article.category];


          if(!$scope.article.author)
    {
      $scope.article.author= $rootScope.currentUser._id;
    }

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

});
