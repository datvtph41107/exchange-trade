import response from "../../utils/response";
import LOGGER from "../../utils/logger";
import connection from "../../config/connectDB";
import SendEmailJob from "../../jobs/sendEmailJob";
import ConfirmEmailService from "./ConfirmEmailService";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
    static async register(request) {
        try {
            const { email, password } = request;

            const user = await connection.select().from("users").where({ email: email }).first();
            if (user) {
                return response.WARN(400, "", "Email already used!");
            }
            const hashedPassword = bcrypt.hashSync(password, 8);
            const generateGGcode = Utils.randomString(6);
            const userName = this.randomUsername();

            const data = {
                email: email,
                username: userName,
                password: hashedPassword,
                referrer_code: this.generateUniqueReferrerCode(),
            };
            this.create(data, generateGGcode);
            // send Email
            SendEmailJob.addEmailJob("register", {
                toEmail: email,
                username: userName,
                generateGGcode,
            });

            return response.SUCCESS(200, "", "User registration successful!");
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
            return response.ERROR(500, "", error.message);
        }
    }

    static async login(request) {
        try {
            const { email, password } = request;
            const user = await connection.select().from("users").where({ email: email }).first();
            if (!user) {
                return response.WARN(404, "", "User not found!");
            }

            const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 604800, // 24h x 7
            });

            const data = {
                id: user.id,
                username: user.username,
                email: user.email,
                create_time: user.create_time,
                accessToken,
            };
            return response.SUCCESS(200, "Login success", data);
        } catch (error) {
            LOGGER.APP.error(JSON.stringify(error));
            return response.ERROR(500, "", error.message);
        }
    }

    static async confirmCode(request) {
        const trx = await connection.transaction();
        try {
            const { code } = request;
            if (!code) {
                return response.WARN(400, "", "code invalid!");
            }

            const setting = await trx("user_security_settings")
                .select("*")
                .where({
                    email_verification_code: code,
                    email_verified: 0,
                })
                .andWhere("mail_register_created_at", ">=", Utils.currentMilliseconds() + 30 * 1000) // 30s * 1000 cv miliseconds
                .first();

            if (!setting) {
                throw new Error("mail_registered_expired or email was in used");
            }
            const userId = setting.id;
            await ConfirmEmailService.confirm(code);

            const user = await trx("users").select("*").where({ id: userId }).first();
            // if (user) {
            //     const data = {
            //         id: user.id,
            //         username: user.username,
            //         email: user.email,
            //         role: "USER",
            //         status: user.status.toUpperCase(),
            //     };
            //     const topic = Consts.TOPIC_PRODUCER_SYNC_USER;
            //     await Utils.kafkaProducer(topic, data);
            // }
            await trx.commit();
            return response.SUCCESS(200, "Email confirmation successfully!", user);
        } catch (error) {
            await trx.rollback();
            LOGGER.APP.error(JSON.stringify(error));
            return response.ERROR(500, error.message || "Internal Server Error");
        }
    }

    static async create(data, generateCode) {
        const trx = await connection.transaction();
        try {
            const [user] = await trx("users").insert(data).returning(["id", "email", "username"]);

            const existingSettings = await trx("user_security_settings").select("*").where({ id: user.id }).first();
            if (existingSettings) {
                await trx("user_security_settings").where({ id: user.id }).update({
                    mail_register_created_at: Utils.currentMilliseconds(),
                    email_verification_code: generateCode,
                });
            } else {
                await trx("user_security_settings").insert({
                    id: user.id,
                    mail_register_created_at: Utils.currentMilliseconds(),
                    email_verification_code: generateCode,
                });
            }

            await trx.commit();
            return response.SUCCESS(200, "User registration successful!", user);
        } catch (error) {
            await trx.rollback();
            LOGGER.APP.error(JSON.stringify(error));
            return response.ERROR(500, "", error.message);
        }
    }

    static randomUsername() {
        const name = "user";
        const result = Utils.randomString(6);
        return name + result;
    }

    static generateUniqueReferrerCode(length = 8) {
        const random = Utils.randomString(length);
        return random;
    }
}

module.exports = AuthService;
