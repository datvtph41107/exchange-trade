/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("user_security_settings", (table) => {
        table.bigInteger("id").unsigned().primary();
        table.integer("email_verified").unsigned().notNullable().defaultTo(0);
        table.string("email_verification_code", 191).nullable();
        table.bigInteger("mail_register_created_at");
        table.integer("phone_verified").unsigned().notNullable().defaultTo(0);
        table.string("phone_verification_code", 191).nullable();
        table.integer("identity_verified").unsigned().notNullable().defaultTo(0);
        table.integer("bank_account_verified").unsigned().notNullable().defaultTo(0);
        table.integer("otp_verified").unsigned().notNullable().defaultTo(0);
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("user_security_settings");
};
