const {toType} = require('./toType');

/**
 * Checks if 'obj' is a valid Schema, either a string defining the Datatype or and object containing the 'type' key
 * which is a string defining the Datatype
 * @param obj {string || object}
 * @return {boolean}
 */
let isSchema = (obj) => {
    if(toType(obj) === 'string')
        return true;
    else if(toType(obj) === 'object')
        return toType(obj['type']) === 'string';
    else
        return false;
};

module.exports = {isSchema};