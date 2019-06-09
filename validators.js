/**
 * Return the true Datatype of a value
 * @param obj
 * @return {string}
 */
let toType = (obj) => {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

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
     * TODO: Implement RegExp check
     * Checks if two values match each other or if 'value' is a string and 'req' is a RegExp check if the RegExp
     * matches the string
     * @param value {string || number}
     * @param req {number || string || RegExp}
     * @return {boolean}
     * @throws TypeError
     */
    match: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'number')
                return value === req;
            else
                throw new TypeError(`Parameter value has to be of type 'number'`);
        else if(toType(req) === 'string')
            if(toType(value) === 'string')
                return value === req;
            else
                throw new TypeError(`Parameter 'req' has to be of type 'string'`);
        else
            throw new TypeError(`Parameter 'req' has to be of type 'number', 'string' or 'regexp' but is of type ${toType(type)}`);

    }
};

module.exports = {toType, validators};