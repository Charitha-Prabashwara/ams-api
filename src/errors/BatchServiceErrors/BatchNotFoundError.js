
const BatchServiceBaseError = require('./BatchServiceBaseError')

class BatchNotFoundError extends BatchServiceBaseError{
    constructor(){
        super("Batch not found", 404)
    }
}

module.exports= BatchNotFoundError