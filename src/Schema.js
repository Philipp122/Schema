const toType = require('@philipp122/totype');
const chunk = require('lodash.chunk');
const Atomic = require('./Atomic.js');

module.exports = class Schema {
    /**
     * Creates a new Instance of Schema. Throws error if schema is invalid
     * @param schema {Object | Array}
     * @param requiredDefault {Boolean}
     * @throws Error
     */
    constructor(schema, requiredDefault = false) {
        this._requiredDefault = toType(requiredDefault) === 'boolean' ? requiredDefault : false;

        try {
            this._schema = Schema._parseSchema(schema, this._requiredDefault);
        }
        catch (e) {
            throw new Error('Invalid Schema!');
        }
    }

    /**
     * Changes the internal values of this instance. Behaves similar to constructor. Throws error if schema is invalid
     * @param schema {Object | Array}
     * @throws Error
     */
    set schema(schema) {
        try {
            this._schema = Schema._parseSchema(schema, this._requiredDefault);
        }
        catch (e) {
            throw new Error('Invalid Schema!');
        }
    }

    /**
     * Returns the current schema of this instance.
     * @return {Object | Array}
     */
    get schema() {
        return this._schema;
    }

    /**
     * Parses the schema given and returns either the parsed schema (with all Atomics replace with their respective Atomic Instance) or throws an Error/TypeError
     * @param schema {Object | Array}
     * @param requiredDefault {Boolean}
     * @return {Object | Array | Atomic}
     * @throws {Error | TypeError}
     * @private
     */
    static _parseSchema(schema, requiredDefault) {
        let parsedSchema;

        if(Atomic.isAtomic(schema)) {
            try {
                parsedSchema = new Atomic(schema, requiredDefault);
            }
            catch (e) {
                throw new TypeError('Invalid Schema!');
            }
        }
        else {
            switch (toType(schema)) {
                case 'array':
                    parsedSchema = [];

                    schema.forEach(element => {
                        parsedSchema.push(Schema._parseSchema(element, requiredDefault));
                    });

                    break;
                case 'object':
                    parsedSchema = {};

                    Object.keys(schema).forEach(key => {
                        parsedSchema[key] = Schema._parseSchema(schema[key], requiredDefault);
                    });

                    break;
                default:
                    throw new Error('Element is not of type Array, Object or Atomic!');
            }
        }

        return parsedSchema;
    }

    /**
     * Validates an Object against the internal schema. Calls the private _validate function with its respective correct parameters
     * @param object {Null | Boolean | Number | String | Array | Object}
     * @return {Boolean}
     */
    validate(object) {
        return !!Schema._validate(object, this._schema);
    }

    /**
     * Checks recursively if a branch of the schema is required
     * @param schema
     * @return {boolean}
     */
    static isRequired(schema) {
        let result = false;

        if(schema instanceof Atomic) {
            result |= schema.isRequired();
        }
        else {
            switch (toType(schema)) {
                case 'array':
                    schema.forEach(element => {
                        result |= Schema.isRequired(element);
                    });
                    break;
                case 'object':
                    Object.keys(schema).forEach(key => {
                        result |= Schema.isRequired(schema[key]);
                    });
            }
        }

        return result;
    }

    /**
     * Checks recursively if a branch of the schema has defaults set and applies them
     * @param schema {Object}
     * @return {[Boolean, Null | Boolean | Number | String | Array | Object]}
     */
    static hasDefault(schema) {
        let result = true;
        let defaults;

        if(schema instanceof Atomic) {
            let res = schema.hasDefault();

            if(toType(res) === 'undefined') {
                result &= false;
                defaults = undefined;
            }
            else {
                result &= true;
                defaults = res;
            }
        }
        else {
            switch (toType(schema)) {
                case 'array':
                    defaults = [];

                    schema.forEach(element => {
                        let res = Schema.hasDefault(element);
                        result &= res[0];
                        defaults.push(res[1]);
                    });

                    break;
                case 'object':
                    defaults = {};

                    Object.keys(schema).forEach(key => {
                        let res = Schema.hasDefault(schema[key]);
                        result &= res[0];
                        defaults[key] = res[1];
                    });
            }
        }

        return [result, defaults];
    }

    /**
     * Validates a given object against the internal schema. Returns true or false
     * @param object {Null | Boolean | Number | String | Array | Object}
     * @param schema {Array | Object}
     * @return {Boolean}
     * @private
     */
    static _validate(object, schema) {
        let result = true;

        if(schema instanceof Atomic)
            result &= schema.validate(object);
        else {
            switch (toType(schema)) {
                case 'array':
                    if(toType(object) !== 'array')
                        result &= false;
                    else {
                        chunk(object, schema.length).forEach(group => {
                            group.forEach((element, index) => {
                                result &= Schema._validate(element, schema[index]);
                            });
                        });
                    }

                    break;
                case 'object':
                    if(toType(object) !== 'object')
                        result &= false;
                    else {
                        Object.keys(schema).forEach(key => {
                            if(Schema._validate(object[key], schema[key]))
                                result &= true;
                            else {
                                if(Schema.isRequired(schema[key])) {
                                    let [res, defaults] = Schema.hasDefault(schema[key]);

                                    result &= res;
                                }
                                else
                                    result &= true;
                            }
                        });
                    }
            }
        }

        return result;
    }

    /**
     * Parses an Object against the internal schema. Calls the private _parse function with its respective correct parameters
     * Returns the given object if it validates to true
     * Returns defaults if it validates to false and defaults are specified
     * Throws error if it validates to false and no default is specified
     * @param object {Null | Boolean | Number | String | Array | Object}
     * @return {Boolean}
     * @throws {Error}
     */
    parse(object) {
        try {
            return Schema._parse(object, this._schema);
        }
        catch (e) {
            throw new Error('Error while parsing!');
        }
    }

    /**
     * * Parses an Object against the internal schema. Calls the private _parse function with its respective correct parameters
     * Returns the given object if it validates to true
     * Returns defaults if it validates to false and defaults are specified
     * Throws error if it validates to false and no default is specified
     * @param object {Null | Boolean | Number | String | Array | Object}
     * @param schema {Array | Object}
     * @return {Null | Boolean | Number | String | Array | Object}
     * @private
     * @throws {Error | TypeError | ReferenceError}
     */
    static _parse(object, schema) {
        let parsedObject;

        if(schema instanceof Atomic)
            parsedObject = schema.parse(object);
        else {
            switch (toType(schema)) {
                case 'array':
                    parsedObject = [];

                    if(toType(object) !== 'array')
                        throw new TypeError('Array expected!');
                    else {
                        chunk(object, schema.length).forEach(group => {
                            group.forEach((element, index) => {
                                parsedObject.push(Schema._parse(element, schema[index]));
                            });
                        });
                    }

                    break;
                case 'object':
                    parsedObject = {};

                    if(toType(object) !== 'object')
                        throw new TypeError('Object expected!');
                    else {
                        Object.keys(schema).forEach(key => {
                            try {
                                parsedObject[key] = Schema._parse(object[key], schema[key]);
                            }
                            catch (e) {
                                if(Schema.isRequired(schema[key])) {
                                    let [res, defaults] = Schema.hasDefault(schema[key]);

                                    if (res)
                                        parsedObject[key] = defaults;
                                    else
                                        throw new ReferenceError('Object is required');
                                }
                            }
                        });
                    }
            }
        }

        return parsedObject;
    }
};