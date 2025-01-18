const SendEmailJob = require("./server/jobs/sendEmailJob");
const LOGGER = require("./server/utils/logger");

// Ctrl + Alt + D - Ctrl + Alt + A
// node worker.js <queueName>
const queueName = process.argv[2];

if (!queueName) {
    LOGGER.APP.error("Error: Queue name is required!");
    LOGGER.APP.error("Usage: node worker.js <queueName>");
    process.exit(1);
}

(async () => {
    switch (queueName) {
        case SendEmailJob.queueName:
            SendEmailJob.runQueue();
            break;

        default:
            process.exit(1);
    }
})();
