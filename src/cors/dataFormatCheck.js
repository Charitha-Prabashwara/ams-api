const dataFormatCheck = (parsed, parsedError)=>{ 
    if (!Array.isArray(parsed)) {
        throw new parsedError();
    }
}

module.exports = dataFormatCheck