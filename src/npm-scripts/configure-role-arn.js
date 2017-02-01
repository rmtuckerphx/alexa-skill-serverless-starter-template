'use strict';
const AWS = require('aws-sdk');
const sync = require('synchronize');
const npmRunScript = require('npm-run-script');
const argv = require('attrs.argv');

const stage = argv.stage;
const configFilename = stage + '.skill.config.json';
const configPath = '../config/' + configFilename;
const config = require(configPath);
const helper = require('./helper');

const skillNamespace = config.skillNamespace;
const region = config.region;
const roleName = helper.getRoleName(skillNamespace, stage, region);

if (config.roleArn != 'YOUR_ROLE_ARN') {
    console.log('The configure role ARN command can only be run once and it has already been run.');
    return;
}

sync.fiber(() => {
    const iam = new AWS.IAM({ apiVersion: '2010-05-08' });
    let role = null;

    let getRoleParams = {
        RoleName: roleName
    };

    try {
        console.log('Getting role ' + getRoleParams.RoleName + '...');
        role = sync.await(iam.getRole(getRoleParams, sync.defer()));  
        console.log(role);
    } catch (err) {
        console.error(err, err.stack)
        return;
    }

    if (role) {
        helper.modifyFiles(['./config/' + configFilename],
            [
                {
                    regexp: /YOUR_ROLE_ARN/g,
                    replacement: role.Role.Arn
                }
            ]);
    }

});
