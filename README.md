# JSON Schema Validation in JS  

Schema is a collection of classes with whom you can create JSON-Schemas and validate or parse JS Objects against. It also supports so called Atomic Schemas which you can use to validate a single value instead of an object.  
  
It is designed to be used with applications who have to deal with non-trustworthy data - from REST APIs to User Input.  

## Schema Object Validation & Parsing
**Example:**  
```js
const {Schema} = require('@philipp122/schema');  

// Create a new Schema
let User = new Schema({
    name: {
        type: 'string',
        required: true,
        min: 2,
        max: 32,
        default: 'N/A'
    },
    age: {
        type: 'number',
        required: true,
        min: 0,
        max: 150,
        default: 0
    }
}); 

//Validate or Parse objects
console.log('Validation Output 1: ' + User.validate({
    name: 'John Doe',
    age: 50
}));

console.log('Validation Output 2: ' + User.validate({
    name: 'John Doe',
    age: '50'
}));

console.log('Parsing Output 1: ' + JSON.stringify(User.parse({
    name: 123,
    age: '50'
})));

console.log('Parsing Output 2: ' + JSON.stringify(User.parse({
    name: 'John Doe',
    age: 50
})));
```  
**Output:**  
```  
Validation Output 1: true
Validation Output 2: true
Parsing Output 1: {"name":"N/A","age":0}
Parsing Output 2: {"name":"John Doe","age":50}
```

## Atomic Schema Validation & Parsing
**Example**
```js
const {Atomic} = require('@philipp122/schema');

// Create a new Atomic Schema
const Name = new Atomic({
  type: 'string',
  required: true,
  min: 2,
  max: 32,
  default: 'N/A'
});

// Validate or Parse objects
console.log(`Name Validation 1: ${Name.validate('John')}`);
console.log(`Name Validation 2: ${Name.validate('M')}`);
console.log(`Name Parsing 1: ${Name.parse('John', false)}`);
console.log(`Name Parsing 2: ${Name.parse('M', false)}`);
console.log(`Name Parsing 3: ${Name.parse(null, true)}`);
```
**Output**
```
Name Validation 1: true
Name Validation 2: false
Name Parsing 1: John
Name Parsing 2: N/A
Name Parsing 3: N/A
```