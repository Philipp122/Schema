const toType = require('@philipp122/totype');

/**
 * Checks recursively if a schema is valid. Always get's executed at the first iteration of validate()
 * @param schema {array | object}
 * @return {boolean}
 */
let isValidSchema = (schema) => {
    let ret = true;

    switch (toType(schema)) {
        case 'array':
            schema.forEach(element => {
                ret &= isValidSchema(element);
            });
            break;
        case 'object':
            if(toType(schema['type']) === 'string') {
                Object.keys(schema).forEach(key => {
                    switch (key) {
                        case 'type':
                            switch (schema[key]) {
                                case 'null':
                                case 'undefined':
                                case 'boolean':
                                case 'number':
                                case 'string':
                                case 'array':
                                case 'object':
                                    ret &= true;
                                    break;
                                default:
                                    ret &= false;
                            }
                            break;
                        case 'required':
                            ret &= toType(schema[key]) === 'boolean';
                            break;
                        case 'min':
                        case 'max':
                            ret &= toType(schema[key]) === 'number' && !isNaN(schema[key]);
                            break;
                        case 'match':
                            switch (toType(schema[key])) {
                                case 'null':
                                case 'undefined':
                                case 'boolean':
                                case 'number':
                                case 'string':
                                case 'array':
                                    ret &= true;
                                    break;
                                default:
                                    ret &= false;
                            }
                            break;
                        default:
                            ret &= false;
                    }
                });
            }
            else
                Object.keys(schema).forEach(key => {
                    ret &= isValidSchema(schema[key]);
                });
            break;
        default:
            return false;
    }

    return ret;
};

module.exports = isValidSchema;