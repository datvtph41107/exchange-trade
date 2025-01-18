import LOGGER from "../utils/logger";

const DB_CONFIG = require("./config").dbConfig;
const knex = require("knex")(DB_CONFIG);

knex.on("query", LOGGER.DB.query);
knex.on("query-error", LOGGER.DB.error.bind(LOGGER.DB));
knex.on("query-response", LOGGER.DB.query);

module.exports = knex;
