import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { readFile } from "fs/promises";
import { v4 as uuid } from "uuid";

async function readEvent(fileName) {
  const file = await readFile(fileName);
  return JSON.parse(file.toString());
}

async function main() {
  const fileName = process.argv[2];
  const count = process.argv[3] || 1;

  const event = await readEvent(`../events/${fileName}.json`);
  console.log("event", event);

  const sqsClient = new SQSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "ASIAZEMUFT4EJ4WB77FY",
      secretAccessKey: "8e+U9oN90hsfKcCz2Lge8s9UYnCnO6eF9P8X19oK"
    },
    endpoint: "http://localhost:9324"
  });

  const queueUrl = "http://localhost:9324/queue/vads-cashback-charge-failed";

  for (let i = 0; i < count; i++) {
    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(event),
      //MessageDeduplicationId: uuid(), 
      //MessageGroupId: "default", 
    };

    const command = new SendMessageCommand(params);
    console.log("command", command);
    try {
      await sqsClient.send(command);
    } catch (err) {
      console.error("Error", err);
    }
  }
}

main();