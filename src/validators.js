const toType = require('@philipp122/totype');

let validators = {
    /**
     * Checks if the type of 'value' equals the type specified in 'type'
     * @param object {null | undefined | boolean | number | string | array | object}
     * @param requirement {string}
     * @return {boolean}
     */
    type: (object, requirement) => {
        return toType(object) === requirement.toLowerCase();
    },
    /**
     * Checks if 'value' is present, eg. is not null, "" or NaN
     * @param object {null | undefined | boolean | number | string | array | object}
     * @param requirement {boolean}
     * @return {boolean}
     */
    required: (object, requirement) => {
        if(!requirement)
            return true;

        switch (toType(object)) {
            case 'boolean':
                return true;
            case 'number':
                return !Number.isNaN(object);
            case 'string':
                return object.length > 0 && object !== '';
            case 'array':
                return object.length > 0;
            case 'object':
                return Object.keys(object).length > 0;
            default:
                return false;
        }
    },
    /**
     * Checks if a number in 'value' is at least the number in 'req' or if the string in 'value' is at least 'req'
     * characters long
     * @param object {null | undefined | boolean | number | string | array | object}
     * @param requirement {boolean}
     * @return {boolean}
     */
    min: (object, requirement) => {
        switch (toType(object)) {
            case 'number':
                return object >= requirement;
            case 'string':
                return object.length >= requirement;
            case 'array':
                return object.length >= requirement;
            case 'object':
                return Object.keys(object).length >= 0;
            default:
                return false;
        }
    },
    /**
     * Checks if a number in 'value' is at max the number in 'req' or if the string in 'value' is at max 'req'
     * characters long
     * @param object {null | undefined | boolean | number | string | array | object}
     * @param requirement {number}
     * @return {boolean}
     */
    max: (object, requirement) => {
        switch (toType(object)) {
            case 'number':
                return object <= requirement;
            case 'string':
                return object.length <= requirement;
            case 'array':
                return object.length <= requirement;
            case 'object':
                return Object.keys(object).length <= 0;
            default:
                return false;
        }
    },
    /**
     * Checks if two values match each other or if 'value' is a string and 'req' is a RegExp-string check if the RegExp
     * matches the string. Also works with multiple values in an array.
     * @param object {null | undefined | boolean | number | string}
     * @param requirement {null, undefined, boolean, number, string, array}
     * @return {boolean}
     */
    match: (object, requirement) => {
        switch (toType(requirement)) {
            case 'null':
                return toType(object) === 'null' ? object === requirement : false;
            case 'undefined':
                return toType(object) === 'undefined' ? object === requirement : false;
            case 'boolean':
                return toType(object) === 'boolean' ? object === requirement : false;
            case 'number':
                return toType(object) === 'number' ? object === requirement : false;
            case 'string':
                if(toType(object) !== 'string')
                    return false;

                if(/^\/.+\/[gmiyus]+$/m.test(requirement)) {
                    let pattern = new RegExp(requirement.slice(requirement.indexOf('/') + 1, requirement.lastIndexOf('/')), requirement.slice(requirement.lastIndexOf('/') + 1, requirement.length));

                    return pattern.test(value) === true;
                }
                else
                    return object === requirement;
            case 'array':
                let bool = false;

                requirement.forEach(element => {
                    bool |= validators.match(object, element);
                });

                return bool;
            default:
                return false;
        }
    }
};

module.exports = validators;