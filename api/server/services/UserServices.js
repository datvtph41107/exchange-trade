import LOGGER from "../utils/logger";
import connection from "../config/connectDB";
import response from "../utils/response";

class UserServices {
    static async getUser(request) {
        try {
            return response.SUCCESS(200, "successfully", request.user);
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
            return response.ERROR(500, "", error.message);
        }
    }
}

module.exports = UserServices;
