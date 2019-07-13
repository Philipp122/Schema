const toType = require('@philipp122/totype');

let validators = {
    /**
     * Checks if the type of 'value' equals the type specified in 'type'
     * @param value {null || undefined || boolean || number || string || array || object || regexp}
     * @param type {string}
     * @return {boolean || string}
     */
    type: (value, type) => {
        let valueType = toType(value);
        let typeType = toType(type);

        if(typeType !== 'string')
            return `type | 'type' has to be of type 'string' but is of type '${typeType}'!`;

        switch (valueType) {
            case 'null':
            case 'undefined':
            case 'boolean':
            case 'number':
            case 'string':
            case 'array':
            case 'object':
            case 'regexp':
                if(valueType !== type.toLowerCase())
                    return `type | 'value' is not of type '${type}'!`;
                break;
            default:
                return `type | 'value' has to be of type 'null', 'undefined', 'boolean', 'number', 'string', 'array', 'object' or 'regexp' but is of type '${valueType}'!`;
        }

        return true;
    },
    /**
     * Checks if 'value' is present, eg. is not null, "" or NaN
     * @param value {null || undefined || boolean || number || string || array || object || regexp}
     * @param requirement {boolean}
     * @return {boolean || string}
     */
    required: (value, requirement) => {
        let valueType = toType(value);
        let requirementType = toType(requirement);

        if(requirementType !== 'boolean')
            return `required | 'requirement' has to be of type 'boolean' but is of type '${requirementType}'!`;

        if(!requirement)
            return true;

        switch (valueType) {
            case 'null':
                return `required | 'value' is required but is 'null'!`;
            case 'undefined':
                return `required | 'value' is required but is 'undefined'!`;
            case 'boolean':
                return true;
            case 'number':
                if(Number.isNaN(value))
                    return `required | 'value' is required but is Not-A-Number!`;

                return true;
            case 'string':
                if(value === '')
                    return `required | 'value' is required but string is empty!`;

                return true;
            case 'array':
                if(!(value.length > 0))
                    return `required | 'value' is required but array is empty!`;

                return true;
            case 'object':
                if(!(Object.keys(value).length > 0))
                    return `required | 'value' is required but object is empty!`;

                return true;
            case 'regexp':
                return true;
            default:
                return `required | 'value' has to be of type 'null', 'undefined', 'boolean', 'number', 'string', 'array', 'object' or 'regexp' but is of type '${valueType}'!`;
        }
    },
    /**
     * Checks if a number in 'value' is at least the number in 'req' or if the string in 'value' is at least 'req'
     * characters long
     * @param value {number || string || array || object}
     * @param requirement {number}
     * @return {boolean || string}
     */
    min: (value, requirement) => {
        let valueType = toType(value);
        let requirementType = toType(requirement);

        if(requirementType !== 'number')
            return `min | 'requirement' has to be a 'number' but is of type '${requirementType}'!`;

        switch(valueType) {
            case 'number':
                if(value >= requirement)
                    return true;
                else
                    return `min | 'value' has to be larger than or equal to 'requirement'!`;
            case 'string':
                if(value.length >= requirement)
                    return true;
                else
                    return `min | 'value' has to be larger than or equal to 'requirement'!`;
            case 'array':
                if(value.length >= requirement)
                    return true;
                else
                    return `min | 'value' has to be larger than or equal to 'requirement'!`;
            case 'object':
                if(Object.keys(value).length >= requirement)
                    return true;
                else
                    return `min | 'value' has to be larger than or equal to 'requirement'!`;
            default:
                return `min | 'value' has to be of type 'number', 'string', 'array' or 'object' but is of type '${valueType}'!`;
        }

    },
    /**
     * Checks if a number in 'value' is at max the number in 'req' or if the string in 'value' is at max 'req'
     * characters long
     * @param value {string || number || array || object}
     * @param requirement {number}
     * @return {boolean || string}
     */
    max: (value, requirement) => {
        let valueType = toType(value);
        let requirementType = toType(requirement);

        if(requirementType !== 'number')
            return `max | 'requirement' has to be a 'number' but is of type '${requirementType}'!`;

        switch (valueType) {
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
            case 'array':
                if(value.length <= requirement)
                    return true;
                else
                    return `max | 'value' has to be smaller than or equal to 'requirement'!`;
            case 'object':
                if(Object.keys(value).length <= requirement)
                    return true;
                else
                    return `max | 'value' has to be smaller than or equal to 'requirement'!`;
            default:
                return `max | 'value' has to be of type 'number', 'string', 'array' or 'object' but is of type '${valueType}'!`;
        }
    },
    /**
     * Checks if two values match each other or if 'value' is a string and 'req' is a RegExp-string check if the RegExp
     * matches the string
     * @param value {boolean || number || string}
     * @param requirement {boolean || number || string || string<RegExp> || regexp}
     * @return {boolean || string}
     */
    match: (value, requirement) => {
        let valueType = toType(value);
        let requirementType = toType(requirement);

        switch (requirementType) {
            case 'boolean':
                if(valueType !== 'boolean')
                    return `match | 'value' has to be of type 'boolean' if 'requirement' is also of type 'boolean'!`;

                return value === requirement ? true : `match | 'value' and 'requirement' are not matching!`;

            case 'number':
                if(valueType !== 'number')
                    return `match | 'value' has to be of type 'number' if 'requirement' is also of type 'number'!`;

                return value === requirement ? true : `match | 'value' and 'requirement' are not matching!`;

            case 'string':
                if(valueType !== 'string')
                    return `match | 'value' has to be of type 'string' if 'requirement' is also of type 'string'!`;


                if(/^\/.+\/[gmiyus]+$/m.test(requirement)) {
                    let patternFromString = new RegExp(requirement.slice(requirement.indexOf('/') + 1, requirement.lastIndexOf('/')), requirement.slice(requirement.lastIndexOf('/') + 1, requirement.length));

                    if(patternFromString.test(value) === true)
                        return true;
                    else
                        return `match | 'value' is not matching the RegExp in 'requirement'!`;
                }
                else
                if(value === requirement)
                    return true;
                else
                    return `match | 'value' and 'requirement' are not matching!`;

            case 'regexp':
                if(valueType !== 'string')
                    return `match | 'value' has to be of type 'string' if 'requirement' is a 'regexp'!`;

                let patternFromRegExp = new RegExp(requirement);

                if(patternFromRegExp.test(value) === true)
                    return true;
                else
                    return `match | 'value' is not matching the RegExp in 'requirement'!`;

            default:
                return `match | 'requirement' has to be of type 'boolean', 'number', 'string', 'string containing regexp' or 'regexp' but is of type '${requirementType}'!`;
        }
    }
};

module.exports = validators;