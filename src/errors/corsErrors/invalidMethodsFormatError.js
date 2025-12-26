const CorsErrorBaseClass = require('./corsBaseError')

class InvalidMethodsFormatError extends CorsErrorBaseClass{
    constructor(){
        super('ALLOWED METHODS must be JSON format like [\"value\",\"value\"]"', 500);
    }
}

module.exports=  InvalidMethodsFormatError;