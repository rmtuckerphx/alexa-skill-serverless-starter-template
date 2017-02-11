'use strict';
//const _ = require('lodash');
const util = require('./util');

// constructor
function FactService(translations) {

    // always initialize all instance properties
    this._t = translations;
}

// class methods
FactService.prototype.getFactByIndex = function(index, isNewSession) {

    let list = this._t('facts');
    let item = list[index];
    let reprompt = ' ';

    if (!isNewSession) {
        reprompt = ' <break time=\"500ms\"/> ' + _.sample(this._t('reprompts'));
    }

    let title = this._t('getFact.title', index + 1);
    let speechOutput = title + ': ' + item + reprompt;
    let cardContent = util.replaceTags(item);

    let response = { 
        speechOutput: speechOutput,
        reprompt: reprompt,
        cardTitle: title,
        cardContent: cardContent
    };

    return response;
};


FactService.prototype.getFactNotFound = function(index, isNewSession) {

    let reprompt = ' ';

    if (!isNewSession) {
        reprompt = ' <break time=\"500ms\"/> ' + _.sample(this._t('reprompts'));
    }
    let speechOutput = this.t('getFact.invalidIndex', index + 1, this._t('facts').length) + ' ' + reprompt;


    let response = { 
        speechOutput: speechOutput,
        reprompt: reprompt
    };

    return response;
};


// MainService.prototype.getUnhandled = function() {

//     let trans = this._t('unhandled');

//     let response = { 
//         speechOutput: trans.speechOutput,
//         reprompt: trans.reprompt
//     };

//     return response;
// };

// MainService.prototype.getGoodbye = function() {

//     let trans = this._t('goodbye');

//     let response = { 
//         speechOutput: trans.speechOutput
//     };

//     return response;
// };

// MainService.prototype.getHelp = function() {

//     let sampleCommands = this._t('sampleCommands');
//     let text = _.sampleSize(sampleCommands, 4).join(' ');       
//     let speechOutput = this._t('help.speechOutput', text);
//     let reprompt = this._t('help.reprompt');    

//     let response = { 
//         speechOutput: speechOutput,
//         reprompt: reprompt
//     };

//     return response;
// };

module.exports = FactService
