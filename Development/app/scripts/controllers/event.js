'use strict';

angular.module('pinApp')
  .controller('EventListCtrl', function($scope, $rootScope, events) {
    angular.forEach(events, function(eventname, key) {
      var currentdate = new Date();

      if (new Date(eventname.eventdate) < new Date(currentdate))
        delete events[key];


    });
    $scope.events = events;

  });

angular.module('pinApp')
  .controller('EventViewCtrl', function($scope, $http, $timeout, $compile,
    $location, $rootScope, events) {
    $timeout(function() {

      $('.post-box').hover(
        function() {
          $(this).find(
            '.caption, .caption-red, .caption-pink, .caption-aqua').slideDown(
            250); //.fadeIn(250)
        },
        function() {
          $(this).find(
            '.caption, .caption-red, .caption-pink, .caption-aqua').slideUp(
            250); //.fadeOut(205)
        }
      );
    }, 500);


    // $scope.usingFlash = FileAPI && FileAPI.upload != null;
    // $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    //
    $scope.events = events;


    var addresspickerMap = $("#addresspicker_map").addresspicker({
      regionBias: "in",
      language: "in",
      mapOptions: {
        zoom: events.location.zoom,
        center: new google.maps.LatLng(events.location.lat, events.location
          .lng),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      elements: {
        map: "#map"
      }
    });

    var gmarker = addresspickerMap.addresspicker("marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker("updatePosition");

    $scope.registerUserInEvent = function() {
      $scope.events.serviceregistered.push($rootScope.currentUser._id);

      var user = {
        user: $rootScope.currentUser._id
      };

      $http({
        method: 'PUT',
        url: '/api/events/register/' + events._id,
        data: user
      }).
      success(function(data, status, headers, config) {

      }).
      error(function(data, status, headers, config) {
        $scope.article = {};
      });
    };



  });

angular.module('pinApp')
  .controller('EventEditCtrl', function($scope, $http, $timeout, $compile,
    $upload, $location, $rootScope, events) {

    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];
    $scope.article = events;

    $scope.loadExpert = function($query) {
      return $http.get('/api/expert/basic', {
        cache: true
      }).then(function(response) {
        var experts = response.data.experts;
        return experts.filter(function(expert) {
          return expert.name.toLowerCase().indexOf($query.toLowerCase()) !=
            -1;
        });
      });
    };

    $scope.clear = function() {
      $scope.article.eventdate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
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



    var addresspickerMap = $("#addresspicker_map").addresspicker({
      regionBias: "in",
      language: "in",
      updateCallback: showCallback,
      mapOptions: {
        zoom: $scope.article.location.zoom,
        center: new google.maps.LatLng($scope.article.location.lat,
          $scope.article.location.lng),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      elements: {
        map: "#map",
        lat: "#lat",
        lng: "#lng",
        street_number: '#street_number',
        route: '#route',
        locality: '#locality',
        sublocality: '#sublocality',
        administrative_area_level_2: '#district',
        administrative_area_level_1: '#state',
        country: '#country',
        postal_code: '#postalcode',
        type: '#type'
      }
    });

    var gmarker = addresspickerMap.addresspicker("marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker("updatePosition");

    $('#reverseGeocode').change(function() {
      $("#addresspicker_map").addresspicker("option", "reverseGeocode", (
        $(this).val() === 'true'));
    });

    function showCallback(geocodeResult, parsedGeocodeResult) {
      $('#callback_result').text(JSON.stringify(parsedGeocodeResult, null, 4));
    }
    // Update zoom field
    var map = $("#addresspicker_map").addresspicker("map");
    google.maps.event.addListener(map, 'idle', function() {
      $('#zoom').val(map.getZoom());
    });
    $scope.setscopeval = function() {
      $('#locality').val($scope.article.location.locality);
      $('#sublocality').val($scope.article.location.sublocality);
      $('#district').val($scope.article.location.district);
      $('#state').val($scope.article.location.state);
      $('#country').val($scope.article.location.country);
      $('#postalcode').val($scope.article.location.postalcode);
      $('#lat').val($scope.article.location.lat);
      $('#lng').val($scope.article.location.lng);
      $('#zoom').val($scope.article.location.zoom);

    };
    $scope.setscopeval();

    $scope.setscope = function() {

      var original = $scope.article.expert;
      $scope.article_put.expert = [];
      for (var t = 0; t < original.length; t++) {
        $scope.article_put.expert[t] = {
          name: original[t].name,
          user: original[t]._id,
          flag: original[t].flag,
          designation: original[t].designation
        };
      }


      $scope.article_put.location.locality = $('#locality').val();
      $scope.article_put.location.sublocality = $('#sublocality').val();
      $scope.article_put.location.district = $('#district').val();
      $scope.article_put.location.state = $('#state').val();
      $scope.article_put.location.country = $('#country').val();
      $scope.article_put.location.postalcode = $('#postalcode').val();
      $scope.article_put.location.lat = $('#lat').val();
      $scope.article_put.location.lng = $('#lng').val();
      $scope.article_put.location.zoom = $('#zoom').val();
    };


    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);

    $scope.removeMedia = function() {
      var remove = confirm(
        "Are you sure you want to remove Event Banner Image");
      if (remove) {

        $http({
          method: 'PUT',
          url: '/api/events/removemedia/' + $scope.article._id
        }).
        success(function(data, status, headers, config) {
            $scope.article.media = "";

          })
          .error(function(data, status, headers, config) {

            alert(
              'There is something technical problem.Please try after some time.'
            );

          });
      }

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
      $scope.article_put = {
        title: $scope.article.title,
        agenda: $scope.article.agenda,
        bannertext: $scope.article.bannertext,
        category: $scope.article.category,
        location: {
          address: $scope.article.location.address
        },
        eventdate: $scope.article.eventdate

      };

      $scope.setscope();

      file.upload = $upload.upload({
        url: '/api/events/' + events._id,
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        data: $scope.article_put,
        file: file
      });

      file.upload.then(function(response) {
        $timeout(function() {
          console.log(response);
          $location.path('/event/view/' + response.data.article._id);
        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        $location.path('/event/view/' + response.data.article._id);
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
        if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 ||
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
      $scope.article_put = {
        title: $scope.article.title,
        agenda: $scope.article.agenda,
        bannertext: $scope.article.bannertext,
        category: $scope.article.category,
        location: {
          address: $scope.article.location.address
        },
        eventdate: $scope.article.eventdate
      };
      $scope.setscope();
      if (form.$valid) {
        $http({
          method: 'PUT',
          url: '/api/events/' + $scope.article._id,
          data: $scope.article_put
        }).
        success(function(data, status, headers, config) {
          // ...
          $location.path('/event/view/' + data.article._id);


        }).
        error(function(data, status, headers, config) {
          alert(
            'Oh Oh :(.  There is some technical problem please try after some time .'
          );

        });
      }
    };

    $scope.reset = function(form) {
      $scope.form.$setPristine();
    };

    $scope.remove = function(form) {
      var yes = confirm('Are you sure you want to delete this Expert?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/events/' + $scope.expert._id
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
  .controller('EventCtrl', function($scope, $http, $timeout, $compile, $upload,
    $location, $rootScope) {


    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];
    $scope.article = {
      location: {}
    };

    $scope.article.category = $scope.category[0];
    $scope.article.expert = [];

    $scope.template = function(templateno) {
      $scope.article.title = "Set your Event Title Name";
      $scope.article.agenda =
        "<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>" +

        "<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>" +

        "<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>" +

        "<b>berspiciatis unde omnis </b>" +

        "<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>" +

        "<b> At vero eos et accusamus</b>" +

        "<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>" +

        "<b>Commodo Consequat</b>" +

        "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";

      $scope.article.bannertext =
        "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";

      $scope.article.eventdate = new Date();
      // $( "#addresspicker_map" ).val('Mumbai, Maharashtra, India');


    };

    $scope.loadExpert = function($query) {
      return $http.get('/api/expert/basic', {
        cache: true
      }).then(function(response) {
        var experts = response.data.experts;
        return experts.filter(function(expert) {
          return expert.name.toLowerCase().indexOf($query.toLowerCase()) !=
            -1;
        });
      });
    };

    $scope.today = function() {
      $scope.article.eventdate = new Date();
    };
    // $scope.today();

    $scope.clear = function() {
      $scope.article.eventdate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
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

    var addresspickerMap = $("#addresspicker_map").addresspicker({
      regionBias: "in",
      language: "in",
      updateCallback: showCallback,
      mapOptions: {
        zoom: 4,
        center: new google.maps.LatLng(19.0759837, 72.87765590000004),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      elements: {
        map: "#map",
        lat: "#lat",
        lng: "#lng",
        street_number: '#street_number',
        route: '#route',
        locality: '#locality',
        sublocality: '#sublocality',
        administrative_area_level_2: '#district',
        administrative_area_level_1: '#state',
        country: '#country',
        postal_code: '#postalcode',
        type: '#type'
      }
    });

    var gmarker = addresspickerMap.addresspicker("marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker("updatePosition");

    $('#reverseGeocode').change(function() {
      $("#addresspicker_map").addresspicker("option", "reverseGeocode", (
        $(this).val() === 'true'));
    });

    function showCallback(geocodeResult, parsedGeocodeResult) {
      $('#callback_result').text(JSON.stringify(parsedGeocodeResult, null, 4));
    }
    // Update zoom field
    var map = $("#addresspicker_map").addresspicker("map");
    google.maps.event.addListener(map, 'idle', function() {
      $('#zoom').val(map.getZoom());
    });


    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);


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

      $scope.setscope();
      file.upload = $upload.upload({
        url: '/api/events',
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
          // $location.path('expert/view/'+response.data.article._id);
          file.result = response.data;
          if ($rootScope.currentUser.role == 'admin') {

            $location.path('/event/view/' + response.data.article._id);

          }

          $scope.expert = {};

        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        $scope.expert = {};
        if ($rootScope.currentUser.role == 'admin') {

          $location.path('/event/view/' + response.data.article._id);

        }

        $scope.articleDone = 1;
        $scope.articleResponse = response.data;
        // $location.path('expert/view/'+response.data.article._id);
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
        if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 ||
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

        $scope.setscope();
        // $scope.form.$setPristine();
        $http({
          method: 'POST',
          url: '/api/events',
          data: $scope.article
        }).
        success(function(data, status, headers, config) {

          // console.log(data);

          if ($rootScope.currentUser.role == 'admin') {

            $location.path('/event/view/' + data.article._id);

          }


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

    $scope.setscope = function() {
      $scope.article.author = $rootScope.currentUser._id;
      var original = $scope.article.expert;
      $scope.article.expert = [];
      for (var t = 0; t < original.length; t++) {
        $scope.article.expert[t] = {
          name: original[t].name,
          user: original[t]._id,
          flag: original[t].flag,
          designation: original[t].designation
        };
      }


      $scope.article.location.locality = $('#locality').val();
      $scope.article.location.sublocality = $('#sublocality').val();
      $scope.article.location.district = $('#district').val();
      $scope.article.location.state = $('#state').val();
      $scope.article.location.country = $('#country').val();
      $scope.article.location.postalcode = $('#postalcode').val();
      $scope.article.location.lat = $('#lat').val();
      $scope.article.location.lng = $('#lng').val();
      $scope.article.location.zoom = $('#zoom').val();
    };

  });
