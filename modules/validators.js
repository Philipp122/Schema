const {toType} = require('./toType');

/**
 * Checks if the type of 'value' equals the type specified in 'type'
 * @param value {string || number || boolean || null}
 * @param type {string}
 * @return {boolean || string}
 */
let type = (value, type) => {
    if(toType(type) === 'string')
        switch (toType(value)) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'null':
                if(toType(value) === type.toLowerCase())
                    return true;
                else
                    return `type | 'value' is not of type '${type}'!`;
            default:
                `type | 'value' has to be a 'string', 'number', 'boolean' or 'null' but is of type '${toType(value)}'!`;
        }
    else
        return `type | 'type' has to be a 'string' but is of type '${toType(type)}'!`;
};

/**
 * Checks if 'value' is present, eg. is not null, "" or NaN
 * @param value {string || number || boolean || null}
 * @param requirement {boolean}
 * @return {boolean || string}
 */
let required = (value, requirement) => {
    if(toType(requirement) === 'boolean') {
        switch (toType(value)) {
            case 'string':
                if (value !== '')
                    return true;
                else
                    return `required | 'value' is required but string is empty!`;
            case 'number':
                if(!Number.isNaN(value))
                    return true;
                else
                    return `required | 'value' is required but is Not-A-Number!`;
            case 'null':
                return `required | 'value' is required but is 'null'!`;
            case 'boolean':
                return true;
            default:
                return `required | 'value' has to be a 'string', 'number', 'boolean' or 'null' but is of type '${toType(value)}'!`;
        }
    }
    else
        return `required | 'requirement' has to be a 'boolean' but is of type '${toType(requirement)}'!`;
};

/**
 * Checks if a number in 'value' is at least the number in 'req' or if the string in 'value' is at least 'req'
 * characters long
 * @param value {string || number}
 * @param requirement {number}
 * @return {boolean || string}
 */
let min = (value, requirement) => {
    if(toType(requirement) === 'number')
        switch (toType(value)) {
            case 'string':
                if(value.length >= requirement)
                    return true;
                else
                    return `min | 'value' has to be larger than or equal to 'requirement'!`;
            case 'number':
                if(value >= requirement)
                    return true;
                else
                    return `min | 'value' has to be larger than or equal to 'requirement'!`;
            default:
                return `min | 'value' has to be a 'string' or 'number' but is of type '${toType(value)}'!`;
        }
    else
        return `min | 'requirement' has to be a 'number' but is of type '${toType(requirement)}'!`;
};

/**
 * Checks if a number in 'value' is at max the number in 'req' or if the string in 'value' is at max 'req'
 * characters long
 * @param value {string || number}
 * @param requirement {number}
 * @return {boolean || string}
 */
let max = (value, requirement) => {
    if(toType(requirement) === 'number')
        switch (toType(value)) {
            case 'string':
                if(value.length <= requirement)
                    return true;
                else
                    return `max | 'value' has to be smaller than or equal to 'requirement'!`;
            case 'number':
                if(value <= requirement)
                    return true;
                else
                    return `max | 'value' has to be smaller than or equal to 'requirement'!`;
            default:
                return `max | 'value' has to be a 'string' or 'number' but is of type '${toType(value)}'!`;
        }
    else
        return `max | 'requirement' has to be a 'number' but is of type '${toType(requirement)}'!`;
};

/**
 * Checks if two values match each other or if 'value' is a string and 'req' is a RegExp-string check if the RegExp
 * matches the string
 * @param value {string || number || boolean}
 * @param req {boolean || number || string || string<RegExp> || regexp}
 * @return {boolean || string}
 */
let match = (value, req) => {
    switch (toType(req)) {
        case 'number':
            if(toType(value) === 'number')
                if(value === req)
                    return true;
                else
                    return `match | 'value' and 'requirement' are not matching!`;
            else
                return `match | 'value' has to be of type 'number' if 'requirement' is also of type 'number'!`;
        case 'string':
            if(toType(value) === 'string')
                if(/^\/.+\/[gmiyus]+$/m.test(req)) {
                    let pattern = new RegExp(req.slice(req.indexOf('/') + 1, req.lastIndexOf('/')), req.slice(req.lastIndexOf('/') + 1, req.length));

                    if(pattern.test(value) === true)
                        return true;
                    else
                        return `match | 'value' is not matching the RegExp in 'requirement'!`;
                }
                else
                    if(value === req)
                        return true;
                    else
                        return `match | 'value' and 'requirement' are not matching!`;
            else
                return `match | 'value' has to be of type 'string' if 'requirement' is also of type 'string'!`;
        case 'regexp':
            if(toType(value) === 'string') {
                let pattern = new RegExp(req);

                if(pattern.test(value) === true)
                    return true;
                else
                    return `match | 'value' is not matching the RegExp in 'requirement'!`;
            }
            else
                return `match | 'value' has to be of type 'string' if 'requirement' is a 'regexp'!`;
        case 'boolean':
            if(toType(value) === 'boolean')
                if(value === req)
                    return true;
                else
                    return `match | 'value' and 'requirement' are not matching!`;
            else
                return `match | 'value' has to be of type 'boolean' if 'requirement' is also of type 'boolean'!`;
        default:
            return `match | 'requirement' has to be a 'string', 'regexp', 'number' or 'boolean' but is of type '${toType(req)}'!`;
    }
};

module.exports = {type, required, min, max, match};