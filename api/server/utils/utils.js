const Queue = require("bull");
const LOGGER = require("./logger");

class Utils {
    static queues = {};

    static randomString(length = 8) {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    static previous24hInMillis() {
        return Date.now() - 24 * 60 * 60 * 1000;
    }

    static previous5Minutes(moment) {
        const current = Date.now();
        return current - moment <= 5 * 60 * 1000;
    }

    static previous3Minutes(moment) {
        const current = Date.now();
        return current - moment <= 3 * 60 * 1000;
    }

    static previousDayInMillis(days) {
        return Date.now() - days * 24 * 60 * 60 * 1000;
    }

    static currentMilliseconds() {
        return Date.now();
    }

    static initQueue(queueName, redisConfig = null) {
        if (!this.queues[queueName]) {
            this.queues[queueName] = new Queue(queueName, {
                redis: redisConfig || {
                    host: process.env.HOST,
                    port: 6379,
                },
            });
            console.log(`queue init name: ${queueName}`);
        }
        return this.queues[queueName];
    }

    static async addJob(queueName, type, data, redisConfig = null) {
        try {
            const queue = this.initQueue(queueName, redisConfig);
            const job = await queue.add(
                {
                    type,
                    data,
                },
                {
                    attempts: 3, // Thử lại tối đa 3 lần
                    backoff: 5000, // Chờ 5 giây trước khi thử lại
                },
            );
            LOGGER.APP.info(`queue add to job of ${queueName}:`, JSON.stringify(job));
            return job;
        } catch (error) {
            LOGGER.APP.error(`failed to add job to queue ${queueName}:`, JSON.stringify(error));
            throw error;
        }
    }

    static runQueueProcessing(queueName, processFunction, redisConfig = null) {
        const queue = this.initQueue(queueName, redisConfig);
        queue.process(async (job) => {
            try {
                await processFunction(job);
                LOGGER.APP.info(`Run Queue Processing of ${queueName}:` + JSON.stringify(job));
            } catch (error) {
                LOGGER.APP.error(`Job failed for: ${job}`, error);
                throw error;
            }
        });

        queue.on("completed", (job) => {
            LOGGER.APP.info(`Job successfully completed of: ${JSON.stringify(job)}`);
        });

        queue.on("failed", (job, err) => {
            LOGGER.APP.error(`Job failed of: ${job}`, JSON.stringify(err));
        });

        return queue;
    }
}

module.exports = Utils;
