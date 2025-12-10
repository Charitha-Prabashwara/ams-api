const CorsErrorBaseClass = require('./corsBaseError')

class InvalidOriginsFormat extends CorsErrorBaseClass{
    constructor(){
        super('ALLOWED_ORIGINS must be JSON format like [\"value\",\"value\"]"', 500);
    }
}

module.exports=  InvalidOriginsFormat;