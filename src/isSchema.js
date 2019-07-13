const toType = require('@philipp122/totype');

/**
 *
 * @param schema {string || array || object}
 * @return {boolean}
 */
let isSchema = (schema) => {
    switch (toType(schema)) {
        case 'string':
            return true;
        case 'object':
            return toType(schema['type']) === 'string';
        default:
            return false;
    }
};

module.exports = isSchema;