const CorsErrorBaseClass = require('./corsBaseError')

class NoAllowedHeadersError extends CorsErrorBaseClass{
    constructor(){
        super('Any allowed headers not found', 500);
    }
}

module.exports=  NoAllowedHeadersError;