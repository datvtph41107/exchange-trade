import LOGGER from "../../utils/logger";
import connection from "../../config/connectDB";
import Consts from "../../utils/consts";
import { queue } from "../../jobs/sendEmailJob";

class ConfirmEmailService {
    static async confirm(code) {
        try {
            const setting = await connection
                .select()
                .from("user_security_settings")
                .where({
                    email_verification_code: code,
                    email_verified: 0,
                })
                .first();

            const userId = setting.id;

            if (setting) {
                await this.updateSetting(setting);
                await this.updateUser(userId);
                await this.queueAndNotifyRegistedSuccess(userId);
                // more setting device service
                // more setting language service
            }
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
        }
    }

    static async updateSetting(setting) {
        try {
            await connection("user_security_settings").where({ id: setting.id }).update({
                email_verification_code: null,
                mail_register_created_at: null,
                email_verified: 1,
                updated_at: new Date(),
            });
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
        }
    }

    static async updateUser(userId) {
        try {
            await connection.select("users").where({ id: userId }).update({
                status: Consts.USER_ACTIVE,
            });
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
        }
    }

    static async queueAndNotifyRegistedSuccess(userId) {
        try {
            await queue.addJob("create_new_user", {});
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
        }
    }
}

module.exports = ConfirmEmailService;
