const {applyValidators} = require('./applyValidators');
const {toType} = require('./toType');
const {isSchema} = require('./isSchema');

/**
 * Validates and object against a schema
 * @param obj {null || undefined || boolean || NaN || number || string || object || array}
 * @param schema {string || object}
 * @return {boolean || array}
 */
let validate = (obj, schema) => {
    switch(toType(schema)) {
        case 'string':
            return applyValidators(obj, schema);
        case 'object':
            if(isSchema(schema))
                return applyValidators(obj, schema);
            else if(toType(obj) === 'object') {
                let errors = [];
                let bool = true;

                Object.keys(schema).forEach(value => {
                    let res;

                    if(obj[value] !== undefined)
                        res = validate(obj[value], schema[value]);
                    else
                        errors.push(`${value}:Validator | Element missing in Object!`);

                    if(toType(res) === 'array')
                        res.forEach(error => errors.push(`${value}:${error}`));
                    else
                        bool &= res;
                });

                if(errors.length > 0)
                    return errors;
                else
                    return !!bool;
            }
            else
                return [`Validate | 'schema' is an 'object' but 'obj' is neither a value nor another 'object'`];
        case 'array':
            if(toType(obj) === 'array') {
                let errors = [];
                let bool = true;

                if(schema.length > 0) {
                    obj.forEach((value, index) => {
                        let res = validate(value, schema[0]);

                        if(toType(res) === 'array')
                            res.forEach(error => errors.push(`[${index}]: ${error}`));
                        else
                            bool &= res;
                    });
                }
                else
                    errors.push('Validator | Schema-Array empty!');

                if(errors.length > 0)
                    return errors;
                else
                    return !!bool;
            }
            else
                return [`Validate | 'schema' is an array but 'obj' is not!`];
        default:
            return [`Validate | 'schema' has to be a 'string' an 'object' or an 'array'`];
    }
};

module.exports = {validate};