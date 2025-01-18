const path = require("path");
const fs = require("fs");
const Utils = require("../utils/utils");
const { mailTransportConfig } = require("../config/config");

class SendEmailJob {
    static queueName = "email-register";

    /**
     * @param {string} type
     * @param {object} emailData
     * @returns {Promise}
     */
    static async addEmailJob(type, emailData) {
        await Utils.addJob(this.queueName, type, emailData);
    }

    /**
     * @param {Function} processFunction
     */

    static runQueue() {
        Utils.runQueueProcessing(this.queueName, async (job) => {
            await this.sendRegistrationEmail(job.data);
        });
    }

    static async sendRegistrationEmail({ toEmail, username, generateGGcode }) {
        try {
            const templatePath = path.join(__dirname, "../../views/emailTemplate.html");
            let emailTemplate = fs.readFileSync(templatePath, "utf8");
            emailTemplate = emailTemplate.replace("{{username}}", username).replace("{{actionUrl}}", generateGGcode);

            const mailOptions = {
                from: process.env.DOMAIN_MAIL,
                to: toEmail,
                subject: "Chào mừng thành viên mới",
                html: emailTemplate,
            };

            mailTransportConfig.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    throw error;
                } else {
                    console.log(`Email sent to ${toEmail}: ${info.response}`);
                }
            });
        } catch (error) {
            console.error("Error in sendRegistrationEmail:", error);
            throw error;
        }
    }
}

module.exports = SendEmailJob;
