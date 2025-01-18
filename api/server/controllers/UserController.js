import LOGGER from "../utils/logger";
const UserServices = require("../services/UserServices");

// import express from "express";
// import { login } from "../controllers/UserController.js";

// const router = express.Router();

// router.get("/login", login);

// export default router;
exports.getUser = async (req, res) => {
    LOGGER.APP.info("USER data: " + JSON.stringify(req.user));
    const response = await UserServices.getUser(req);
    console.log(response);

    return res.status(response.code).send(response);
};
