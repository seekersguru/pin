'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  emailTemplatesPath: '/app/views/mails',
  port: process.env.PORT || 3000,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: 'ap-southeast-1',
  AWS_S3_BUCKET: 'paintcollar-artwork-dev',
  AWS_SQS_QUEUE: 'artwork-thumb-dev',
  CITRUS_VANITY: process.env.CITRUS_VANITY,
  CITRUS_BASE_URL: process.env.CITRUS_BASE_URL,
  CITRUS_ACCESS_KEY_ID: process.env.CITRUS_ACCESS_KEY_ID,
  CITRUS_SECRET_ACCESS_KEY: process.env.CITRUS_SECRET_ACCESS_KEY,
  CCAVENUE_MID:process.env.CCAVENUE_MID,
  CCAVENUE_ACCESS_CODE:process.env.CCAVENUE_ACCESS_CODE,
  CCAVENUE_SECRET_ACCESS_KEY: process.env.CCAVENUE_SECRET_ACCESS_KEY,

  PRERENDER_IO_TOKEN: process.env.PRERENDER_IO_TOKEN || '5RHnElJSZyz7UiuzjKML',
  facebook: {
    id: process.env.FB_APP_ID,
    secret: process.env.FB_APP_SECRET
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};
