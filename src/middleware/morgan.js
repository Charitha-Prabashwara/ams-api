const morgan = require('morgan');
const {envTypes} = require('../config')
module.exports = (app) => {
    if (process.env.NODE_ENV === envTypes.PRODUCTION) {
        app.use(morgan('tiny'));
    } else {
        app.use(morgan('dev'));
    }
};