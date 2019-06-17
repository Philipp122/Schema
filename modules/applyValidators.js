const {toType} = require('./toType');
const {validators} = require('./validators');

/**
 * Applies the validators in schema to value
 * @param value {null || undefined || boolean || number || string}
 * @param schema {string || object}
 * @return {boolean || array}
 */
let applyValidators = (value, schema) => {
    if(toType(schema) === 'string') {
        let res = validators['type'](value, schema);

        if(toType(res) === 'string') {
            return [res];
        } else
            return res;
    }
    else if (toType(schema) === 'object') {
        let bool = true;
        let localValidators = {};
        let errors = [];

        Object.keys(schema).forEach(val => {
            if(toType(validators[val]) === 'function')
                localValidators[val] = validators[val];
            else
                errors.push(`Validator ${val} not found!`);
        });

        Object.keys(localValidators).forEach(val => {
            let res = localValidators[val](value, schema[val]);

            if(toType(res) === 'string')
                errors.push(res);
            else
                bool &= res;
        });

        if(errors.length > 0)
            return errors;
        else
            return bool;
    }
    else
        return [`'schema' is neither of type 'string' nor of type 'object' but of type '${toType(schema)}'`];
};

module.exports = {applyValidators};