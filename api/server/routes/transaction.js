const express = require("express");
const TransactionController = require("../controllers/TransactionController");
const { validator } = require("../middlewares");
const { AuthMiddleware } = require("../middlewares");
const router = express.Router();

router.get("/deposit/fiat", AuthMiddleware.authenticate, validator, TransactionController.deposit);

module.exports = router;
