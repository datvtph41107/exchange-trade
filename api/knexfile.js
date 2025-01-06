const { dbConfig } = require("./server/config/config");

module.exports = {
    development: dbConfig,
    production: dbConfig,
};
