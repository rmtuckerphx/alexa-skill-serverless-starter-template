'use strict';

const Alexa = require('alexa-sdk');
const Config = require('./config/skill.config');
const Translations = require('./translations');

module.exports.handler = (event, context, callback) => {

    console.log(JSON.stringify(event, null, '  '));

    // used for testing and debugging only; not a real request parameter
    //let useLocalTranslations = event.request.useLocalTranslations || false;
    let useLocalTranslations = true;

    // get translation resources from translations.json which could be:
    // 1) json file deployed with lambda function
    // 2) json file deployed to s3 bucket
    // 3) one of the above cached in memory with this instance of the lambda function
    Translations.getResources(useLocalTranslations)
        .then(function (data) {

            console.log('main: Alexa.handler');
            const alexa = Alexa.handler(event, context);            
            alexa.appId = Config.skillAppID;

            console.log('main: alexa.dynamoDBTableName');
            alexa.dynamoDBTableName = Config.dynamoDBTableName;

            console.log('main: alexa.resources');
            alexa.resources = data; 

            console.log('main: alexa.registerHandlers');
            alexa.registerHandlers(
                require("./handlers/defaultHandlers"),
                require("./handlers/factHandlers")
            );

            console.log('main: before alexa.execute');
            alexa.execute();
            console.log('main: after alexa.execute');
            
        })
        .catch(function (err) {

            console.log(err.message);
            callback(err.message, null);
        });
};