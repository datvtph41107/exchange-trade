/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// display matching engine order
exports.up = function (knex) {
    return knex.schema.createTable("orderbooks", (table) => {
        table.increments("id").primary();
        table.string("trade_type", 20);
        table.string("currency", 20);
        table.string("coin", 20);
        table.decimal("quantity", 30, 10).defaultTo(0);
        table.integer("count").defaultTo(0);
        table.decimal("price", 30, 10).defaultTo(0);
        table.decimal("ticker", 30, 10).defaultTo(0);

        table.bigInteger("updated_at").index();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("orderbooks");
};
