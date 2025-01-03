import express from "express";
import * as path from "path";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";

import userRouter from "./server/routes/user";

const app = express();
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "server/public")));
app.use(helmet());

// Route
const { PREFIX } = process.env;
app.use(`${PREFIX}/user`, userRouter);

app.use((req, res) => {
    res.status(404).send({
        result: false,
        message: `${req.url} not found!`,
    });
});

export default app;
