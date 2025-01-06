import connection from "../config/connectDB";
import response from "../utils/response";

class UserServices {
    static async login(data) {
        const email = "tiendat@gmail.com";
        const user = await connection.select().from("users").where({ email: email }).first();
        if (!user) {
            return response.WARN(404, "", "User not found!");
        }
        return response.SUCCESS(200, "Login success", 1);
    }
}

module.exports = UserServices;
