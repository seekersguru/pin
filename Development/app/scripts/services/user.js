'use strict';

angular.module('pinApp')
  .factory('User', function ($resource) {
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
  });



angular.module('pinApp')
  .factory('MMIUser', function ($resource) {
    return $resource('/api/mmiusers/:id', {id: '@_id'}, 
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
        url: '/api/mmiusers/:id/password'
      },
      resetPassword : {
        method: 'POST',
        url: '/api/mmiusers/forgot'
      },
      recoverPassword : {
        method: 'POST',
        url : '/api/mmiusers/:id/recover'
      },
      resendEmailVerification : {
        method: 'POST',
        url : '/api/mmiusers/resend'
      },
      
      sales:{
        method: 'GET',
        url: '/api/mmiusers/:id/sales'
      },
      
      all:{
        method: 'GET',
        url: '/api/mmiusers/sales/all'
      },
      checkUsername:{
        method:'GET',
        url: '/api/mmiusers/checkusername/:username'

      },
      
  });
  });
