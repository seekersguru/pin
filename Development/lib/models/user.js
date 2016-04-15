'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'];
mongoose.set('debug', true);

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  fullname: String,
  alias: String,
  address: {
    street:String,
    city:String,
    country: {type:String, default: 'India'}
  },
  username: { type: String,required:true,unique:true },
  email: { type: String,required:true,unique:true },
  phone:String,
  membertype:String,
  nominated:String,
  interests:[],
  interests1:String,
  interests11:String,
  interests2:String,
  interests3:String,
  interests4:String,
  band:Number,
  emailVerification: {
      token: String,
      verified : {type: Boolean, default:false},
      validTill: Date
  },
  forgotPassword: {
    token: String,
    validTill : Date
  },
  role: {type: String, default: 'expert', 'enum' : ['user','admin','expert']},
  adminrole:String,
  familyrole:{type: Schema.Types.ObjectId, ref:'Family'},
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
  following:[
  {
   user:{type: Schema.Types.ObjectId, ref:'User'},
   status:{type: Boolean, default:false},
   name:String
 }
 ],

  nFollowers:{type: Number, default: 0},
  showAge: {type:Boolean, default: false},
  dob:{type:Date, default: Date.now},
  lastLogin:{type:Date},
  status:{type: Boolean, default:false},
  searchable:{type: Boolean, default:true},
  commentvisible:{type: String, default: 'public', 'enum' : ['public','friends']},
  other:String,
  madebyadmin:{type: Boolean, default:false},
  superadmin : {type: Boolean, default:false}
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
      'username': this.username,
      'band': this.band,
      'superadmin':this.superadmin
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'createdAt':this.createdAt,
      'email': this.email,
      'role': this.role,
      'band': this.band,
      'emailVerification': this.emailVerification.verified,
      'username': this.username,
      'adminrole':this.adminrole,
      'familyrole':this.familyrole,
      'searchable':this.searchable,
      'commentvisible':this.commentvisible,
      'status':this.status,
      'city':this.address.city,
      'madebyadmin':this.madebyadmin,
      'lastLogin':this.lastLogin


        };
  });
// Public profile information
UserSchema
  .virtual('contentExpert')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'createdAt':this.createdAt,
      'email': this.email,
      'role': this.role,
      'username': this.username,
      'adminrole':this.adminrole,
      'searchable':this.searchable,
      'status':this.status,
      'madebyadmin':this.madebyadmin,
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
      'city': this.address.city,
      'country': this.address.country,
      'photo':this.photo,
      'username' : this.username,
      'favorites': this.favorites,
      'dob': this.dob,
      'createdAt':this.createdAt,
      'emailVerification': this.emailVerification,
      'email': this.email
    };
  });



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

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({username: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified username is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

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
