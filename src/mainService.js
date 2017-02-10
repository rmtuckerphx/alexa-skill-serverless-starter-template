'use strict';
const _ = require('lodash');

// constructor
function MainService(translations) {

    // always initialize all instance properties
    this._t = translations;
}

// class methods
MainService.prototype.getWelcome = function() {

    let trans = this._t('welcome', this._t('skill.name'));

    let response = { 
        speechOutput: trans.speechOutput,
        reprompt: trans.reprompt
    };

    return response;
};

MainService.prototype.getUnhandled = function() {

    let trans = this._t('unhandled');

    let response = { 
        speechOutput: trans.speechOutput,
        reprompt: trans.reprompt
    };

    return response;
};

MainService.prototype.getGoodbye = function() {

    let trans = this._t('goodbye');

    let response = { 
        speechOutput: trans.speechOutput
    };

    return response;
};

MainService.prototype.getHelp = function() {

    let sampleCommands = this._t('sampleCommands');
    let text = _.sampleSize(sampleCommands, 4).join(' ');       
    let speechOutput = this._t('help.speechOutput', text);
    let reprompt = this._t('help.reprompt');    

    let response = { 
        speechOutput: speechOutput,
        reprompt: reprompt
    };

    return response;
};

module.exports = MainService
