const LOGGER = require("../utils/logger");
const path = require("path");
require("dotenv").config();

const dbConfig = {
    client: "mysql2",
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMAS,
    },
    pool: { min: 10, max: 150 },
    log: {
        warn(message) {
            LOGGER.DB.query(message);
        },
        error(message) {
            LOGGER.DB.error(message).bind(LOGGER.DB);
        },
        deprecate(message) {
            LOGGER.DB.query(message);
        },
        debug(message) {
            LOGGER.DB.query(message);
        },
    },
    migrations: {
        directory: path.join(__dirname, "../db/migrations"),
    },
    seeds: {
        directory: path.join(__dirname, "../db/seeds"),
    },
};

module.exports = {
    dbConfig,
};
