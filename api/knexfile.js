const { dbConfig } = require("./server/config/config");
// knexfile init to use cli
module.exports = {
    development: dbConfig,
    production: dbConfig,
};
