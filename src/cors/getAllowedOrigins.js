const {config} = require('../config')
const dataParser = require('./dataParser')
const dataFormatCheck = require('./dataFormatCheck')
const {NoAllowedOriginsError, InvalidOriginsFormat, AllowedOriginsIsNotAnArrayError} = require('../errors')

const getAllowedOrigins = ()=>{
   
    if(!config.ALLOWED_ORIGINS) throw new NoAllowedOriginsError()

    const parsed = dataParser(config.ALLOWED_ORIGINS, InvalidOriginsFormat)

    dataFormatCheck(parsed, AllowedOriginsIsNotAnArrayError)

    return parsed.map(item => item.trim());
}

module.exports=getAllowedOrigins