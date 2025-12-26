const {config} = require('../config')
const dataParser = require('./dataParser')
const dataFormatCheck = require('./dataFormatCheck')
const {NoAllowedMethodsError, InvalidMethodsFormatError,
    AllowedMethodsNotAnArrayError} = require('../errors')


const getAllowedMethods = ()=>{
    if(!config.ALLOWED_METHODS) throw new NoAllowedMethodsError()

    const parsed = dataParser(config.ALLOWED_METHODS, InvalidMethodsFormatError)

    dataFormatCheck(parsed, AllowedMethodsNotAnArrayError)
   
    
    return parsed.map(item => item.trim());
}

module.exports = getAllowedMethods