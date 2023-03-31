const notFound = (request, response, next) => {
    const error = new Error(`not found - ${request.originalUrl}`)
    response.send(404)
    next(error);
}

const errorHandler = (error, request, response, next) => {
    const statusCode = response.statusCode;
    response.status(statusCode)
    response.json({
        message: error.message,
        stack: error.stack
    })
}

module.exports = { notFound, errorHandler }