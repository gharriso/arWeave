const {
    Client,
    AccountId,
    PrivateKey,
    TopicCreateTransaction,
    AccountCreateTransaction,
    Hbar
} = require('@hashgraph/sdk');

async function main() {
    if (process.argv.length < 5) {
        console.log(`Usage: ${process.argv[0]} ${process.argv[1]} testnet|mainnet accountId privateKey`);
        process.exit(1);
    }
    const mode = process.argv[2];
    const _accountId = process.argv[3];
    const _privateKey = process.argv[4];
    let client;
    if (mode === 'mainnet') {
        client = Client.forMainnet();
    } else {
        client = Client.forTestnet();
    }
    const accountId = AccountId.fromString(_accountId);
    const privateKey = PrivateKey.fromString(_privateKey);


    client.setOperator(accountId, privateKey);

    // Create new Topic Id
    const topicTransaction0 = new TopicCreateTransaction();

    // Sign with the client operator private key and submit the transaction to a Hedera network
    const txResponse0 = await topicTransaction0.execute(client);

    // Request the receipt of the transaction
    const receipt0 = await txResponse0.getReceipt(client);

    // Get the topic ID
    const topicIdForExistingAccount = receipt0.topicId;

    console.log('The new topic ID for existing account is ' + topicIdForExistingAccount);

    // Create new account ID
    const accountTransaction = new AccountCreateTransaction()
        .setKey(privateKey)
        .setInitialBalance(new Hbar(1000));

    // Sign the transaction with the client operator private key and submit to a Hedera network
    const accountTxResponse
        = await accountTransaction.execute(client);

    // Request the receipt of the transaction
    const accountReceipt = await accountTxResponse.getReceipt(client);

    // Get the account ID
    const newAccountId = accountReceipt.accountId;

    console.log('The new account ID is ' + newAccountId);

    // Create new Topic Id
    const topicTransaction = new TopicCreateTransaction();

    // Sign with the client operator private key and submit the transaction to a Hedera network
    const txResponse = await topicTransaction.execute(client);

    // Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    // Get the topic ID
    const newTopicId = receipt.topicId;

    console.log('The new topic ID is ' + newTopicId);
    process.exit(0);
}

main();