const Irys = require('@irys/sdk');
const fs = require('fs');
const {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  PrivateKey,
  AccountId,
} = require("@hashgraph/sdk");

//Import keys from .env file
require('dotenv').config();


async function main() {
  try {

    if (process.argv.length < 3) {
      console.log('Usage: node poorMansOTV.js <file>');
      process.exit(1);
    }
    const pathToFile = process.argv[2];

    const stat = await fs.promises.stat(pathToFile);
    //console.log(stat);
    const size = stat.size;
    const irys = new Irys({
      url:"https://node2.irys.xyz", // URL of the node you want to connect to
      token:"matic", // Token used for payment
      key: process.env.ETH_PRIVATE_KEY, // ETH or SOL private key
      config: {  }, // Optional provider URL, only required when using Devnet
    });
    console.dir({irys,depth:null});
    const price = await irys.getPrice(size);
    console.log({price});
    const fundTx = await irys.fund(price);
		console.log(`Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${irys.token}`);

    const receipt = await irys.uploadFile(pathToFile);
    console.log(`${pathToFile} --> Uploaded to https://arweave.net/${receipt.id}`);
    console.dir({receipt}, {depth: null});
    console.log('End');
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
}

 



async function postHedera() {
  const operatorPrivateKey = PrivateKey.fromString("YOUR_PRIVATE_KEY");
  const operatorAccount = AccountId.fromString("YOUR_ACCOUNT_ID");

  const client = Client.forTestnet();
  client.setOperator(operatorAccount, operatorPrivateKey);

  const topicId = TopicId.fromString("YOUR_TOPIC_ID");

  const message = "Hello, Hedera!";

  const transactionId = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);

  const receipt = await transactionId.getReceipt(client);

  console.log("Sequence number: ", receipt.topicSequenceNumber);
}

main();