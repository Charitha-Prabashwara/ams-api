const CorsErrorBaseClass = require('./corsBaseError')

class AllowedHeadersNotAnArrayError extends CorsErrorBaseClass{
    constructor(){
        super("ALLOWED_HEADERS must be JSON forma", 500);
    }
}

module.exports=  AllowedHeadersNotAnArrayError;