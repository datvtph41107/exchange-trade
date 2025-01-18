const express = require("express");
const OrderController = require("../controllers/OrderController");
const { validator } = require("../middlewares");
const { AuthMiddleware } = require("../middlewares");

const router = express.Router();

router.post("/spot/trade", validator, AuthMiddleware.authenticate, OrderController.order);

module.exports = router;
