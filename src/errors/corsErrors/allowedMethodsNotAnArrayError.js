const CorsErrorBaseClass = require('./corsBaseError')

class AllowedMethodsNotAnArrayError extends CorsErrorBaseClass{
    constructor(){
        super("ALLOWED_METHODS must be JSON forma", 500);
    }
}

module.exports=  AllowedMethodsNotAnArrayError;