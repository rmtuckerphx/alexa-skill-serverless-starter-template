const config = require('../config/skill.config.json');
const npmRunScript = require('npm-run-script');

const command = 'aws s3 mb s3://' + config.s3.bucketName + '-dev' + '/ --profile devProfile && npm run deploy:dev:s3:cors';
// const command = 'aws s3 sync ./deploy-s3 s3://' + config.s3.bucketName + '-dev' + '/ --profile devProfile --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers';

const child = npmRunScript(command, { stdio: 'inherit' }); 
child.once('error', (error) => {
//   console.log(error);
  process.exit(1);
});
child.once('exit', (exitCode) => {
//   console.log('exit in', exitCode);
  process.exit(exitCode);
});