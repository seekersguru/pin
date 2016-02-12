'use strict';

angular.module('pinApp')
	.controller('SitemapCtrl', ['$scope', '$location', '$rootScope', 'Auth',
		'$http', '$modal',
		function($scope, $location, $rootScope, Auth, $http, $modal) {

		$scope.hanscategoryURL={'Architect Blueprint':'architect-blueprint',
                           'Essentials Foundation':'essentials-foundation',
                           'Growth Pillars':'growth-pillars',
                            'Freedom Slab':'freedom-slab',
                           'Fun Money Roof':'fun-money-roof'
    	};

			$scope.getEventslist = function() {
				$scope.eventlist = [];
				$http({
					method: "GET",
					url: 'api/events'
				}).
				success(function(data, status, headers, config) {

					angular.forEach(data.articles, function(eventname, key) {
						var currentdate = new Date();
						if (new Date(eventname.eventdate) < new Date(currentdate))
							delete data.articles[key];
					});

					$scope.pineventlist = data.articles;

				})

				.error(function(data, status, headers, config) {

				});



			};

			$scope.getDiscussionslist = function() {
				$scope.eventlist = [];
				$http({
					method: "GET",
					url: 'api/discussions'
				}).
				success(function(data, status, headers, config) {

					$scope.pindiscussionslist = data.discussion;

				})

				.error(function(data, status, headers, config) {

				});



			};

			$scope.getArticle = function() {
				$scope.eventlist = [];
				$http({
					method: "GET",
					url: 'api/articles'
				}).
				success(function(data, status, headers, config) {

					$scope.pinarticles = data.articles;

				})

				.error(function(data, status, headers, config) {

				});



			};

			

			$scope.getEventslist();
			$scope.getDiscussionslist();
			$scope.getArticle();
		}
	]);

