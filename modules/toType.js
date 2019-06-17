/**
 * Return the true Datatype of a value by accessing its internal [[CLASS]] property
 * @param value
 * @return {string}
 */
let toType = (value) => {
    return ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

module.exports = {toType};