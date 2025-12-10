const CorsErrorBaseClass = require('./corsBaseError')

class NoAllowedOriginsError extends CorsErrorBaseClass{
    constructor(){
        super('Any allowed origins not found', 500);
    }
}

module.exports=  NoAllowedOriginsError;