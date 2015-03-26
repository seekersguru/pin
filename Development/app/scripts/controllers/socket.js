'use strict';

angular.module('pinApp')
.controller('SocketCtrl', function ($log, $scope, chatSocket, messageFormatter, nickName,$rootScope,$location) {
  if($rootScope.currentUser)
  {
    nickName=$rootScope.currentUser.name;
  }


  $scope.currentDate=new Date().getTime();
  $scope.chatlist=[
  {
    'title':'chat title',
    'topic':'topic name'
  },
  {
    'title':'chat title',
    'topic':'topic name'
  },
  ];

 $scope.chatid=$location.search()['cid'] || 'nochat';

  $scope.chatDetail = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      $location.path('/chat-start').search('cid',$scope.chatid);

    }
  };

  $scope.nickName = nickName;
  $scope.messageLog = 'Ready to chat!';
  $scope.sendMessage = function() {
  

    // var match = $scope.message.match('^\/nick (.*)');

    // if (angular.isDefined(match) && angular.isArray(match) && match.length === 2) {
    //   var oldNick = nickName;
    //   nickName = match[1];
    //   $scope.message = '';
    //   $scope.messageLog = messageFormatter(new Date(), 
    //                   nickName, 'nickname changed - from ' + 
    //                     oldNick + ' to ' + nickName + '!') + $scope.messageLog;
    //   $scope.nickName = nickName;
    // }

    $log.debug('sending message', $scope.message);
    chatSocket.emit('message', nickName, $scope.message);
    $scope.message = '';

  };

  $scope.$on('socket:broadcast', function(event, data) {
    
    $log.debug('got a message', event.name);
    if (!data.payload) {
      $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
      return;
    }else{
      // save in db with 
      // userid:$rootScope.currentUser._id
      // data.payload

    }

    $scope.$apply(function() {
      $scope.messageLog = messageFormatter(new Date(), data.source, data.payload) + $scope.messageLog;
    });
  });
});
