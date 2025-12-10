const CorsErrorBaseClass = require('./corsBaseError')

class AllowedOriginsIsNotAnArrayError extends CorsErrorBaseClass{
    constructor(){
        super("ALLOWED_ORIGINS must be JSON forma", 500);
    }
}

module.exports=  AllowedOriginsIsNotAnArrayError;