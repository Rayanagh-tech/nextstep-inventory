// collector/kafkaClient.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || '192.168.1.160:9092'], // VM IP
});

const producer = kafka.producer();

async function sendAlert(alert) {
  await producer.connect();
  await producer.send({
    topic: 'alerts',
    messages: [{ value: JSON.stringify(alert) }],
  });
  await producer.disconnect();
}

module.exports = { sendAlert };
