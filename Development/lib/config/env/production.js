'use strict';

module.exports = {
  env: 'production',
  emailTemplatesPath: '/views/mails',
  AWS_S3_BUCKET: 'paintcollar-artwork',
  AWS_SQS_QUEUE: 'artwork-thumb',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://localhost/paintcollar'
  }
};
