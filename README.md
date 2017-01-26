# Alexa Skill Serverless Starter Template
An Alexa Skill starter project template that uses the [Serverless Framework](https://github.com/serverless/serverless) and the [Alexa Skills Kit SDK for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs).

This template includes the following features:
- Creates IAM Users with permissions and local profiles for development and production stages
- Automates packaging of skill into a ZIP file and deployment to AWS Lambda
- Creates an S3 bucket, enables CORS, and uploads all files and folders placed in the `src/deploy-s3` folder
- Separate AWS Lambda and S3 deployments for development and production stages
- All skill configurations are in a separate file based on the stage and can be found in the `src/config` folder
    - `dev.skill.config.json` - development configuration; copied to `skill.config.json` before deployment to development Lambda
    - `prod.skill.config.json` - production configuration; copied to `skill.config.json` before deployment to production Lambda
- NPM scripts to allow easy deployment to Lambda and/or S3 for development and production stages
- All translatable text in the `translations.json` file automatically included in S3 deployment
- Content and translations can be added or changed in S3 without redeploying the Lambda function

The following are used in this template:
- Serverless Framework
- AWS
    - AWS CLI
    - Identity and Access Management (IAM)
    - Lambda
    - Simple Storage Service (S3)
    - DynamoDB (optional)

## First-Time-Only Setup
1. Create an Amazon Web Service account
2. Create a user instead of the AWS account root user: [Creating Your First IAM Admin User and Group](http://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) (save the .csv file locally)
2. Install AWS CLI: [Installing the AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)
3. Configure AWS locally: [Quick Configuration](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)
4. Install Serverless Framework

    ```bash
    $ npm install -g serverless 
    ```


## Quick Setup
Only 7 steps and no more than 7 minutes:

1. Clone project repository

    ```bash
    $ git clone https://github.com/rmtuckerphx/alexa-skill-serverless-starter-template.git myskill
    $ cd myskill/src
    $ npm install
    ```

2. Configure the project

    ```bash
    $ npm run configure
    ```

3. Create IAM Users

    ```bash
    $ npm run iam
    ```

4. Initial deploy to AWS Lambda & copy Lambda ARN

    ```bash
    $ npm run deploy:dev:sls
    ```

5. Add Skill at [Alexa Skills Kit website](https://developer.amazon.com/edw/home.html)

6. Copy Alexa Skill ID to config files

7. Deploy skill to AWS Lambda & S3

    ```bash
    $ npm run deploy:dev
    ```

## Detailed Setup
The above Quick Setup is explained in more detail in this section.

### Install AWS CLI
The AWS Command Line Interface is used during deployment to create an S3 bucket and copy to it content such as images, audio, and translations. 

Follow the AWS documentation at: [Installing the AWS Command Line Interface](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)


### Install Serverless Framework
**Install via npm:**
  ```bash
  $ npm install -g serverless
  ```

### Create a new project based on the Alexa Skill Serverless Starter Template
Clone this repo into a new project folder (ex: myskill).

```bash
$ git clone https://github.com/rmtuckerphx/alexa-skill-serverless-starter-template.git myskill
$ cd myskill
```

If you just want to start a new project without any commit history then use:

```bash
$ git clone --depth=1 https://github.com/rmtuckerphx/alexa-skill-serverless-starter-template.git myskill
$ cd myskill
```

### Get node dependencies
Navigate to the `src` folder of your skill:
```bash
$ cd src
$ npm install
```
### Configure Project Files
The following files have placeholders that need to be replaced before other commands can be executed:

| File |  Placeholder(s) |
|---|---|
| `src/translations.json` | YOUR_SKILL_NAME |
| `src/serverless.yml` | YOUR_NAMESPACE |
| `src/config/dev.skill.config.json` | YOUR_NAMESPACE  |
| `src/config/prod.skill.config.json` | YOUR_NAMESPACE  |

The meaning of these placeholders are:

| Placeholder |  Description |
|---|---|
| YOUR_SKILL_NAME | Required. The user friendly (and translatable) name of your skill that can be used in SSML or cards. |
| YOUR_NAMESPACE | Required. Your organization and skill name (ex: organization-skillname) that is used in creating the names for the service, profiles, users.

There are three ways you can update these placeholder values:
1. Manually open each file and replace the placeholder value with the actual value
2. Run `npm run configure` with no parameters. You will be prompted for values.
3. Run the configure command with parameters: 

```bash
npm run configure -- --skillName 'Fun Facts' --skillNamespace 'organization-skillname'
```
Note: Make sure to include the "--" after the word, configure.

### Create an AWS IAM Admin User
This step is not specifically required for setting up this project, but it is a best practice to protect your AWS root user.
If you have not already done so, follow the steps in [Creating Your First IAM Admin User and Group](http://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html) and use that user. 

To the **Administrators** (or whatever group your created) add the  **IAMFullAccess** permission so that the next step will work properly.

### Create IAM Users and Configure Local Profiles

```bash
$ npm run iam
```

Executing this command when the skillNamespace is 'organization-skillname' will:
1. Create the users:
    - 'organization-skillname-user-dev'
    - 'organization-skillname-user-prod'
2. Create access keys for each of the users
3. Assign the **AdministratorAccess** permission to each user
4. Create these local profiles with the correct access keys:
    - 'organization-skillname-profile-dev'
    - 'organization-skillname-profile-prod'

Executing this command, will add profiles to your local `.aws/credentials` file.

To list the contents of the .aws folder, execute the command:

**Linux, OS X, or Unit**
```bash
$ ls  ~/.aws
```
**Windows**
```bash
> dir %UserProfile%\.aws
```

The contents of the `credentials` file will look something like this:

```
[organization-skillname-profile-dev]
aws_access_key_id=AKIA...
aws_secret_access_key=g0N...

[organization-skillname-profile-prod]
aws_access_key_id=AKIA...
aws_secret_access_key=d+M...
```
For this example, the access key and secret have been truncated.

### Initial Deploy to AWS Lambda
The first deploy of the skill to AWS Lamba using the Serverless Framework creates the AWS Lambda ARN.

**Development**

```bash
$ npm run deploy:dev:sls
```

The output should look something like this:

```
> aws-alexa-skill@1.0.0 deploy:dev:sls E:\dev\alexa\alexa-skill-serverless-starter-template\src
> npm run copy:dev:config && serverless --stage=dev deploy


> aws-alexa-skill@1.0.0 copy:dev:config E:\dev\alexa\alexa-skill-serverless-starter-template\src
> cp ./config/dev.skill.config.json ./config/skill.config.json

Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading service .zip file to S3 (5.08 MB)...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.................
Serverless: Stack update finished...
Serverless: Removing old service versions...
Service Information
service: aws-node-alexa-skill
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  None
functions:
  aws-node-alexa-skill-dev-alexa-skill: arn:aws:lambda:us-east-1:012294443141:function:aws-node-alexa-skill-dev-alexa-skill
```
Copy the AWS Lambda ARN value in the last line of the output. It starts with "arn:" and continues to the end of the line.

This value will be used when you manually create the Alexa Skill in the next step. 


**Production**

Repeat by doing an inital production deploy to AWS Lambda to get the  AWS Lambda ARN value.

```bash
$ npm run deploy:prod:sls
```

### Create a Separate Alexa Skill for Development and Production
Navigate to the [Alexa Skills Kit website](https://developer.amazon.com/edw/home.html)

Follow the example shown [here](https://github.com/serverless/examples/tree/master/aws-node-alexa-skill#setup)

### Copy the Alexa Skill ID to Skill Configuration Files

At the top of the screen when creating a skill, there is a Skill ID. Copy that value to the corresponding skill configuration file:

#### Development
**config/dev.skill.config.json**
```json
{
    "skillAppID": "REPLACE WITH dev appID",
```

#### Production
**config/prod.skill.config.json**
```json
{
    "skillAppID": "REPLACE WITH prod appID",
```


### Deploying Files to S3
Any files and folders in the `src/deploy-s3` folder will be copied to an 
S3 bucket. If you have audio files to use in SSML or images for Home Cards
this is the place for them.

The value of the `s3.bucketName` key in the stage config file (`src/config/dev.skill.config.json` or `src/prod.config/skill.config.json`)
determines the name of the target bucket. The bucket name should be different for each stage. 

For example, using these config files:

**dev.skill.config.json**
```json
    "s3": {
        "bucketName": "organization-skillname-dev"
    }
```
**prod.skill.config.json**
```json
    "s3": {
        "bucketName": "organization-skillname"
    }
```

The bucket that will be created for each of the stages will be:

| Stage |  Bucket Name                  |
|-------|-------------------------------|
|  dev  | `organization-skillname-dev` |
|  prod | `organization-skillname`     |

The `translations.json` file is copied to the `src/deploy-s3` folder
before the folder is copied to the S3 bucket.

The deploy uses the contents of the `src/s3-cors.json` file to set the CORS
configuration for the bucket.


### Development Build - Deploy to AWS Lambda & S3

To deploy both skill to AWS Lambda and content to S3:

```bash
$ npm run deploy:dev
```

To deploy content to S3 only: `npm run deploy:dev:s3`

To deploy skill to AWS Lambda only: `npm run deploy:dev:sls`



### Production Build - Deploy to AWS Lambda & S3

To deploy both skill to AWS Lambda and content to S3: 

```bash
$ npm run deploy:prod
```

To deploy content to S3 only: `npm run deploy:prod:s3`

To deploy skill to AWS Lambda only: `npm run deploy:prod:sls`



### List of **npm run** scripts

| Script | Stage | Description |
|---|---|---|
| configure | dev & prod | run once before deployment to replace placeholders in files |
| iam | dev & prod | creates & configures IAM users for both dev and prod |
| iam:dev | dev | creates & configures an IAM user for dev |
| iam:prod | prod | creates & configures an IAM user for prod || deploy:dev | dev | runs all the deployment scripts including `serverless deploy` |
| copy:trans | dev & prod | copies `translations.json` to the `deploy-s3` folder before S3 is deployed |
| copy:dev:config | dev | copies `dev.skill.config.json` to `skill.config.json` before Lambda is deployed
| copy:prod:config | prod | copies `prod.skill.config.json` to `skill.config.json` before Lambda is deployed
| deploy:dev:sls | dev | runs `serverless deploy` which includes copying the correct stage config file, zipping up the skill and deploying to AWS Lambda |
| predeploy:dev:s3 | dev | creates the S3 bucket and sets its CORS configuration |
| deploy:dev:s3 | dev | runs all scripts needed to create the S3 bucket, set CORS configuration, and copy files and folders from the `src/deploy-s3` folder to the bucket in S3 |
| deploy:prod | prod | runs all the deployment scripts including `serverless deploy` |
| deploy:prod:sls | prod | runs `serverless deploy` which includes copying the correct stage config file, zipping up the skill and deploying to AWS Lambda |
| predeploy:prod:s3 | prod | creates the S3 bucket and sets its CORS configuration |
| deploy:prod:s3 | prod | runs all scripts needed to create the S3 bucket, set CORS configuration, and copy files and folders from the `src/deploy-s3` folder to the bucket in S3 |



