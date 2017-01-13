const config = require('../config/skill.config.json');
const npmRunScript = require('npm-run-script');

const command = 'echo ' + config.s3.bucketName;

const child = npmRunScript(command, { stdio: 'inherit' }); 
child.once('error', (error) => {
//   console.log(error);
  process.exit(1);
});
child.once('exit', (exitCode) => {
//   console.log('exit in', exitCode);
  process.exit(exitCode);
});