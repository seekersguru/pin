'use strict';

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    config = require('../config/config'),
    thumbd = require('thumbd'),
    URL = require('url');

/**
 * Get awesome things
 */
exports.uploadDone = function(req, res) {
  var url = req.query.url;
  var size = JSON.parse(req.query.size);
  var color = req.query.color;
  var client = new thumbd.Client({
    awsKey: config.AWS_ACCESS_KEY_ID,
    awsSecret: config.AWS_SECRET_ACCESS_KEY,
    sqsQueue: config.AWS_SQS_QUEUE,
    s3Bucket: config.AWS_S3_BUCKET,
    awsRegion: config.AWS_REGION
  });

  var allowed_extension = ['png','jpg'];
  var ext = URL.parse(url).path.split('.').pop();
  if (allowed_extension.indexOf(ext) === -1) {
    return res.send(403, 'Extension not supported');
  }
  var desc = [
    {
      'format': 'png',
      'suffix': 'fabric',
      'width': Math.round(size.width),
      'height': Math.round(size.height),
      'strategy': 'strict'
    },
    {
      'format': 'png',
      'suffix': 'big',
      'width': 600,
      'height': 600,
      'strategy': color?'matted':'bounded',
      'background': '"'+color+'"'
    },
    {
      'format': 'png',
      'suffix': 'main',
      'width': 300,
      'height': 300,
      'strategy': color?'matted':'fill',
      'background': '"'+color+'"'
    }
  ];
  console.log(desc);
  client.thumbnail(url, desc, function (err, result) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      res.json(result);
    }
  });
  
};
exports.signS3Url = function(req, res) {
  var aws_key = config.AWS_ACCESS_KEY_ID,
      aws_secret = config.AWS_SECRET_ACCESS_KEY,
      bucket = config.AWS_S3_BUCKET;

  var url = req.query.url;
  var parsed = URL.parse(url);
  var url_bucket = parsed.host.split('.')[0];
  var expires_mins = 5;
  var now = new Date();
  now.setMinutes(now.getMinutes() + expires_mins);
  var expiration = Math.floor(now.getTime()/1000);
  var sign_string = ['GET', '', '', expiration, '/'+url_bucket+parsed.path].join('\n');
  var signature = crypto.createHmac('sha1', aws_secret).update(sign_string).digest('base64');
  parsed.query = {'AWSAccessKeyId': aws_key, 'Expires': expiration, 'Signature': signature};
  console.log(parsed);
  console.log(parsed.format());
  return res.send(parsed.format());
  
};
exports.signUpload = function(req, res) {
  var aws_key = config.AWS_ACCESS_KEY_ID,
      aws_secret = config.AWS_SECRET_ACCESS_KEY,
      bucket = config.AWS_S3_BUCKET;
  if (!aws_key || !aws_secret || !bucket) {
    return res.send(403);
  }
  var expires_mins = 10;
  var now = new Date();
  var key = req.user._id + '/';
  now.setMinutes(now.getMinutes() + expires_mins);
  var expiration = (now.getUTCFullYear()) + "-" + (now.getUTCMonth() + 1) + "-" + (now.getUTCDate()) + "T" + (now.getUTCHours() + 1) + ":" + (now.getUTCMinutes()) + ":" + (now.getUTCSeconds()) + "Z";
  
  var policy =  { "expiration": expiration,
                  "conditions": [
                    ["starts-with", "$key", key],
                    {"acl": "private" },
                    {"bucket": bucket },
                    ["starts-with", "$Content-type", 'image/']
                  ]
                };
  var encoded_policy = (new Buffer(JSON.stringify(policy))).toString('base64');
  var signature = crypto.createHmac('sha1', aws_secret).update(encoded_policy).digest('base64');
  console.log(policy);
  console.log(encoded_policy);
  console.log(signature);
  return res.send({
    "acl": 'private',
    "key": key,
    "AWSAccessKeyId": aws_key,
    "policy": encoded_policy,
    "signature": signature,
    "bucket": bucket
    });
};
