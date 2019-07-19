const toType = require('@philipp122/totype');

/**
 * Checks if a recursive object contains a required value
 * @param schema {array | object}
 * @return {boolean}
 */
let isRequired = (schema) => {
    let bool = false;

    switch (toType(schema)) {
        case 'array':
            schema.forEach(element => {
                bool |= isRequired(element);
            });
            break;
        case 'object':
            if(toType(schema['type']) === 'string')
                if(toType(schema['required']) === 'boolean')
                    bool |= schema['required'];
                else
                    bool |= false;
            else
                Object.keys(schema).forEach(key => {
                    bool |= isRequired(schema[key]);
                });
            break;
        default:
            bool |= false;
    }

    return bool;
};

module.exports = isRequired;