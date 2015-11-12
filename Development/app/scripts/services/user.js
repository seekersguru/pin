'use strict';

angular.module('pinApp')
  .factory('User', ['$resource',function ($resource) {
    return $resource('/api/users/:id', {id: '@_id'}, 
    { //parameters default
      update: {
        method: 'PUT',
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      query:{
        method: 'GET',
        params: ''
      },
      changePassword: {
        method: 'PUT',
        url: '/api/users/:id/password'
      },
      resetPassword : {
        method: 'POST',
        url: '/api/users/forgot'
      },
      recoverPassword : {
        method: 'POST',
        url : '/api/users/:id/recover'
      },
      resendEmailVerification : {
        method: 'POST',
        url : '/api/users/resend'
      },
      
      sales:{
        method: 'GET',
        url: '/api/users/:id/sales'
      },
      
      all:{
        method: 'GET',
        url: '/api/users/sales/all'
      },
      checkUsername:{
        method:'GET',
        url: '/api/users/checkusername/:username'

      },
      
	});
  }]);
