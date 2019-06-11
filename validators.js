const {toType} = require('./utils');

// noinspection JSUnusedGlobalSymbols
/**
 * A list of validators. Can be expanded
 */
let validators = {
    /**
     * Checks if the type of 'value' equals the type specified in 'type'
     * @param value {string || number || boolean || null}
     * @param type {string}
     * @return {boolean}
     * @throws TypeError
     */
    type: (value, type) => {
        if(toType(type) === 'string')
            if(toType(value) === 'string' ||
                toType(value) === 'number' ||
                toType(value) === 'boolean' ||
                toType(value) === 'null')
                return toType(value) === type.toLowerCase();
            else
                throw new TypeError(`Parameter 'value' has to be of type 'string', 'number', 'boolean' or 'null' but is of type ${toType(type)}`);
        else
            throw new TypeError(`Parameter 'type' has to be of type 'string' but is of type ${toType(type)}`);
    },
    /**
     * Checks if 'value' is present, eg. is not null, "" or NaN
     * @param value {string || number || boolean || null}
     * @param req {boolean}
     * @return {boolean}
     * @throws TypeError
     */
    required: (value, req) => {
        if(toType(req) === 'boolean')
            if(toType(value) === 'string' ||
                toType(value) === 'number' ||
                toType(value) === 'boolean' ||
                toType(value) === 'null')
                if (req) {
                    return value != null && value !== "" && !Number.isNaN(value);
                } else {
                    return true;
                }
            else
                throw new TypeError(`Parameter 'value' has to be of type 'string', 'number', 'boolean' or 'null' but is of type ${toType(value)}`);
        else
            throw new TypeError(`Parameter 'req' has to be of type 'boolean' but is of type ${toType(req)}`);
    },
    /**
     * Checks if a number in 'value' is at least the number in 'req' or if the string in 'value' is at least 'req'
     * characters long
     * @param value {string || number}
     * @param req {number}
     * @return {boolean}
     * @throws TypeError
     */
    min: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'string' || toType(value) === 'number')
                if (toType(value) === 'string')
                    return value.length >= req;
                else if (toType(value) === 'number')
                    return value >= req;
                else
                    return false;
            else
                throw new TypeError(`Parameter 'value' has to be of type 'string', 'number', 'boolean`);
        else
            throw new TypeError(`Parameter 'req' has to be of type 'number' but is of type ${toType(req)}`);
    },
    /**
     * Checks if a number in 'value' is at max the number in 'req' or if the string in 'value' is at max 'req'
     * characters long
     * @param value {string || number}
     * @param req {number}
     * @return {boolean}
     * @throws TypeError
     */
    max: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'string' || toType(value) === 'number')
                if (toType(value) === 'string')
                    return value.length <= req;
                else if (toType(value) === 'number')
                    return value <= req;
                else
                    return false;
            else
                throw new TypeError(`Parameter 'value' has to be of type 'string', 'number', 'boolean`);
        else
            throw new TypeError(`Parameter 'req' has to be of type 'number' but is of type ${toType(req)}`);
    },
    /**
     * Checks if two values match each other or if 'value' is a string and 'req' is a RegExp check if the RegExp
     * matches the string
     * @param value {string || number}
     * @param req {number || string || string<RegExp>}
     * @return {boolean}
     * @throws TypeError
     */
    match: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'number')
                return value === req;
            else
                return false;
        else if(toType(req) === 'string') {
            if (req.match(/^\/.+\/[gmiyus]+$/m))
                return !value.match(new RegExp(req));

            if (toType(value) === 'string')
                return value === req;
            else
                return false;
        }
        else
            throw new TypeError(`Parameter 'req' has to be of type 'number', 'string' or 'regexp' but is of type ${toType(type)}`);

    }
};

/**
 * Applies the validators in schema to value
 * @param value {null || undefined || boolean || number || string}
 * @param schema {string || object}
 * @return {boolean}
 */
let applyValidators = (value, schema) => {
    let bool = true;
    let localValidators = {};

    if(toType(schema) === 'string')
        bool &= validators['type'](value, schema);
    else if(toType(schema) === 'object') {
        Object.keys(schema).forEach(val => {
            if(validators[val] !== undefined)
                localValidators[val] = validators[val];
            else
                throw new ReferenceError(`Validator ${value} not found!`);
        });

        Object.keys(localValidators).forEach(val => {
            bool &= localValidators[val](value, schema[val]);
        });
    }
    else
        throw new ReferenceError(`'schema' is neither a string nor an object but ${toType(schema)}`);

    return bool;
};

module.exports = applyValidators;