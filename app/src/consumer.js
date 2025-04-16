import { Kafka } from "kafkajs";

async function main() {
  const kafka = new Kafka({
    clientId: "kafka-consumer",
    brokers: ["host.docker.internal:29092"],
  });

  const consumer = kafka.consumer({ groupId: "my-group" });

  await consumer.connect();
  await consumer.subscribe({ topic: "pe.io.vads.cashback.redemption-requested.v1", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
}

main().catch((error) => {
  console.error("Error:", error);
});