const { check } = require("express-validator");

const registerValidateRules = [
    check("email").isEmail().withMessage("Invalid email format").notEmpty().withMessage("Email is required"),
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    check("confirmPassword")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Password confirmation does not match password"),
    check("agree_term")
        .notEmpty()
        .withMessage("agreeterm is required")
        .isBoolean()
        .withMessage("agreeterm must be a boolean value (true or false)")
        .isIn([true])
        .withMessage("You must agree to the terms and conditions"),
];

module.exports = registerValidateRules;
