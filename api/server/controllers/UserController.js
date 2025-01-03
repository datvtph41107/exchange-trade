const UserServices = require("../services/UserServices");

// import express from "express";
// import { login } from "../controllers/UserController.js";

// const router = express.Router();

// router.get("/login", login);

// export default router;
exports.login = async (req, res) => {
    const data = req.body;
    const response = await UserServices.login(data);
    return res.status(200).send(response);
};
