const path = require("path");
const fs = require("fs");
const Utils = require("../utils/utils");
const { mailTransportConfig } = require("../config/config");

const emailQueue = Utils.initQueue("confirm_email_success");

class verifyEmail {
    static async confirmEmailSuccessFull({ toEmail, username, generateGGcode }) {
        try {
            const templatePath = path.join(__dirname, "../../views/emailTemplate.html");
            let emailTemplate = fs.readFileSync(templatePath, "utf8");
            emailTemplate = emailTemplate.replace("{{username}}", username).replace("{{actionUrl}}", generateGGcode);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: toEmail,
                subject: "Đăng ký thành công",
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

Utils.runQueueProcessing(emailQueue, async (job) => {
    const { toEmail, username, generateGGcode } = job.data;
    console.log(`Processing email for ${toEmail}`);
    await verifyEmail.confirmEmailSuccessFull({ toEmail, username, generateGGcode });
});

verifyEmail.queue = emailQueue;

module.exports = verifyEmail;
