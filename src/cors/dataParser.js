const dataParser = (configConstant, parseError)=>{ 
    try {
        return JSON.parse(configConstant)
    } catch (error) {
        throw new parseError();
    }
}

module.exports = dataParser