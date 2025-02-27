import { QueueEvents, Worker } from "bullmq";
import { config } from "dotenv";
import IORedis from "ioredis";

config({ path: "../../.env" });

console.log(`REDIS_HOST: ${process.env.REDIS_HOST}`);

const connection = new IORedis(
  `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  {
    maxRetriesPerRequest: null,
  },
);

const worker = new Worker(
  "resource-queue",
  async (job) => {
    console.log(`Received job ${job.id} with data ${job.data}`);
  },
  {
    connection,
  },
);
