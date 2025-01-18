const { validationResult } = require("express-validator");

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

const validator = (req, res, next) => {
    const errors = validationResult(req).mapped();
    if (isEmpty(errors)) {
        return next();
    }

    return res.status(422).json({
        result: false,
        message: "Validation error",
        errors,
    });
};

module.exports = validator;
