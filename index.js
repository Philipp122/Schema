const {toType} = require('./modules/toType');
const {isSchema} = require('./modules/isSchema');
const {validators} = require('./modules/validators');
const {applyValidators} = require('./modules/applyValidators');
const {validate} = require('./modules/validate');

module.exports = {toType, isSchema, validators, applyValidators, validate};