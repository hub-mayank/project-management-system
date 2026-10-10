const notFound = (req, res) => {
    res.status(404).json({ message: "route not found" });
};

const errorHandler = (err, req, res, next) => {
    let status = err.status || 500;

    // mongoose validation and bad id errors are client mistakes
    if (err.name === "ValidationError" || err.name === "CastError") {
        status = 400;
    }

    res.status(status).json({ message: err.message });
};

module.exports = { notFound, errorHandler };
