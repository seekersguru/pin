
'use strict';

angular.module('pinApp')
.controller('SocketCtrl', ['$log','$scope','nickName','$rootScope','$location','$http','$timeout',function ($log, $scope, nickName,$rootScope,$location,$http,$timeout) {
  if($rootScope.currentUser)
  {
    nickName=$rootScope.currentUser.firstname;
  }

$scope.color={
    'Investments':
    {'caption':'caption',
    'colorclass':'greenbox',
    'image':'green-chat.jpg'
  },
  'WM/distribution':
  {
    'caption':'caption-red',
    'colorclass':'redbox',
    'image':'red-chat.jpg'
  },
  'Communication':
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


  $scope.topicnames=[
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


    $scope.changetopic=function(){

     var removeIndex = $scope.topicnames
      .map(function(item)
      { 
        return item.name;
      })
      .indexOf($scope.chat.topic);

      $scope.subtopicnames=$scope.topicnames[removeIndex].sub;
      // $scope.article.mmitags=$scope.topicnames[removeIndex].sub;

  };

    $scope.changelookuptopic=function(){

     var removeIndex = $scope.topicnames
      .map(function(item)
      { 
        return item.name;
      })
      .indexOf($scope.search.topic);

      $scope.subtopicnames=$scope.topicnames[removeIndex].sub;
      // $scope.article.mmitags=$scope.topicnames[removeIndex].sub;

  };


 
 $scope.article={};
 $scope.chat={};
 if($location.search()['cid'])
 {
 $scope.chatid=$location.search()['cid'];
 $scope.chat={cid : $scope.chatid};
 $http({ method: 'GET', url: '/api/discussions/'+$location.search()['cid'] }).
      success(function (data, status, headers, config) {
        $scope.discussion=data.discussion[0];
        $scope.comments=$scope.discussion.scomments;

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
      url:'/api/discussion-comments/'+$scope.discussion._id+"/"+commentId
    }).
    success(function (data,status,headers,config){
      $scope.deleteStatus=1;

      var removeIndex = $scope.discussion.scomments
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(commentId);

      $scope.discussion.scomments.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

};


$scope.addComment=function(form){

 if(form.$valid)
 {
  
    var comment={ user: $rootScope.currentUser._id ,username:$rootScope.currentUser.firstname, post: $scope.article.comment};  

    $http({ method: 'POST', url: '/api/discussion-comments/'+$scope.discussion._id,data:comment }).
    success(function (data, status, headers, config) {
          // ...
          console.log(data);
          comment.posted=new Date();
          comment._id=data.scomments[data.scomments.length-1]._id;

          $scope.discussion.scomments.push(comment);
          
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
  var comment={ post: editcomment,username:$rootScope.currentUser.firstname,user:$rootScope.currentUser._id};  

    $http({ method: 'PUT', url: '/api/discussion-comments/'+$scope.discussion._id+'/'+commentId,data:comment}).
    success(function (data, status, headers, config) {
          // $scope.form.$setPristine();

          var removeIndex = $scope.discussion.scomments
          .map(function(item)
          { 
            return item._id;
          })
          .indexOf(commentId);

          $scope.discussion.scomments[removeIndex].post= editcomment;
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
      $scope.chat.scomments=[{ user: $rootScope.currentUser._id,
               username:$rootScope.currentUser.firstname,
               post: $scope.chat.comment               
             }];
      $scope.chat.cid=new Date().getTime();       
      $scope.chat.authormmi=$rootScope.currentUser._id;
      $http({ method: 'POST', url: '/api/discussions',data:$scope.chat }).
      success(function (data, status, headers, config) {
       // $location.path('/discussion-start').search('cid',$scope.chatid);
        $scope.forsubmit=0;
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

  // $scope.$on('socket:broadcast', function(event, data) {
    
  //   $log.debug('got a message', event.name);
  //   if (!data.payload) {
  //     $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
  //     return;
  //   }else{
  //     // save in db with 
  //     // userid:$rootScope.currentUser._id
  //     // data.payload

  //   }

  //   $scope.$apply(function() {
  //     $scope.messageLog = ew Date(), data.source, data.payload) + $scope.messageLog;
  //   });
  // });
}]);
