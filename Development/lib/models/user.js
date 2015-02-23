'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  username: { type: String, default: null },
  email: String,
  emailVerification: {
      token: String,
      verified : {type: Boolean, default:false},
      validTill: Date
  },
  forgotPassword: {
    token: String,
    validTill : Date
  },
  role: {type: String, default: 'user', 'enum' : ['user', 'artist', 'admin']},
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  createdAt: {type:Date, default: Date.now},
  photo: String,
  bio: String,
  following:[{type: Schema.Types.ObjectId, ref:'User'}],
  nFollowers:{type: Number, default: 0},
  city:String,
  country: {type:String, default: 'India'},
  showAge: {type:Boolean, default: false},
  dob:{type:Date, default: Date.now},
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'role': this.role,
      'provider': this.provider,
      'following':this.following,
      'favorites':this.favorites,
      'username': this.username
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'bio': this.bio,
      'role': this.role,
      'city': this.city,
      'country': this.country,
      'photo':this.photo,
      'nFollowers': this.nFollowers,
      'username' : this.username
    };
  });

UserSchema
  .virtual('all')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'bio': this.bio,
      'role': this.role,
      'city': this.city,
      'country': this.country,
      'photo':this.photo,
      'nFollowers': this.nFollowers,
      'username' : this.username,
      'favorites': this.favorites,
      'dob': this.dob,
      'following':this.following,
      'createdAt':this.createdAt,
      'emailVerification': this.emailVerification,
      'email': this.email
    };
  });
    
/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

UserSchema
  .path('username')
  .validate(function(value, respond){
    if (value === null) {
      return respond(true);
    }
    var self = this;
    value = value.toLowerCase();
    var blocked = ['shop', 'login', 'signup', 'forgot', 'cart', 'checkout', 'faq', 'print', 'privacy', 'designing', 'tnc', 'admin', 'settings'];
    
    if(value.length > 16 || value.length < 3 || blocked.indexOf(value) !== -1 || value.indexOf('/') !== -1 || value.indexOf(' ') !== -1 || value.indexOf('@') !== -1){
      return respond(false);
    }
    
    this.constructor.findOne({username: value}, function(err, user){
      
      if(err) throw err;
      if(user){
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      
      respond(true);
      
    });
  }, 'This username is not available');

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.emailVerification || !this.emailVerification.verified) {
      this.emailVerification = this.generateNewEmailVerification();
    }
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },
  generateNewEmailVerification : function () {
    return {
      token: crypto.randomBytes(16).toString('hex'),
      verified : false,
      validTill: Date.now() + 24*3600*1000
    };
  },
  setForgotPassword : function () {
    if (!(this.forgotPassword && 
        this.forgotPassword.token &&
        this.forgotPassword.validTill > Date.now())) {
      this.forgotPassword =  {
        token: crypto.randomBytes(16).toString('hex'),
        validTill: Date.now() + 24*3600*1000
      };
    }
  }
};


module.exports = mongoose.model('User', UserSchema);
