const {toType} = require('./toType');

// noinspection JSUnusedGlobalSymbols
/**
 * A list of validators. Can be expanded
 */
let validators = {
    /**
     * Checks if the type of 'value' equals the type specified in 'type'
     * @param value {string || number || boolean || null}
     * @param type {string}
     * @return {boolean || string}
     */
    type: (value, type) => {
        if(toType(type) === 'string')
            if(toType(value) === 'string' ||
                toType(value) === 'number' ||
                toType(value) === 'boolean' ||
                toType(value) === 'null')
                return toType(value) === type.toLowerCase();
            else
                return `[type] Parameter 'value' has to be of type 'string', 'number', 'boolean' or 'null' but is of type '${toType(value)}'`;
        else
            return `[type] Parameter 'type' has to be of type 'string' but is of type '${toType(type)}'`;
    },
    /**
     * Checks if 'value' is present, eg. is not null, "" or NaN
     * @param value {string || number || boolean || null}
     * @param req {boolean}
     * @return {boolean || string}
     */
    required: (value, req) => {
        if(toType(req) === 'boolean')
            if(toType(value) === 'string' ||
                toType(value) === 'number' ||
                toType(value) === 'boolean' ||
                toType(value) === 'null')
                    return toType(value) !== 'null' && value !== '' && !Number.isNaN(value);
            else
                return `[required] Parameter 'value' has to be of type 'string', 'number', 'boolean' or 'null' but is of type '${toType(value)}'`;
        else
            return `[required] Parameter 'req' has to be of type 'boolean' but is of type '${toType(req)}'`;
    },
    /**
     * Checks if a number in 'value' is at least the number in 'req' or if the string in 'value' is at least 'req'
     * characters long
     * @param value {string || number}
     * @param req {number}
     * @return {boolean || string}
     */
    min: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'string')
                return value.length >= req;
            else if(toType(value) === 'number')
                return value >= req;
            else
                return `[min] Parameter 'value' has to be of type 'string' or 'number' but is of type '${toType(value)}'`;
        else
            return `[min] Parameter 'req' has to be of type 'number' but is of type '${toType(req)}'`;
    },
    /**
     * Checks if a number in 'value' is at max the number in 'req' or if the string in 'value' is at max 'req'
     * characters long
     * @param value {string || number}
     * @param req {number}
     * @return {boolean || string}
     */
    max: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'string')
                return value.length <= req;
            else if(toType(value) === 'number')
                return value <= req;
            else
                return `[max] Parameter 'value' has to be of type 'string' or 'number' but is of type '${toType(value)}'`;
        else
            return `[max] Parameter 'req' has to be of type 'number' but is of type '${toType(req)}'`;
    },
    /**
     * Checks if two values match each other or if 'value' is a string and 'req' is a RegExp-string check if the RegExp
     * matches the string
     * @param value {string || number || boolean}
     * @param req {boolean || number || string || string<RegExp>}
     * @return {boolean || string}
     */
    match: (value, req) => {
        if(toType(req) === 'number')
            if(toType(value) === 'number')
                return value === req;
            else
                return `[match] Parameter 'value' has to be of type 'number' if parameter 'req' is also of type 'number' but is of type '${toType(value)}'`;
        else if(toType(req) === 'string')
            if(toType(value) === 'string')
                if (/^\/.+\/[gmiyus]+$/m.test(req)) {
                    let pattern = new RegExp(req.slice(req.indexOf('/') + 1, req.lastIndexOf('/')), req.slice(req.lastIndexOf('/') + 1, req.length));

                    return pattern.test(value);
                }
                else
                    return value === req;
            else
                return `[match] Parameter 'value' has to be of type 'string' if parameter 'req' is also if type 'string' but is of type '${toType(value)}'`;
        else if (toType(req) === 'boolean')
            if(toType(value) === 'boolean')
                return value === req;
            else
                return `[match] Parameter 'value' has to be of type 'boolean' if parameter 'req' is also of type 'boolean' but is of type '${toType(value)}'`;
        else
            return `[match] Parameter 'req' has to be of type 'number', 'string' or 'regexp' but is of type '${toType(type)}'`;

    }
};

module.exports = {validators};