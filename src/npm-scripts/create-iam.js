'use strict';
const AWS = require('aws-sdk');
const argv = require('attrs.argv');
const npmRunScript = require('npm-run-script');
const sync = require('synchronize');
const helper = require('./helper');

const stage = argv.stage;
const configPath = '../config/' + stage + '.skill.config.json';
const config = require(configPath);
const skillNamespace = config.skillNamespace;
const profileName = helper.getProfileName(skillNamespace, stage);
const userName = helper.getUserName(skillNamespace, stage);

const iam = new AWS.IAM({ apiVersion: '2010-05-08' });



sync.fiber(() => {

    let isCreateUser = false;
    let user = null;
    let accessKey = null;

    let params = {
        UserName: userName
    };


    try {
        console.log('Getting user ' + params.UserName + '...');
        user = sync.await(iam.getUser(params, sync.defer()));
        console.log(user);
    } catch (err) {
        if (err && err.code === 'NoSuchEntity') { 
            console.log('User does not exist.');
            isCreateUser = true; 
        }
    }

    if (isCreateUser) {
        try {
            console.log('Creating user ' + params.UserName + '...');
            user = sync.await(iam.createUser(params, sync.defer()));
            console.log(user);
        } catch (err) {
            console.error(err)
            return;
        }
    }

    if (user) {
        try {
            console.log('Creating access keys for user ' + user.User.UserName + '...');       
            accessKey = sync.await(iam.createAccessKey(params, sync.defer()));
            console.log(accessKey);
        } catch (err) {
            console.error(err)
            return;
        }
    }

    if (user) {
        try {

            let attachParams = {
                    PolicyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
                    UserName: userName
                };
            console.log('Attaching policy to user ' + user.User.UserName + '...');       
            let result = sync.await(iam.attachUserPolicy(attachParams, sync.defer()));
            console.log('Policy attached');
            console.log(result);
        } catch (err) {
            console.error(err)
            return;
        }
    }

    if (accessKey) {
        console.log('Configuring credentials for user ' + accessKey.AccessKey.UserName + '...');       

        const command = "serverless config credentials --provider aws --key '" + accessKey.AccessKey.AccessKeyId + "' --secret '" + accessKey.AccessKey.SecretAccessKey + "' --profile " + profileName;

        const child = npmRunScript(command, { stdio: 'inherit' });
        child.once('error', (error) => { process.exit(1); });
        child.once('exit', (exitCode) => { process.exit(exitCode); });
    }
});
