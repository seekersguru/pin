'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('Serviceuser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    LinkedinStrategy = require('passport-linkedin').Strategy,
    config = require('./config');

/**
 * Passport configuration
 */
   // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});



// add other strategies for more authentication flexibility
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({email: email},
       function(err, user) {
      if (err) return done(err);
        if (!user) {
        return done(null, false, {
          message : {
            message: 'This email is not registered',
            type: 'not_found',
            field: 'email'
          }
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: {
            message: 'This password is not correct',
            type: 'incorrect_password',
            field: 'password'
          }
        });
      }
      if (!user.emailVerification.verified) {
        return done(null, false, {
          message: {
            message: 'Email not verified',
            type: 'not_verified',
            field: 'email'
          }
        });
      }
      if (!user.status) {
        return done(null, false, {
          message: {
            message: 'Admin has not approved you.Please wait some time until admin approve you.',
            type: 'not_verified',
            field: 'password'
          }
        });
      }
     return done(null, user);
    });
  }
));

passport.use('admin-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) return done(err);
      
      if (!user) {
        return done(null, false, {
          message : {
            message: 'This email is not registered',
            type: 'not_found',
            field: 'email'
          }
        });
      }

      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
  clientID: config.facebook.id,
  clientSecret: config.facebook.secret
}, function(accessToken, refreshToken, profile, done) {
  profile = profile._json;
  var photo_url = '//graph.facebook.com/'+profile.username+'/picture?height=200&width=200';
  console.log('Profile');
  return User.findOne({
    'email': profile.email
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      user = new User({
        name: profile.first_name + ' ' + profile.last_name,
        email: profile.email,
        provider: 'facebook',
        facebook: profile,
        photo: photo_url
      });
      console.log('New');
      user.save(function(err) {
        if (err) done(err);
        console.log('Saved');
        return done(err, user);
      });
    } else if (user.facebook) {
      console.log('OldWithFacebook');
      return done(null, user);
    } else {
      console.log('Old');
      user.facebook = profile;
      user.photo = user.photo || photo_url;
      if (!user.emailVerification.verified) {
        user.username = null;
      }
      return user.save(function(err, saved_user) {
        if (err) done(err);
        console.log('Updated');
        return done(null, saved_user);
      });
    }
  });
}));


passport.use(new LinkedinStrategy({
    consumerKey: config.linkedin.key,
    consumerSecret:config.linkedin.secretkey,
    profileFields: ['id', 'first-name', 'last-name', 'email-address','public-profile-url','picture-url']
  
    // callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    console.log(token);
    console.log(tokenSecret);

    // User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
profile = profile._json;
  var photo_url =profile.pictureUrl;
  console.log('Profile');
  return User.findOne({
    'email': profile.emailAddress
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      user = new User({
        firstname: profile.firstName,
        lastname: profile.lastName,
        email: profile.emailAddress,
        provider: 'linkedin',
        linkedin: profile,
        photo: photo_url,
        username:profile.firstName,
        password:token
      });
      console.log('New');
      user.save(function(err) {
        if (err) done(err);
        console.log('Saved');
        return done(err, user);
      });
    } else if (user.linkedin) {
      console.log('OldWithLinkedin');
      return done(null, user);
    } else {
      console.log('Old');
      user.linkedin = profile;
      user.photo = user.photo || photo_url;
      if (!user.emailVerification.verified) {
        user.username = null;
      }
      return user.save(function(err, saved_user) {
        if (err) done(err);
        console.log('Updated');
        return done(null, saved_user);
      });
    }
  });


  }
));

module.exports = passport;
