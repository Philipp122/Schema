const toType = require('@philipp122/totype');
const chunk = require('lodash.chunk');

const isValidSchema = require('./isValidSchema');
const isRequired = require('./isRequired');
const applyValidators = require('./applyValidators');

/**
 * Validates and object against a schema
 * @param object {null | undefined | boolean | number | string | array | object}
 * @param schema {array | object}
 * @param iter {boolean}
 * @return {boolean}
 */
let validate = (object, schema, iter = true) => {
    if(iter)
        if(!isValidSchema(schema))
            return false;

    let bool = true;

    switch (toType(schema)) {
        case 'array':
            if(toType(object) !== 'array')
                return false;

            let groups = chunk(object, schema.length);

            groups.forEach(group => {
                group.forEach((element, index) => {
                    if(!validate(element, schema[index], false))
                        bool &= !isRequired(schema[index]);
                    else
                        bool &= true;
                });
            });

            break;
        case 'object':
            if(toType(schema['type']) === 'string')
                bool &= applyValidators(object, schema);
            else {
                if (toType(object) !== 'object')
                    return false;

                Object.keys(schema).forEach(key => {
                    if(!validate(object[key], schema[key], false))
                        bool &= !isRequired(schema[key]);
                    else
                        bool &= true;
                });
            }

            break;
        default:
            return false;
    }

    return bool;
};

module.exports = validate;