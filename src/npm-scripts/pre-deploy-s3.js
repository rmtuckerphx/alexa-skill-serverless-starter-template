const npmRunScript = require('npm-run-script');
const argv = require('attrs.argv');

const stage = argv.stage;
const configPath = '../config/' + stage + '.skill.config.json';
const config = require(configPath);
const helper = require('./helper');

const bucketName = config.s3.bucketName;
const skillNamespace = config.skillNamespace;
const profileName = helper.getProfileName(skillNamespace, stage);

const command = 'aws s3 mb s3://' + bucketName + '/ --profile ' + profileName + ' && node ./npm-scripts/deploy-s3-cors.js --stage=' + stage;

const child = npmRunScript(command, { stdio: 'inherit' }); 
child.once('error', (error) => { process.exit(1); });
child.once('exit', (exitCode) => { process.exit(exitCode); });