import express from "express";
import * as path from "path";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import LOGGER from "./server/utils/logger";

import userRouter from "./server/routes/user";
import orderRouter from "./server/routes/order";
import authenticateRouter from "./server/routes/authenticate";
import transactionRouter from "./server/routes/transaction";

const app = express();
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(logger("dev")); // GET /api/v1/user/login 200 4.565 ms - 13
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "server/public")));
app.use(helmet());

app.use((req, res, next) => {
    LOGGER.HTTP.request(req).then((r) => {});
    next();
});

// Route
const { PREFIX } = process.env;
app.use(`${PREFIX}/`, authenticateRouter);
app.use(`${PREFIX}/user`, userRouter);
app.use(`${PREFIX}/orders`, orderRouter);
app.use(`${PREFIX}/transaction`, transactionRouter);

app.use((req, res) => {
    res.status(404).send({
        result: false,
        message: `${req.url} not found!`,
    });
});

export default app;
