const toType = require('@philipp122/totype');

/**
 * Checks if the Schema is correct or if there are errors
 * @param schema {string || array || object}
 * @return {boolean}
 */
let validateSchema = (schema) => {
    let bool = true;

    switch (toType(schema)) {
        case 'string':
            bool = true;
            break;
        case 'array':
            schema.forEach(element => {
                bool &= validateSchema(element);
            });
            break;
        case 'object':
            if(toType(schema['type']) === 'string')
                Object.keys(schema).forEach(key => {
                    switch (key) {
                        case 'type':
                            bool &= toType(schema['type']) === 'string';
                            break;
                        case 'required':
                            bool &= toType(schema['required']) === 'boolean';
                            break;
                        case 'min':
                            bool &= toType(schema['min']) === 'number';
                            break;
                        case 'max':
                            bool &= toType(schema['max']) === 'number';
                            break;
                        case 'match':
                            bool &= (toType(schema['match']) === 'boolean') ||
                                (toType(schema['match']) === 'number') ||
                                (toType(schema['match']) === 'string') ||
                                (toType(schema['match']) === 'regexp');
                            break;
                        default:
                            bool = false;
                    }
                });
            else
                Object.keys(schema).forEach(key => {
                    bool &= validateSchema(schema[key]);
                });

            break;
        default:
            bool = false;
    }

    return bool;
};

module.exports = validateSchema;