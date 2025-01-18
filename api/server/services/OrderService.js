import response from "../utils/response";
import LOGGER from "../utils/logger";

class OrderService {
    static async order(req, user) {
        try {
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
            return response.WARN(400, "", error.message);
        }
    }
}

module.exports = OrderService;
