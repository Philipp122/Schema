const {toType, isSchema, applyValidators} = require('./validators.js');

/**
 * Validates and object against a schema
 * @param obj {null || undefined || boolean || NaN || number || string || object || array}
 * @param schema {string || object}
 * @param ignoreErrors {boolean}
 * @return {boolean}
 * @throws ReferenceError
 */
let validate = (obj, schema, ignoreErrors = true) => {
    let bool = true;

    if(isSchema(schema) && toType(obj) !== 'object' && toType(obj) !== 'array') {
        bool &= applyValidators(obj, schema);
    }
    else if(toType(obj) === 'object' && toType(schema) === 'object' && !isSchema(schema)) {
        Object.keys(schema).forEach(value => {
            if(obj[value] !== undefined)
                bool &= validate(obj[value], schema[value], ignoreErrors);
            else
                if(!ignoreErrors)
                    return true;
                else
                    throw new ReferenceError(`Object-Schema mismatch!`);
        });
    }
    else if(toType(obj) === 'array' && toType(schema) === 'array' && !isSchema(schema)) {
        if(schema.length > 0) {
            obj.forEach(value => {
                bool &= validate(value, schema[0], ignoreErrors);
            });
        }
    }
    else
        if(!ignoreErrors)
            throw new ReferenceError(`Object-Schema mismatch!`);

    return bool;
};

module.exports = {toType, validate};