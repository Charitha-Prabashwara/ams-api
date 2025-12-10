const CorsErrorBaseClass = require('./corsBaseError')

class NotAllowedRequestByCorsError extends CorsErrorBaseClass{
    constructor(origin){
        super(origin + " IS Not Allowed by CORS", 400);
    }
}

module.exports=  NotAllowedRequestByCorsError;