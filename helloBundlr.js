const Bundlr = require('@bundlr-network/client');
const fs = require('fs');

async function main() {
    const bundlr = new Bundlr('https://node1.bundlr.network', 'ethereum', process.env.PRIVATE_KEY);

    const pathToFile = './The Brave Japanese.pdf';
    const stat = await fs.promises.stat(pathToFile);
    console.log(stat);
    const size=stat.size;

    const price = await bundlr.getPrice(size);
    console.log(price);
    let output=await bundlr.fund(price);
    const { id } = await bundlr.uploadFile(pathToFile);
    console.log(`${pathToFile} --> Uploaded to https://arweave.net/\${id}`);
    console.log('End');
}

main();