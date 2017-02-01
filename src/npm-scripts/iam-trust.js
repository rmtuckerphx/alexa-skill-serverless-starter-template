'use strict';
const AWS = require('aws-sdk');
const sync = require('synchronize');
const npmRunScript = require('npm-run-script');
const argv = require('attrs.argv');
const decode = require('urldecode')

const stage = argv.stage;
const configFilename = stage + '.skill.config.json';
const configPath = '../config/' + configFilename;
const config = require(configPath);
const helper = require('./helper');

const skillNamespace = config.skillNamespace;
const region = config.region;
const roleName = helper.getRoleName(skillNamespace, stage, region);
const userName = helper.getUserName(skillNamespace, stage);

const iam = new AWS.IAM({ apiVersion: '2010-05-08' });

sync.fiber(() => {
    let role = null;
    let user = null;


    let getUserParams = {
        UserName: userName
    };

    try {
        console.log('Getting user ' + getUserParams.UserName + '...');
        user = sync.await(iam.getUser(getUserParams, sync.defer()));
        console.log(user);
    } catch (err) {
        if (err && err.code === 'NoSuchEntity') {
            console.error('User does not exist. You must first execute: npm run iam');
            return;
        }
    }

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

    let assumeRoleParams = {
        RoleName: role.Role.RoleName
    };

    if (user && role) {
        console.log('Updating assume role policy for ' + role.Role.RoleName + '...');
        let policyDocument = decode(role.Role.AssumeRolePolicyDocument);
        let policy = JSON.parse(policyDocument);

        policy.Statement[0].Principal['AWS'] = user.User.Arn;

        assumeRoleParams.PolicyDocument = JSON.stringify(policy);

         console.log('Updated policy document', assumeRoleParams.PolicyDocument);

        try {
            let result = sync.await(iam.updateAssumeRolePolicy(assumeRoleParams, sync.defer()));
            console.log(result);
        } catch (err) {
            console.error(err, err.stack)
            return;
        }
    }
});