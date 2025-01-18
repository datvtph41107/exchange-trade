/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("transacions", (table) => {
        table.increments("id").primary();
        table.string("transaction_id", 191); // transaction_code
        table.bigInteger("user_id").unsigned();
        table.string("currency", 20).notNullable();
        table.decimal("amount", 30, 10).defaultTo(0);
        table.decimal("fee", 30, 10).defaultTo(0);
        table.string("status", 20).notNullable();
        table.string("from_address", 256).nullable();
        table.string("to_address", 256).nullable();
        table.string("blockchain_address", 256).nullable();
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("transactions");
};
