'use strict'

const prompt = require('prompt');
const argv = require('attrs.argv');
const config = require('../config/prod.skill.config');
const fs = require('fs');

//
// Check if configure has already been run. It can only be run once.
//
if (config.skillNamespace != 'YOUR_NAMESPACE') {
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
        name: 'skillNamespace',
        description: 'Skill Namespace',
        type: 'string',
        default: 'organization-skillname',
        required: true
    },
    {
        name: 'region',
        description: 'Region',
        type: 'string',
        default: 'us-east-1',
        required: true
    }    
]

prompt.get(options, function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  skillName: ' + result.skillName);
    console.log('  skillNamespace: ' + result.skillNamespace);
    console.log('  region: ' + result.region);

    //
    // Replace placeholders
    //
    modifyFiles(['../src/config/dev.skill.config.json', '../src/config/prod.skill.config.json', '../src/translations.json', '../src/serverless.yml', '../src/package.json'], 
    [
    {
        regexp: /YOUR_SKILL_NAME/g,
        replacement: result.skillName
    }, 
    {
        regexp: /YOUR_NAMESPACE/g,
        replacement: result.skillNamespace
    },
    {
        regexp: /YOUR_REGION/g,
        replacement: result.region
    }    
    ]);
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
