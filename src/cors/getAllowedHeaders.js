const {config} = require('../config')
const dataParser = require('./dataParser')
const dataFormatCheck = require('./dataFormatCheck')
const {InvalidHeadersFormatError, NoAllowedHeadersError, AllowedHeadersNotAnArrayError} = require('../errors')

const getAllowedHeaders= ()=>{
     if(!config.ALLOWED_HEADERS) throw new NoAllowedHeadersError()

    const parsed = dataParser(config.ALLOWED_HEADERS, InvalidHeadersFormatError)
   
    dataFormatCheck(parsed, AllowedHeadersNotAnArrayError)
    
    return parsed.map(item => item.trim());
}

module.exports = getAllowedHeaders
