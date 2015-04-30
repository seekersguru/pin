'use strict';

angular.module('pinApp')
.controller('CompanyCtrl', function ($scope,$rootScope,companys) {

$scope.companys=companys.copmanys;

});

angular.module('pinApp')
.controller('EventViewCtrl', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope,events) {

  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
  $scope.events=events;
  var addresspickerMap= $( "#addresspicker_map" ).addresspicker({
      regionBias: "in",
      language: "in",
      mapOptions: {
        zoom: events.location.zoom,
        center: new google.maps.LatLng(events.location.lat, events.location.lng),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
       elements: {
        map:      "#map"
      }
    });

    var gmarker = addresspickerMap.addresspicker( "marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker( "updatePosition");

    $scope.registerUserInEvent=function(){
      $scope.events.serviceregistered.push($rootScope.currentUser._id);

    var user={ user: $rootScope.currentUser._id};  

    $http({ method: 'PUT', url: '/api/events/register/'+events._id,data:user }).
    success(function (data, status, headers, config) {
                  
        }).
    error(function (data, status, headers, config) {
      $scope.article={};
    });
  };

   

});

angular.module('pinApp')
.controller('CompanyEditViewCtrl', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope,company) {

  $scope.article={};
  $scope.article=company;
  $scope.article.addresstimes=[];

  for (var i = 0; i < company.address.length-1; i++) {
  
      $scope.article.addresstimes.push('val'+i);
  };


    $scope.removeaddress=function(key)
    {
      
      $scope.article.addresstimes.splice(key, 1);  
      $scope.article.address.splice(key, 1);  
   
    };


 
     $scope.addAddress=function(){

      $scope.article.address.push("  ");
      $scope.article.addresstimes.push(new Date());


    };

 $scope.setscope=function(){
  
  // var original=$scope.article.expert;
  // $scope.article_put.expert=[];
  // for (var t = 0; t < original.length; t++) {
  //   $scope.article_put.expert[t] = { name:original[t].name,user:original[t]._id,flag:original[t].flag,designation:original[t].designation};
  // }
};



  //update
  $scope.updateArticle=function(form){
    $scope.article_put={
      title:$scope.article.title,
      description:$scope.article.description,
      organization:$scope.article.organization,
      address:$scope.article.address,
      url:$scope.article.url,
      // public:$scope.article.public
    };

    if(form.$valid)
    {
      $http({ method: 'PUT', url: '/api/companys/'+$scope.article._id,data:$scope.article_put }).
      success(function (data, status, headers, config) {
        // ...
        $location.path('/company/view/'+data.company._id);
        
        
      }).
      error(function (data, status, headers, config) {
          alert('Oh Oh :(.  There is some technical problem please try after some time .');

      });
    }
  };
  
  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

  $scope.remove=function(form){
    var yes=confirm('Are you sure you want to delete this Expert?');
    if(yes)
    {
      $http({
        method:"DELETE",
        url:'/api/events/'+$scope.expert._id
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
.controller('CompanyAddCtrl', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope) {

$scope.article={};
$scope.article.addresstimes=[1];
$scope.article.address=[""];
$scope.template=function(templateno){$scope.article={};
$scope.article.title="Set your Event Title Name";
$scope.article.description="<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>"+

"<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>"+

"<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"+

"<b>berspiciatis unde omnis </b>"+

"<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>"+

"<b> At vero eos et accusamus</b>"+

"<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>"+

"<b>Commodo Consequat</b>"+

"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";



};

  $scope.saveArticle=function(form){
    //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
    // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));
    

    if(form.$valid)
    {
      // var formData = new FormData();
      // formData.append("file", $scope.article.file);
      // console.log(formData);
      
      $scope.setscope();
      // $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/companys',data:$scope.article }).
      success(function (data, status, headers, config) {
        
        // console.log(data);
        
        if($rootScope.currentUser.role == 'admin')
        {
        
            $location.path('/company/view/'+data.company._id);
        
        }
       
        
      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });
    }


  };

    $scope.addAddress=function(){

      $scope.article.address.push("  ");
      $scope.article.addresstimes.push(new Date());


    };
    
    $scope.removeaddress=function(key)
    {
      
      $scope.article.addresstimes.splice(key, 1);  
      $scope.article.address.splice(key, 1);  
   
    };


$scope.reset=function(form){
    $scope.form.$setPristine();
  };

$scope.setscope=function(){
  $scope.article.author=$rootScope.currentUser._id;
  // var original=$scope.article.expert;
  // $scope.article.expert=[];
  // for (var t = 0; t < original.length; t++) {
  //   $scope.article.expert[t] = { name:original[t].name,user:original[t]._id,flag:original[t].flag,designation:original[t].designation};
  // }

};

});
