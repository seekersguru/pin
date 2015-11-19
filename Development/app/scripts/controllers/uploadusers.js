'use strict';

angular.module('pinApp')
.controller('UploadUsersCtrl', ['$scope','$rootScope','$http','$route','$timeout','$upload',function ($scope,$rootScope,$http,$route,$timeout,$upload ) {
  $scope.article={};
  $scope.loaddata=0;
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

  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

  $scope.users=[];

$scope.uploadPic = function(files) {


    $scope.formUpload = true;
    
    if ($scope.mainFIle[0] !== null) {
       generateThumbAndUpload($scope.mainFIle[0]);
    }



  };
  
  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    //$scope.generateThumb(file);
    uploadUsing$upload(file);
    
  }

  function uploadUsing$upload(file) {
    var mainfiles=[];
      mainfiles[0]=file; 
    
    file.upload = $upload.upload({
      url: '/api/users/upload',
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
        // $location.path('articles/view/'+output.Sheet1[i].response.data.article._id);
        file.result = response.data;
        $scope.articleDone=1;
        startparsing();
      });
    }, function(response) {
      if (response.status > 0)
      $scope.errorMsg = response.status + ': ' + response.data;
      $scope.article={};
      $scope.articleDone=1;
      startparsing();
     
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
      if ($scope.fileReaderSupported) {
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
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
             element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
              $scope.loaddata=0;  
              
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
      if ($scope.fileReaderSupported ) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
           //   element.files[0].dataUrl = e.target.result;
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


  $scope.uploadCompany=function(){

  angular.forEach($scope.users, function(value, key) {
      // $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/users',data:value }).
      success(function (data, status, headers, config) {
        $scope.users[key].status=1;
      }).
      error(function (data, status, headers, config) {
        // ...
        angular.forEach(data.errors,function(error, field){

          $scope.users[key]['error'][field]=error.message;

        });

      });
  });                   

    

  };



  // ----------------
  function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
    }
  });
  return result.join("\n");
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  // console.log(result);
  return result;
}

function process_wb(wb) {
  var output = to_json(wb);
  // if(out.innerText === undefined) out.textContent = output;
  // else out.innerText = output;
  $scope.loaddata=1;
  if(typeof console !== 'undefined') 
    {
      console.log("output", new Date());
      console.log(output);
      var str="";
    if(output.users && output.users.length)
    {

$scope.users=[];

    for (var i = 0; i < output.Sheet1.length; i++) {
      
      var temp={
  'firstname':output.Sheet1[i].firstname,
  'lastname':output.Sheet1[i].lastname,
  'username':output.Sheet1[i].username,
  'email':output.Sheet1[i].email,
  'password':output.Sheet1[i].password,
  'band':output.Sheet1[i].band,
  'phone':output.Sheet1[i].phone,
  'address':  {  
    'street':output.Sheet1[i].addressstreet,
    'city':output.Sheet1[i].addresscity,
    'country':output.Sheet1[i].addresscountry
  },   
  'notes':output.Sheet1[i].notes,
  'status':0,
  'error':{}
  
  };
  
     $scope.users.push(temp);
 }
 $scope.setdata=1;
  $scope.loaddata=1;
}else{
   $scope.loaddata=1;
      $scope.setdatanotfound=1;
    }
     // out.innerText=str;
  }
}

var url = "uploads/users.xlsx";

var oReq;
function startparsing()
{

if(window.XMLHttpRequest) oReq = new XMLHttpRequest();
else if(window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
else throw "XHR unavailable for your browser";

// document.getElementById('fileurl').innerHTML = '<a href="' + url + '">Download file</a>';

oReq.open("GET", url, true);

if(typeof Uint8Array !== 'undefined') {
  oReq.responseType = "arraybuffer";
  oReq.onload = function(e) {
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var arraybuffer = oReq.response;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var wb = XLSX.read(arr.join(""), {type:"binary"});
    process_wb(wb);
  };
} else {
  oReq.setRequestHeader("Accept-Charset", "x-user-defined");  
  oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
    var ff = convertResponseBodyToText(oReq.responseBody);
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var wb = XLSX.read(ff, {type:"binary"});
    process_wb(wb);
  } };
}

oReq.send();
}


}]);
