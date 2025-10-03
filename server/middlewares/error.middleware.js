const errorMiddleware = (err, req, res, next) => {
    // Normalize naming (some code uses statuscode, some statusCode)
    const status = err.statusCode || err.statuscode || 500;
    const message = err.message || 'Something went wrong';

    // Avoid sending headers twice
    if (res.headersSent) return next(err);

    res.status(status).json({
        success: false,
        message,
        // Only include stack in non-production environments
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

export default errorMiddleware;