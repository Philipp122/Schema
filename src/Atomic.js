const toType = require('@philipp122/totype');

module.exports = class Atomic {
    /**
     * Creates a new Instance of Atomic. Throws error of schema is invalid.
     * @param schema {Object}
     * @param requiredDefault {Boolean}
     * @throws TypeError
     */
    constructor(schema, requiredDefault = false) {
        // Check if schema is Atomic, throw TypeError if not
        if(!Atomic.isAtomic(schema))
            throw new TypeError(`'schema' is not Atomic!`);

        // Parse schema into result {boolean}, validators {object} and parsedSchema {object}
        let [result, validators, parsedSchema] = Atomic._parseSchema(schema);

        // If the schema is invalid (as a result of _parseSchema(), throw TypeError
        if(!result)
            throw new TypeError(`Invalid Atomic Schema!`);

        // Set the internal values. Default _requiredDefault to false if the parameter is not a boolean
        this._validators = validators;
        this._schema = parsedSchema;
        this._requiredDefault = toType(requiredDefault) === 'boolean' ? requiredDefault : false;
    }

    /**
     * Changes the internal values of this instance. Behaves similar to constructor. Throws error if schema is invalid
     * @param schema {Object}
     * @throws TypeError
     */
    set schema(schema) {
        // Check if schema is Atomic, throw TypeError if not
        if(!Atomic.isAtomic(schema))
            throw new TypeError(`'schema' is not Atomic!`);

        // Parse schema into result {boolean}, validators {object} and parsedSchema {object}
        let [result, validators, parsedSchema] = Atomic._parseSchema(schema);

        // If the schema is invalid (as a result of _parseSchema(), throw TypeError
        if(!result)
            throw new TypeError('Invalid Atomic Schema!');

        // Set the internal values
        this._validators = validators;
        this._schema = parsedSchema;
    }

    /**
     * Returns the current schema of this instance.
     * @returns {Object}
     */
    get schema() {
        return this._schema;
    }

    /**
     * Returns an Object with all the active validators set to true
     * @returns {Object}
     */
    get validators() {
        return this._validators;
    }

    /**
     * Returns if this instance of Atomic is required. If it is not specified in the schema, fallback to requiredDefault - the value specified in the constructor
     * @returns {Boolean}
     */
    isRequired() {
        return this._validators.required ? this._schema.required : this._requiredDefault;
    }

    /**
     * Returns if this instance of Atomic has a default. If it is not specified in the schema, return undefined
     * @return {undefined}
     */
    hasDefault() {
        return this._validators.default ? this._schema.default : undefined;
    }

    /**
     * Returns if the given schema is Atomic. Atomic schemas are objects having a key called 'type' which has a value of type string.
     * @param schema {Object}
     * @returns {Boolean}
     */
    static isAtomic(schema) {
        return (toType(schema)) === 'object' ? toType(schema['type']) === 'string' : false;
    }

    /**
     * Parses the Atomic schema given and returns an array with the result of the parsing, an object with all the active validators set to true and the parsed schema object
     * @param schema {Object}
     * @returns {[Boolean, Object, Object]}
     * @private
     */
     static _parseSchema(schema) {
        let result = true;
        let validators = {
            type: false,
            required: false,
            min: false,
            max: false,
            match: false,
            default: false
        };
        let parsedSchema = {};

        if(['null', 'boolean', 'number', 'string', 'array', 'object'].includes(schema['type'])) {
            validators.type = true;
            parsedSchema['type'] = schema['type'];

            if(Object.keys(schema).includes('required')) {
                if (toType(schema['required']) === 'boolean') {
                    result &= true;
                    validators.required = true;
                    parsedSchema['required'] = schema['required'];
                }
                else
                    result &= false;
            }

            let schemaKeys = Object.keys(schema).filter(key => key !== 'type' && key !== 'required');

            switch (schema['type']) {
                case 'null':
                    schemaKeys.forEach(key => {
                        switch(key) {
                            case 'min':
                            case 'max':
                                result &= false;
                                break;
                            case 'match':
                                if(toType(schema['match']) === 'null') {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['match'] = schema['match'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'default':
                                if(toType(schema['default']) === 'null') {
                                    result &= true;
                                    validators.default = true;
                                    parsedSchema['default'] = schema['default'];
                                }
                                else
                                    result &= false;

                                break;
                            default:
                                result &= false;
                        }
                    });

                    if(validators.match && validators.default)
                        result &= parsedSchema['match'] === parsedSchema['default'];

                    break;
                case 'boolean':
                    schemaKeys.forEach(key => {
                        switch(key) {
                            case 'min':
                            case 'max':
                                result &= false;
                                break;
                            case 'match':
                                if(toType(schema['match']) === 'boolean') {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['match'] = schema['match'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'default':
                                if(toType(schema['default']) === 'boolean') {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['default'] = schema['default'];
                                }
                                else
                                    result &= false;

                                break;
                            default:
                                result &= false;
                        }
                    });

                    if(validators.match && validators.default)
                        result &= parsedSchema['match'] === parsedSchema['default'];

                    break;
                case 'number':
                    schemaKeys.forEach(key => {
                        switch(key) {
                            case 'min':
                                if(toType(schema['min']) === 'number' && !Number.isNaN(schema['min'])) {
                                    result &= true;
                                    validators.min = true;
                                    parsedSchema['min'] = schema['min'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'max':
                                if(toType(schema['max']) === 'number' && !Number.isNaN(schema['max'])) {
                                    result &= true;
                                    validators.max = true;
                                    parsedSchema['max'] = schema['max'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'match':
                                if(toType(schema['match']) === 'number' && !Number.isNaN(schema['match'])) {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['match'] = schema['match'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'default':
                                if(toType(schema['default']) === 'number' && !Number.isNaN(schema['default'])) {
                                    result &= true;
                                    validators.default = true;
                                    parsedSchema['default'] = schema['default'];
                                }
                                else
                                    result &= false;

                                break;
                            default:
                                result &= false;
                        }


                    });

                    if(validators.match && validators.default)
                        result &= parsedSchema['match'] === parsedSchema['default'];

                    if(validators.min && validators.match)
                        result &= parsedSchema['min'] <= parsedSchema['match'];

                    if(validators.max && validators.match)
                        result &= parsedSchema['max'] >= parsedSchema['match'];

                    if(validators.min && validators.default)
                        result &= parsedSchema['min'] <= parsedSchema['default'];

                    if(validators.max && validators.default)
                        result &= parsedSchema['max'] >= parsedSchema['default'];

                    break;
                case 'string':
                    schemaKeys.forEach(key => {
                        switch(key) {
                            case 'min':
                                if(toType(schema['min']) === 'number' && !Number.isNaN(schema['min'])) {
                                    result &= true;
                                    validators.min = true;
                                    parsedSchema['min'] = schema['min'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'max':
                                if(toType(schema['max']) === 'number' && !Number.isNaN(schema['max'])) {
                                    result &= true;
                                    validators.max = true;
                                    parsedSchema['max'] = schema['max'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'match':
                                if(toType(schema['match']) === 'string') {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['match'] = schema['match'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'default':
                                if(toType(schema['default']) === 'string') {
                                    result &= true;
                                    validators.default = true;
                                    parsedSchema['default'] = schema['default'];
                                }
                                else
                                    result &= false;

                                break;
                            default:
                                result &= false;
                        }


                    });

                    if(validators.match && validators.default)
                        result &= parsedSchema['match'] === parsedSchema['default'];

                    if(validators.min && validators.match)
                        result &= parsedSchema['min'] <= parsedSchema['match'].length;

                    if(validators.max && validators.match)
                        result &= parsedSchema['max'] >= parsedSchema['match'].length;

                    if(validators.min && validators.default)
                        result &= parsedSchema['min'] <= parsedSchema['default'].length;

                    if(validators.max && validators.default)
                        result &= parsedSchema['max'] >= parsedSchema['default'].length;

                    break;
                case 'array':
                    schemaKeys.forEach(key => {
                        switch(key) {
                            case 'min':
                                if(toType(schema['min']) === 'number' && !Number.isNaN(schema['min'])) {
                                    result &= true;
                                    validators.min = true;
                                    parsedSchema['min'] = schema['min'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'max':
                                if(toType(schema['max']) === 'number' && !Number.isNaN(schema['max'])) {
                                    result &= true;
                                    validators.max = true;
                                    parsedSchema['max'] = schema['max'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'match':
                                if(toType(schema['match']) === 'array') {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['match'] = schema['match'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'default':
                                if(toType(schema['default']) === 'array') {
                                    result &= true;
                                    validators.default = true;
                                    parsedSchema['default'] = schema['default'];
                                }
                                else
                                    result &= false;

                                break;
                            default:
                                result &= false;
                        }


                    });

                    if(validators.match && validators.default)
                        result &= JSON.stringify(parsedSchema['match']) === JSON.stringify(parsedSchema['default']);

                    if(validators.min && validators.match)
                        result &= parsedSchema['min'] <= parsedSchema['match'].length;

                    if(validators.max && validators.match)
                        result &= parsedSchema['max'] >= parsedSchema['match'].length;

                    if(validators.min && validators.default)
                        result &= parsedSchema['min'] <= parsedSchema['default'].length;

                    if(validators.max && validators.default)
                        result &= parsedSchema['max'] >= parsedSchema['default'].length;

                    break;
                case 'object':
                    schemaKeys.forEach(key => {
                        switch(key) {
                            case 'min':
                                if(toType(schema['min']) === 'number' && !Number.isNaN(schema['min'])) {
                                    result &= true;
                                    validators.min = true;
                                    parsedSchema['min'] = schema['min'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'max':
                                if(toType(schema['max']) === 'number' && !Number.isNaN(schema['max'])) {
                                    result &= true;
                                    validators.max = true;
                                    parsedSchema['max'] = schema['max'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'match':
                                if(toType(schema['match']) === 'object') {
                                    result &= true;
                                    validators.match = true;
                                    parsedSchema['match'] = schema['match'];
                                }
                                else
                                    result &= false;

                                break;
                            case 'default':
                                if(toType(schema['default']) === 'object') {
                                    result &= true;
                                    validators.default = true;
                                    parsedSchema['default'] = schema['default'];
                                }
                                else
                                    result &= false;

                                break;
                            default:
                                result &= false;
                        }


                    });

                    if(validators.match && validators.default)
                        result &= JSON.stringify(parsedSchema['match']) === JSON.stringify(parsedSchema['default']);

                    if(validators.min && validators.match)
                        result &= parsedSchema['min'] <= Object.keys(parsedSchema['match']).length;

                    if(validators.max && validators.match)
                        result &= parsedSchema['max'] >= Object.keys(parsedSchema['match']).length;

                    if(validators.min && validators.default)
                        result &= parsedSchema['min'] <= Object.keys(parsedSchema['default']).length;

                    if(validators.max && validators.default)
                        result &= parsedSchema['max'] >= Object.keys(parsedSchema['default']).length;

                    break;
            }
        }
        else
            result &= false;

        return [result, validators, parsedSchema];
    }

    /**
     * Validates a given object against the internal Atomic schema. Returns true or false
     * @param object {Null | Boolean | Number | String | Array | Object}
     * @return {Boolean}
     */
    validate(object) {
        let result = true;

        switch (this._schema['type']) {
            case 'null':
                if (toType(object) === 'null') {
                    if(this._validators.match)
                        result &= object === this._schema['match'];
                }
                else
                    result &= false;

                break;
            case 'boolean':
                if(toType(object) === 'boolean') {
                    if(this._validators.match)
                        result &= object === this._schema['match'];
                }
                else
                    result &= false;

                break;
            case 'number':
                if(toType(object) === 'number' && !Number.isNaN(object)) {
                    if(this._validators.min)
                        result &= object >= this._schema['min'];

                    if(this._validators.max)
                        result &= object <= this._schema['max'];

                    if(this._validators.match)
                        result &= object === this._schema['match'];
                }
                else
                    result &= false;

                break;
            case 'string':
                if(toType(object) === 'string') {
                    if(this._validators.min)
                        result &= object.length >= this._schema['min'];

                    if(this._validators.max)
                        result &= object.length <= this._schema['max'];

                    if(this._validators.match)
                        result &= object === this._schema['match'];
                }
                else
                    result &= false;

                break;
            case 'array':
                if(toType(object) === 'array') {
                    if(this._validators.min)
                        result &= object.length >= this._schema['min'];

                    if(this._validators.max)
                        result &= object.length <= this._schema['max'];

                    if(this._validators.match)
                        result &= JSON.stringify(object) === JSON.stringify(this._schema['match']);
                }
                else
                    result &= false;

                break;
            case 'object':
                if(toType(object) === 'object') {
                    if(this._validators.min)
                        result &= Object.keys(object).length >= this._schema['min'];

                    if(this._validators.max)
                        result &= Object.keys(object).length <= this._schema['max'];

                    if(this._validators.match)
                        result &= JSON.stringify(object) === JSON.stringify(this._schema['match']);
                }
                else
                    result &= false;

                break;
        }

        return !!result;
    }

    /**
     * Parses a given object against the internal Atomic Schema.
     * Returns the given object if it validates to true
     * Returns the default if it validates to false and a default is specified
     * Throws error if it validates to false and no default is specified
     * @param object {Null | Boolean | Number | String | Array | Object}
     * @return {Null | Boolean | Number | String | Array | Object}
     * @throws TypeError
     */
    parse(object) {
        if(!this.validate(object))
            if(this._validators.default)
                return this._schema['default'];
            else
                throw new TypeError('Invalid Object and no default specified!');
        else
            return object;
    }
};