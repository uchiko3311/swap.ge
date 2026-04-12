function errorMiddleware(err, req, res, next){

    console.error(err.stack);

    res.status(500).json({
        msg:"Server Error",
        error: err.message
    });
}

module.exports = errorMiddleware;
