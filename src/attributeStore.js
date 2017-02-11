'use strict';
//const _ = require('lodash');

// constructor
function AttributeStore(attributes) {

    // always initialize all instance properties
    this._a = attributes;
}

// class methods
AttributeStore.prototype.getRepeat = function() {

    let response = { 
        speechOutput: this._a.speechOutput,
        reprompt: this._a.reprompt
    };

    return response;
};

AttributeStore.prototype.setRepeat = function(speechOutput, reprompt) {
    this._a.speechOutput = speechOutput;
    this._a.repromptSpeech = reprompt;
};

AttributeStore.prototype.clearRepeat = function() {
    this._a.speechOutput = ' ';
    this._a.repromptSpeech = ' ';
};

AttributeStore.prototype.get = function(key, defaultValue) {

    if (this._a[key] === undefined) {
        this._a[key] = defaultValue;
    }

    return this._a[key];
};

AttributeStore.prototype.set = function(key, value) {

    this._a[key] = value;
};


module.exports = AttributeStore
