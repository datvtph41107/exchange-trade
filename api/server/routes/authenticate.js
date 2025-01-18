const express = require("express");
const Authorization = require("../controllers/auth/AuthController");
const { AuthMiddleware } = require("../middlewares");
const { validator } = require("../middlewares");
const { registerValidateRules } = require("../../validate-request");

const router = express.Router();

router.post("/register", registerValidateRules, validator, Authorization.register);
router.post("/confirm-code", validator, Authorization.confirmCode);
router.post("/login", AuthMiddleware.preLoginAccess, validator, Authorization.login);

module.exports = router;
