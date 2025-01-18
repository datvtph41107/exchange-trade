import LOGGER from "../../utils/logger";
const AuthServices = require("../../services/auth/AuthService");

exports.register = async (req, res) => {
    const data = req.body;
    LOGGER.APP.info("register -> data: " + JSON.stringify(data));
    const response = await AuthServices.register(data);
    return res.status(response.code).send(response.data);
};

exports.login = async (req, res) => {
    const data = req.body;
    const response = await AuthServices.login(data);
    return res.status(response.code).send(response.data);
};

exports.confirmCode = async (req, res) => {
    const data = req.body;
    const response = await AuthServices.confirmCode(data);
    return res.status(response.code).send(response.data);
};
