/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("usdt_accounts", (table) => {
        table.bigInteger("id").unsigned().primary();
        table.decimal("balance", 30, 10).defaultTo(0);
        table.decimal("available_balance", 30, 10).defaultTo(0);
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("usdt_accounts");
};
