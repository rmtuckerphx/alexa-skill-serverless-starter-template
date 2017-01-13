const npmRunScript = require('npm-run-script');
const argv = require('attrs.argv');

const stage = argv.stage;
const configPath = '../config/' + stage + '.skill.config.json';
const config = require(configPath);

const bucketName = config.s3.bucketName;
const profile = stage + 'Profile'; // devProfile or prodProfile

const command = 'aws s3api put-bucket-cors --bucket ' + bucketName + ' --cors-configuration file://s3-cors.json --profile ' + profile;

const child = npmRunScript(command, { stdio: 'inherit' }); 
child.once('error', (error) => {
  process.exit(1);
});
child.once('exit', (exitCode) => {
  process.exit(exitCode);
});