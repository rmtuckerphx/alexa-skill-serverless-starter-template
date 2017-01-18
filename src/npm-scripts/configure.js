'use strict'

const prompt = require('prompt');
const argv = require('attrs.argv');
const config = require('../config/prod.skill.config');
const fs = require('fs');

//
// Check if configure has already been run. It can only be run once.
//
if (config.s3.bucketName !== 'YOUR_BUCKET_NAME') {
    console.log('The configure command can only be run once and it has already been run.');
    return;
}

//
// set the overrides
//
prompt.override = argv;

//
// Start the prompt
//
prompt.start();

//
// Get the properties
//

const options = [
    {
        name: 'skillName',
        description: 'Skill Name',
        type: 'string',
        default: 'My Skill',
        required: true
    },
    {
        name: 's3BucketName',
        description: 'S3 Bucket Name',
        type: 'string',
        default: 'myCompany-mySkillName',
        required: true
    },
    {
        name: 'lambdaServiceName',
        description: 'Lambda Service Name',
        type: 'string',
        default: 'aws-node-alexa-skill',
        required: true
    },
    {
        name: 'dynamoDBTableName',
        description: 'Dynamo DB Table Name',
        type: 'string',
        default: 'mySkillUser',
        required: false
    },
]

prompt.get(options, function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  skillName: ' + result.skillName);
    console.log('  s3BucketName: ' + result.s3BucketName);
    console.log('  lambdaServiceName: ' + result.lambdaServiceName);
    console.log('  dynamoDBTableName: ' + result.dynamoDBTableName);

    //
    // Replace placeholders
    //
    modifyFiles(['../src/config/dev.skill.config.json', '../src/config/prod.skill.config.json', '../src/translations.json', '../src/serverless.yml'], [{
        regexp: /YOUR_SKILL_NAME/g,
        replacement: result.skillName
    }, {
        regexp: /YOUR_BUCKET_NAME/g,
        replacement: result.s3BucketName
    }, {
        regexp: /YOUR_SERVICE_NAME/g,
        replacement: result.lambdaServiceName
    }, {
        regexp: /YOUR_TABLE_NAME/g,
        replacement: result.dynamoDBTableName
    }]);
})

function modifyFiles(files, replacements) {
    files.forEach((file) => {
        let fileContentModified = fs.readFileSync(file, 'utf8')

        replacements.forEach((v) => {
            fileContentModified = fileContentModified.replace(v.regexp, v.replacement)
        })

        fs.writeFileSync(file, fileContentModified, 'utf8')
    })
}   
