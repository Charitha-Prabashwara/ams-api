const CorsErrorBaseClass = require('./corsBaseError')

class InvalidHeadersFormatError extends CorsErrorBaseClass{
    constructor(){
        super('ALLOWED HEADERS must be JSON format like [\"value\",\"value\"]"', 500);
    }
}

module.exports=  InvalidHeadersFormatError;