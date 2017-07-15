'use strict';

const BitArray = require('node-bitarray');

module.exports = (function () {
    return {

        getArrayOfIndexes: function (size, bitArrayHexString) {

            let bits = BitArray.fromHex(bitArrayHexString);
            let arrayOfIndexes = [];

            for (var index = 0; index < bits.length; index++) {
                if (bits.get(index) === 1) {
                   arrayOfIndexes.push(index);
                }                
            }

            return arrayOfIndexes;
        },

        toHexString: function (size, arrayOfIndexes) {

            let bits = new BitArray().fill(size);

            arrayOfIndexes.forEach( (element) => {
               bits.set(element, 1);
            });

            return bits.toHex();
        }        
    };
})();
