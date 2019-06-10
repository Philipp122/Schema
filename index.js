const {toType, isSchema, applyValidators} = require('./validators.js');

/**
 * Validates and object against a schema
 * @param obj {null || undefined || boolean || NaN || number || string || object || array}
 * @param schema {string || object}
 * @return {boolean}
 */
let validate = (obj, schema) => {
    if(isSchema(schema) && toType(obj) !== 'object' && toType(obj) !== 'array') {
        return applyValidators(obj, schema);
    }

    return false;
};