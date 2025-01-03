const express = require("express");
const UserController = require("../controllers/UserController");
const { validator } = require("../middlewares");
const router = express.Router();

router.get("/login", validator, UserController.login);

module.exports = router;
