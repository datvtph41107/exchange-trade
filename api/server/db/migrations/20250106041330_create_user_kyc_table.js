/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("user_kyc", function (table) {
        table.bigInteger("id").unsigned().primary();
        table.string("full_name", 191);
        table.string("id_front", 191);
        table.string("id_back", 191);
        table.string("id_selfie", 191);
        table.string("gender", 191);
        table.string("country", 191);
        table.string("id_number", 191);
        table.integer("user_id").unsigned();
        table.enum("status", ["pending", "verified", "rejected"]).defaultTo("pending");
        table.enum("bank_status", ["unverified", "verifying", "creating", "verified", "rejected"]).defaultTo("unverified"); // Trạng thái tài khoản ngân hàng
        table.timestamps();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("user_kyc");
};
