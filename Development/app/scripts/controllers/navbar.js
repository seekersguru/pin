'use strict';

angular.module('pinApp')
	.controller('NavbarCtrl', ['$scope','$location','$rootScope','Auth','$http', function($scope,$location,$rootScope,Auth,$http){

  // var allEmail=['chetan.damani@sbi.co.in','chitra.basker@sbi.co.in','fca@vsnl.com','kalpesh.thakar@reuters.com','karan.singh@uti.co.in','naik@saharamutual.com','niraj.chandra@uti.co.in','nirmal.rewaria@edelcap.com','pkchand@birlacorp.com','sanjay.sharma@tatacapital.com','sanjayv@emiratesbank.com','satish.dikshit@uti.co.in','shrikant.tiwari@thomsonreuters.com','simi.mishra@thomsonreuters.com','vijayan.pankajakshan@welingkar.org','wm@tbngconsultants.com','adityavikram.dube@ml.com','amit_pathak@ml.com','anshu.shrivastava@revyqa.com','anuradha_shah@ml.com','apeksha.singh@oracle.com','aprabhu@templeton.com','ashish_gumashta@ml.com','atul_singh1@ml.com','avinash.luthria@gajacapital.com','d.rao@ml.com','dia_sen@ml.com','gfernandes@askgroup.in','girish.venkat@adityabirla.com','hbohara@askgroup.in','lahar.bhasin@icraonline.com','mehul_marfatia@ml.com','michelle_baptist@ml.com','pavit.chadha@ml.com','pkchand@birlacorp.com','pratikbagaria@rathi.com','r.karthik@lodhagroup.com','rajat.sinha@sc.com','rishab_parekh@ml.com','ritika.grover@hdfcbank.com','r_vaidya@ml.com','sandeep.khurana@sbi.co.in','sanjay_bhuwania@ml.com','satwick_tandon@ml.com','saujanya.shrivastava@bharti-axalife.com','shajikumar.devakar@barclaysasia.com','shruti.lohia@in.ey.com','shveta.singh@avendus.com','shyamal.lahon@tvscapital.in','siddharth_mishra@ml.com','skoticha@askgroup.in','svaidya@askgroup.in','tarun@tbngconsultants.com','ulhas.deshpande@bharti-axalife.com','unmesh_kulkarni@ml.com','varadaraya_mallya@ml.com','vikram_agarwal@ml.com','vishal.shah@barclaysasia.com','abhilash.misra@boiaxa-im.com','ajay.aswani@milestonecapital.in','anand.oke@axisbank.com','goswami@waltonst.com','mridulla@geplcapital.com','pkchand@birlacorp.com','query@arcil.co.in','srk@pinnaclefinancialplanners.com','vishal.mhaiskar@motilaloswal.com','asagar@adb.org','balvir@life-lite.com','d.p.singh@sbimf.com','dennythomas@hsbc.co.in','dinesh.khara@sbimf.com','goswami@waltonst.com','govind@acornwealth.com','hiten@kpmg.com','info@srinidhihomes.in','nitinsingh@hsbc.co.in','query@arcil.co.in','r.srinivas@sbimf.com','rahul.pal@taurusmutualfund.com','ravi.r.menon@hsbc.com','s.mahadevan@sbimf.com','sanjayshah@hsbc.co.in','shivdasrao@hsbc.co.in','sinor@amfiindia.com','srk@pinnaclefinancialplanners.com','sunil.avasthi@indianivesh.in','tanya.dere@sbimf.com','vivekmakim@hsbc.co.in','amitav@fiuindia.gov.in','anand@mfl.in','anil.abraham@hdfcbank.com','animeshraizada@hsbc.co.in','anisha.motwani@maxlifeinsurance.com','ankurt@lntmf.com','ashish.chauhan@bseindia.com','ashish.naik@axismf.com','ashissh.dikshit@bcids.org','ashu.suyash@lntmf.com','bharat.banka@adityabirla.com','birens@lntmf.com','c.vasudevan@bseindia.com','charul.shah@greshma.com','chetan1joshi@hsbc.co.in','debaprasad.mukherjee@fiserv.com','devika.shah@bseindia.com','dhirajsachdev@hsbc.co.in','dka@smcindiaonline.com','ekta.keswani@sc.com','gaurav.pandya@adityabirla.com','gaurav.perti@sc.com','ghazala.khatri@warmond.co.in','gopal.lakhotia@sc.com','hitendradave@hsbc.co.in','info@srinidhihomes.in','jayesh.faria@ltcapitalindia.in','jayesh.shroff@sbimf.com','jayna_gandhi@hotmail.com','jitendrasriram@hsbc.co.in','joseph.thomas@adityabirla.com','jyoti.vaswani@avivaindia.com','kailash@lntmf.com','lakshmi.sankar@icicibank.com','m.venkataraghavan@axismf.com','manjeeri@sngpartners.in','manoj.shenoy@ltcapitalindia.in','megha_maheshwari@icicipruamc.com','monalisa.shilov@bnpparibasmf.in','nainakidwai@hsbc.co.in','namitagodbole@plindia.com','navneet.munot@sbimf.com','naysar.shah@birlasunlife.com','nikhil.johri@bnpparibasmf.in','nilesh_c_shah@hotmail.com','nirakar.pradhan@futuregenerali.in','pankaj.murarka@axismf.com','pavri101@hotmail.com','piyushharlalka@hsbc.co.in','prateekjain@hsbc.co.in','praveen.bhatt@axismf.com','puneetchaddha@hsbc.co.in','query@arcil.co.in','r.srinivasan@sbimf.com','rahul_shringarpure@hotmail.com','rajeev.singhal@sbi.co.in','rajeshi@lntmf.com','rajeshp@lntmf.com','rajni@sbbj.co.in','rbajaj@bajajcapital.com','reema.savla@bseindia.com','ricsindia@rics.org','rohit.garg@kotak.com','ruchit.mehta@sbimf.com','saket@comsol.in','sandra.correia@vecinvestments.com','sanjay.dutt@ap.cushwake.com','shantanushankar@hsbc.co.in','shikhab@bajajcapital.com','shirazr@lntmf.com','shreenivashegde@hsbc.co.in','shridhar.iyer@bnpparibasmf.in','shujasiddiqui@ltcapitalindia.in','shwaitavaish@hsbc.co.in','siddharthtaterh@hsbc.co.in','sm2nid@centralbank.co.in','sohini.andani@sbimf.com','srk@pinnaclefinancialplanners.com','suchita.shah@sbimf.com','sudhanshu.asthana@axismf.com','surajs@lntmf.com','tanmaya.desai@sbimf.com','tusharpradhan@hsbc.co.in','uttama@bajajcapital.com','v.hansprakash@issl.co.in','vcskenkare@sancharnet.in','venugopalm@lntmf.com','vijai.mantri@pramerica.com','vijay.prabhu@sbimf.com','vijaykumar@andhrabank.co.in','vikramc@lntmf.com','vimaljain@sbbj.co.in','vineet1patawari@hsbc.co.in','vinod.nair@bseindia.com','vinodv@lntmf.com','virendra@sngpartners.in','viresh.joshi@axismf.com','vishal@cedarwood.co.in','yatin.padia@bseindia.com'];
  // allEmail=$.unique(allEmail);
  // console.log(allEmail);

  // for (var i = allEmail.length - 1; i >= 0; i--) {
  //   $http({
  //     method:"DELETE",
  //     url:'/api/mmiusers/deletemailusers/'+allEmail[i]

  //    }).
  //   success(function (data,status,headers,config){

  //   })
  //   .error(function (data,status,headers,config){

  //   });

  // }
  

  // active menu option
	$scope.isActive = function(route) {
      return $location.path() === route;
  };
    

    // logout
	$scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });   
  };
  
  
  //login
  $scope.login = function(form) {
	  $scope.submitted = true;
	  $rootScope.loginStatus=1;
    if(form.$valid) {
      Auth.login({
        // I really hate doing this, I hope Angular JS guys and FF guys can solve this issue.
        email: document.getElementById('emailnav').value,   // Doing this becuase of Firefox issue of autofill
        password: document.getElementById('passwordnav').value // not trigerring Angular JS update. FFBug ID: 950510
      })
      .then( function() {
        // Logged in, redirect to home
       
          if($rootScope.currentUser.role=='admin')
            {

            $location.path('/admin').search({'users':1});

            }else{
          
        if ($rootScope.redirectPath && $rootScope.redirectPath !== '/register' ) {
          var path = $rootScope.redirectPath;
          $rootScope.redirectPath = undefined;
          $location.path(path);
        } else {
        
            $location.path('/articles/01');
        }
      }
      })
      .catch( function(err) {
        err = err.data;
        // $location.path('/login').search({'loginError': err.message.message,'field':err.message.field});
        $location.path('/login').search({'loginError': err.message.message,'field':err.message.field});
        // $scope.errors.field = err.message.field;
        // $scope.errors.message = err.message.message;
        // $scope.errors.type = err.message.type;
      });
    }
	};

}]);