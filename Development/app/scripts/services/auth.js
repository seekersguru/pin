'use strict';

angular.module('pinApp')
  .factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore, $window) {
    
    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {
      facebookLogin: function() {
        $window.location.href = '/api/session/facebook/?redirectPath='+($rootScope.redirectPath||'');
      },
      /**
       * Authenticate user
       * 
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;

        return Session.save({
          email: user.email,
          password: user.password
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Unauthenticate user
       * 
       * @param  {Function} callback - optional
       * @return {Promise}           
       */
      logout: function(callback) {
        var cb = callback || angular.noop;

        return Session.delete(function() {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      /**
        * 
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
 
      createUser: function(user, callback) {
        var cb = callback || angular.noop;
        return User.save(user,
          function(user) {
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      resetPassword: function(user) {
        return User.resetPassword(user).$promise;
      },
      resendEmailVerification: function(user) {
        return User.resendEmailVerification(user).$promise;
      },
      recoverPassword: function(user) {
        return User.recoverPassword({
          _id: user._id,
          newPassword: user.newPassword,
          token: user.token
        }).$promise;
      },

      /**
       * Change password
       * 
       * @param  {String}   oldPassword 
       * @param  {String}   newPassword 
       * @param  {Function} callback    - optional
       * @return {Promise}              
       */
      changePassword: function(_id, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({
          _id: _id,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       * 
       * @return {Object} user
       */
      currentUser: function() {
        return User.get();
      },

      /**
       * Simple check to see if a user is logged in
       * 
       * @return {Boolean}
       */
      isLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user;
      },
    };
  });
