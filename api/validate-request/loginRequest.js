const { check } = require("express-validator");

const registerValidateRules = [
    check("email").isEmail().withMessage("Invalid email format").notEmpty().withMessage("Email is required"),
    check("password").notEmpty().withMessage("Password is required").withMessage("Password must be at least 6 characters long"),
];

module.exports = registerValidateRules;
