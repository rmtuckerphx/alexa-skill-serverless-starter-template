'use strict'

const config = require('../config/prod.skill.config');

//
// Check if configure has already been run. It can only be run once.
//
if (config.s3.bucketName === 'YOUR_BUCKET_NAME') {
    console.warn('You must run "npm run configure" to set placeholder values before you can deploy.');
     process.exit(1);
}
