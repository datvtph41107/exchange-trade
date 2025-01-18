import LOGGER from "../utils/logger";
const OrderServices = require("../services/OrderService");

exports.order = async (req, res) => {
    const data = req.body;
    const user = req.user;
    LOGGER.APP.info("Order -> data: " + JSON.stringify(data));
    const response = await OrderServices.order(data, user);
    return res.status(response.code).send(response.data);
};
