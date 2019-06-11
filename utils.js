/**
 * Return the true Datatype of a value
 * @param obj
 * @return {string}
 */
let toType = (obj) => {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

/**
 * Checks if 'obj' is a valid Schema, either a string defining the Datatype or and object containing the 'type' key
 * which is a string defining the Datatype
 * @param obj {string || object}
 * @return {boolean}
 */
let isSchema = (obj) => {
    if(toType(obj) === 'string')
        return true;
    else if(obj['type'] !== 'undefined')
        return obj['type'] === 'string';
    else
        return false;
};

module.exports = {toType, isSchema};