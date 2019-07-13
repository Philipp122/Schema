const toType = require('./toType');
const {triplet} = require('./tuplets');
const isSchema = require('./isSchema');

let isRequired = (schema) => {
    if(isSchema(schema)) {
        if(toType(schema) === 'object')
            if(toType(schema['required']) === 'boolean')
                return schema['required'];
            else
                return new triplet('isRequired', '[required]', `required has to be of type 'boolean' but is of type ${toType(schema['required'])}`);
        else
            return false;
    }

    let bool = false;
    let errors = [];

    switch (toType(schema)) {
        case 'object':
            Object.keys(schema).forEach(key => {
                let ret = isRequired(schema[key]);

                if(toType(ret) === 'array')
                    ret.forEach(error => {
                        error.second = `${key}:${error.second}`;
                        errors.push(error);
                    });
                else if(ret instanceof triplet) {
                    ret.second = `${key}:${ret.second}`;
                    errors.push(ret.second);
                }
                else
                    bool |= isRequired(schema[key]);
            });

            if(errors.length > 0)
                return errors;
            else
                return !!bool;
        case 'array':
            if(!(schema.length > 0))
                throw new ReferenceError(`array has to contain at least one element`);

            schema.forEach(element, index => {
                let ret = isRequired(element);

                if(toType(ret) === 'array')
                    ret.forEach(error => {
                        error.second = `${key}:${error.second}`;
                        errors.push(error);
                    });
                else if(ret instanceof triplet) {
                    ret.second = `${index}:${ret.second}`;
                    errors.push(ret.second);
                }
                else
                    bool |= isRequired(schema[key]);
            });

            if(errors.length > 0)
                return errors;
            else
                return !!bool;
        default:
            return [new triplet('isRequired', 'TypeError', `object expected to be 'string', 'object' or 'array', got ${toType(schema)} instead!`)];
    }
};

module.exports = isRequired;