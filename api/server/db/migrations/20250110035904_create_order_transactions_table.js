/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("order_transactions", (table) => {
        table.increments("id").primary();
        table.bigInteger("buy_order_id").unsigned().notNullable();
        table.bigInteger("sell_order_id").unsigned().notNullable();
        table.string("currency", 20).notNullable();
        table.string("coin", 20).notNullable();
        table.decimal("price", 30, 10).defaultTo(0);
        table.decimal("quantity", 30, 10).defaultTo(0);
        table.decimal("amount", 30, 10).defaultTo(0);
        table.date("executed_date").nullable();
        table.string("transaction_type", 255);
        table.string("status");
        table.bigInteger("buyer_id").unsigned().notNullable();
        table.string("buyer_email", 191).notNullable();
        table.bigInteger("seller_id").unsigned().notNullable();
        table.string("seller_email", 191).notNullable();
        table.decimal("buy_fee", 30, 10).defaultTo(0);
        table.decimal("sell_fee", 30, 10).defaultTo(0);
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("order_transactions");
};
