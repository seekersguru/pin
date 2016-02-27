'use strict';

angular.module('pinApp')
.controller('MMIuserEditCtrl', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope,company) {

  $scope.article={};
  $scope.article=company;
  $scope.article.addresstimes=[];

  $scope.services=['Wealth management','Investment advisory',  'Investment execution','Wealth planning','Financial planning','Tax','Audit','Legal','IT product','IT consulting','Educational certifications','Educational training','Trade body','Self-regulation','Trust set-up','Trusteeship','Trust administration','Consulting - management/HR','Consulting - investment','Media outlet','Media agent','Media content','Philanthropy advice','Philanthropy execution','Asset management - mutual fund','Asset management - institutional','Asset management - managed account','Asset management - alternatives','Asset management - structured product','Lending/credit','Fiduciary','Regulation setting','Regulation enforcement','Securities exchange','Administration platform','BPO/KPO'];


   // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(servicename) {
    var idx = $scope.article.services.indexOf(servicename);

    // is currently selected
    if (idx > -1) {
      $scope.article.services.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.article.services.push(servicename);
    }
  };




  $scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }

    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
};

  for (var i = 0; i < company.address.length; i++) {

      $scope.article.addresstimes.push('val'+i);
  };


    $scope.removeaddress=function(key)
    {

      $scope.article.addresstimes.splice(key, 1);
      $scope.article.address.splice(key, 1);

    };



     $scope.addAddress=function(){

      $scope.article.address.push({
             street: '',
             city:'',
             state:'',
             country:'',
             pin:'',
             phone:'',
             main: false
          });
      $scope.article.addresstimes.push(new Date());


    };

$scope.setscope=function(){


};



  //update
  $scope.updateArticle=function(form){
    $scope.article_put={
      title:$scope.article.title,
      description:$scope.article.description,
      organization:$scope.article.organization,
      address:$scope.article.address,
      url:$scope.article.url,
      firmsupertype:$scope.article.firmsupertype,
      firmtype:$scope.article.firmtype,
      firmsubtype:$scope.article.firmsubtype,
      services:$scope.article.services,
      notes:$scope.article.notes,
      roletype:$scope.companyStructure[$scope.article.firmsupertype][$scope.article.firmtype][$scope.article.firmsubtype],
      public:$scope.article.public
    };

    if(form.$valid)
    {
      $http({ method: 'PUT', url: '/api/companys/'+$scope.article._id,data:$scope.article_put }).
      success(function (data, status, headers, config) {
        // ...
        $location.path('/admin').search('company');


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

  $scope.changemain=function(passkey){


    angular.forEach($scope.article.address, function(value, key) {
      $scope.article.address[key].main=false;
    });

    $scope.article.address[passkey].main=true;


  };

});

angular.module('pinApp')
.controller('CompanyAddCtrl', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope) {

$scope.article={};
$scope.article.addresstimes=[1];
$scope.article.address=[{
             street: '',
             city:'',
             state:'',
             country:'',
             pin:'',
             phone:'',
             main: false
          }];

$scope.services=['Wealth management','Investment advisory',  'Investment execution','Wealth planning','Financial planning','Tax','Audit','Legal','IT product','IT consulting','Educational certifications','Educational training','Trade body','Self-regulation','Trust set-up','Trusteeship','Trust administration','Consulting - management/HR','Consulting - investment','Media outlet','Media agent','Media content','Philanthropy advice','Philanthropy execution','Asset management - mutual fund','Asset management - institutional','Asset management - managed account','Asset management - alternatives','Asset management - structured product','Lending/credit','Fiduciary','Regulation setting','Regulation enforcement','Securities exchange','Administration platform','BPO/KPO'];

  $scope.article.services=[];

   // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(servicename) {
    var idx = $scope.article.services.indexOf(servicename);

    // is currently selected
    if (idx > -1) {
      $scope.article.services.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.article.services.push(servicename);
    }
  };



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

$scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }

    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
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

      $scope.article.address.push({
             street: '',
             city:'',
             state:'',
             country:'',
             pin:'',
             phone:'',
             main: false
          });
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
  $scope.article.roletype=$scope.companyStructure[$scope.article.firmsupertype][$scope.article.firmtype][$scope.article.firmsubtype];
  };

  $scope.changemain=function(passkey){


    angular.forEach($scope.article.address, function(value, key) {
      $scope.article.address[key].main=false;
    });

    $scope.article.address[passkey].main=true;


  };


});
