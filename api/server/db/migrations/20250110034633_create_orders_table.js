/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("orders", (table) => {
        table.increments("id").primary();
        table.bigInteger("user_id").unsigned().notNullable();
        table.string("trade_type", 20).notNullable();
        table.string("currency", 20).notNullable();
        table.string("coin", 20).notNullable();
        table.string("type", 20).notNullable();
        table.decimal("quantity", 30, 10).defaultTo(0);
        table.decimal("price", 30, 10).defaultTo(0);
        table.decimal("excuted_quantity", 30, 10).defaultTo(0);
        table.decimal("excuted_price", 30, 10).defaultTo(0);
        table.decimal("base_price", 30, 10).defaultTo(0);
        table.decimal("fee", 30, 10).defaultTo(0);
        table.decimal("reverse_price", 30, 10).defaultTo(0);
        table.string("status");
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("orders");
};
