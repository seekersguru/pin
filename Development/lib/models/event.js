'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

/**
 * Event Schema
 */
var EventSchema = new Schema({
  title: {type:String, required:true},
  author: { type: ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  public: { type: Boolean, default: false },
  pin: { type: Boolean, default: true },
  money: { type: Boolean, default: true },
  hans: { type: Boolean, default: true },
  mainImage: String,
  discovered: { type: Boolean, default: false, index: true },
  agenda:{type:String, required:true},
  bannertext:{type:String,required:true},
  nFavorites:{ type:Number, default:0},
  expert:[  { user: { type: ObjectId, ref: 'Expert' },
               name:String,
               designation:String,
              flag:String
            }],
  registered:[{ type: ObjectId, ref: 'User' }],
  location:{
  address:String,
  customaddress:String,
  locality:String,
  sublocality:String,
  district:String,
  state:String,
  country:String,
  postalcode:String,
  lat:Number,
  lng:Number,
  zoom:Number
  },
  eventdate: Date,
  url:String,
  keywords: [String],
  category: String,
  metadescription:String,
  type: String,
  merchs: {},
  comments: [{ user: { type: ObjectId, ref: 'User' },
               username:String,
               post: String,
               posted: {type: Date, default: Date.now}
             }],
  media:{extension:String,
               name:String,
                path:String,
                originalName:String
      }
});

// Basic info to identify the current authenticated user in the app
EventSchema
  .virtual('eventInfo')
  .get(function() {
    return {
      '_id': this._id,
      'title': this.title,
      'author': this.author.name,
      // 'expert': this.expert.toString(),
      // 'comments':this.comments.length,
      'eventdate':this.eventdate,
      'category':this.category,
      'pin':this.pin,
      'money':this.money,
      'hans':this.hans,
      'approve':this.public
    };
  });

mongoose.model('Event', EventSchema);
