// 20250103080000_create_user_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("users", function (table) {
        table.increments("id").primary();
        table.string("username").notNullable();
        table.string("email").notNullable().unique();
        table.string("password", 255).notNullable();
        table.string("google_authentication", 255).nullable();
        table.string("remember_token", 255).nullable();
        table.bigInteger("referrer_id").unsigned().nullable().index();
        table.bigInteger("referrer_code").unsigned().nullable();
        table.enum("status", ["active", "inactive"]).defaultTo("inactive");
        table.integer("security_level").defaultTo(1);
        table.string("phone_no", 50).nullable();

        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users");
};
