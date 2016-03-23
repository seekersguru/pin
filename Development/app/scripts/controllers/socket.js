
'use strict';

angular.module('pinApp')
.controller('SocketCtrl', function ($log, $scope, nickName,$rootScope,$location,$http,$timeout) {
  if($rootScope.currentUser)
  {
    nickName=$rootScope.currentUser.name;
  }
  $scope.startdiscussion=0;

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
 
  $scope.currentDate=new Date().getTime();

 
 $scope.category=['Grow','Protect','Manage','Give'];
 
 $scope.article={};
 $scope.chat={};
 if($location.search()['cid'])
 {
 $scope.chatid=$location.search()['cid'];
 $scope.chat={cid : $scope.chatid};
 $http({ method: 'GET', url: '/api/discussions/'+$location.search()['cid'] }).
      success(function (data, status, headers, config) {
        $scope.discussion=data.discussion[0];
        $scope.comments=$scope.discussion.pin ? $scope.discussion.comments : $scope.discussion.scomments ;

      })

      
      .error(function (data, status, headers, config) {
          $scope.chatid='nochat';
      });
 }else{

  $scope.chatid=$location.search()['cid'] || 'nochat';
   $http({ method: 'GET', url: '/api/discussions' }).
      success(function (data, status, headers, config) {
        $scope.chatlist=data.discussion;
      })
      
      .error(function (data, status, headers, config) {
        // $location.path('/chat-start').search('cid',$scope.chatid);
        
      });


 }

 



$scope.deleteComment=function(commentId){

  var yes=confirm('Are you sure you want to delete this Comment?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/discussion-comments/'+$scope.discussion._id+'/'+commentId+'?type='+($scope.discussion.pin ? 'pin' : 'mmi')
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

    $http({ method: 'POST', url: '/api/discussion-comments/'+$scope.discussion._id,data:comment }).
    success(function (data, status, headers, config) {
          // ...
          console.log(data);
          comment.posted=new Date();
          comment._id=data.comments[data.comments.length-1]._id;

          $scope.comments.push(comment);
          
          $scope.article={};
          // 
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
  var comment={ post: editcomment,type:($scope.discussion.pin ? 'pin' : 'mmi' )};  

    $http({ method: 'PUT', url: '/api/discussion-comments/'+$scope.discussion._id+'/'+commentId,data:comment}).
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

  $scope.chatDetail = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
    $scope.forsubmit=1;

      $scope.chat.comments=[{ user: $rootScope.currentUser._id,
               username:$rootScope.currentUser.name,
               post: $scope.chat.comment               
             }];
      $scope.chat.cid=new Date().getTime();       
      $scope.chat.authorpin=$rootScope.currentUser._id;
      
      $http({ method: 'POST', url: '/api/discussions',data:$scope.chat }).
      success(function (data, status, headers, config) {
        // $location.path('/discussion-start').search('cid',$scope.chatid);
        $scope.forsubmit=0;
        $location.path('discussion-start').search('cid',$scope.chat.cid);
        $scope.chatlist.push($scope.chat);
        $scope.form.$setPristine();
        // $scope.lastid=$scope.chat.cid;
        $scope.chat={};
        $scope.creatediscussion=1;

      })
      .error(function (data, status, headers, config) {
        // $location.path('/chat-start').search('cid',$scope.chatid);
        $scope.forsubmit=0;
      });

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
    //   $scope.messageLog = ew Date(), 
    //                   nickName, 'nickname changed - from ' + 
    //                     oldNick + ' to ' + nickName + '!') + $scope.messageLog;
    //   $scope.nickName = nickName;
    // }

    // $log.debug('sending message', $scope.message);
    // chatSocket.emit('message', nickName, $scope.message);
    // $scope.message = '';

  };
  
});
