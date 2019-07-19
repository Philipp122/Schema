const toType = require('@philipp122/totype');
const validators = require('./validators');

/**
 * Applies the validators in schema to value
 * @param object {null | undefined | boolean | number | string | array | object}
 * @param schema {object}
 * @return {boolean}
 */
let applyValidators = (object, schema) => {
    if (toType(schema) === 'object') {
        let bool = true;
        Object.keys(schema).forEach(key => {
            switch (key) {
                case 'type':
                    bool &= validators.type(object, schema[key]);
                    break;
                case 'required':
                    bool &= validators.required(object, schema[key]);
                    break;
                case 'min':
                    bool &= validators.min(object, schema[key]);
                    break;
                case 'max':
                    bool &= validators.max(object, schema[key]);
                    break;
                case 'match':
                    bool &= validators.match(object, schema[key]);
                    break;
                default:
                    return false;
            }
        });
        return bool;
    }
    else
        return false;
};

module.exports = applyValidators;