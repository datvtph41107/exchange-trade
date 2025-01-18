import connection from "../config/connectDB";
import LOGGER from "../utils/logger";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class AuthMiddleware {
    static async authenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).send("Access token is missing");
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send("Invalid or expired token");
            }
            req.user = user.user;
            next();
        });
    }

    static async preLoginAccess(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await connection("users").select().where({ email }).first();
            if (!user) {
                return res.status(422).send("Email not found");
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(422).send("Invalid password!");
            }

            const setting = await connection("user_security_settings").where({ id: user.id, email_verified: true }).first();
            if (!setting) {
                return res.status(422).send("Unverified email!");
            }

            next();
        } catch (error) {
            LOGGER.APP.error("Error in preLoginAccess:", JSON.stringify(error));
            return res.status(500).send("Internal server error");
        }
    }
}

export default AuthMiddleware;
