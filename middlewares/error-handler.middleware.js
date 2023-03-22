const createHttpError = require('http-errors');

const errorHandler = (err, req, res, next) => {
    return next(createHttpError(err.status || 500, err.message));
}

module.exports = { errorHandler }