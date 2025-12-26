const CorsErrorBaseClass = require('./corsBaseError')

class NoAllowedMethodsError extends CorsErrorBaseClass{
    constructor(){
        super('Any allowed methods not found', 500);
    }
}

module.exports=  NoAllowedMethodsError;