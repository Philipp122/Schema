const toType = require('toType');

/**
 * Checks if 'obj' is a valid Schema, either a string defining the Datatype or and object containing the 'type' key
 * which is a string defining the Datatype
 * @param value {string || object}
 * @return {boolean}
 */
let isSchema = (value) => {
    switch (toType(value)) {
        case 'string':
            return true;
        case 'object':
            return toType(value['type']) === 'string';
        default:
            return false;
    }
};

module.exports = isSchema;