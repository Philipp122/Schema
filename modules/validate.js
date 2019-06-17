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
    if(isSchema(schema) && toType(obj) !== 'object' && toType(obj) !== 'array') {
        return applyValidators(obj, schema);
    }
    else if(toType(obj) === 'object' && toType(schema) === 'object' && !isSchema(schema)) {
        let errors = [];
        let bool = true;

        Object.keys(schema).forEach(value => {
            let res;

            if(obj[value] !== undefined) {
                res = validate(obj[value], schema[value]);

                if(toType(res) === 'array')
                    res.forEach(error => {
                        errors.push(value + ': ' + error);
                    });
                else
                    bool &= res;
            }
            else
                errors.push(value + ': ' + `Object-Schema mismatch!`);
        });

        if(errors.length > 0)
            return errors;
        else
            return bool;
    }
    else if(toType(obj) === 'array' && toType(schema) === 'array' && !isSchema(schema)) {
        let errors = [];
        let bool = true;

        if(schema.length > 0) {
            obj.forEach((value, index) => {
                let res = validate(value, schema[0]);

                if(toType(res) === 'array')
                    res.forEach(error => {
                        errors.push(index + ': ' + error);
                    });
                else
                    bool &= res;
            });
        }
        else
            errors.push('Schema-Array empty!');

        if(errors.length > 0)
            return errors;
        else
            return bool;
    }
    else {
        return [`Element is not a schema nor of type 'object' or of type 'string'!`];
    }
};

module.exports = {validate};