const Bundlr = require('@bundlr-network/client');
const fs = require('fs');

async function main() {
    if (!('PRIVATE_KEY' in process.env)) {
        console.error('Specify Ethereum private key in PRIVATE_KEY env variable');
        process.exit(1);
    }
    if (process.argv.length!=3) {
        console.error(`Usage: ${process.argv[0]} ${process.argv[1]} fileName`);
        process.exit(2);
    }
    const pathToFile = process.argv[2];
    try {
        const bundlr = new Bundlr('https://node1.bundlr.network', 'ethereum', process.env.PRIVATE_KEY);

        const stat = await fs.promises.stat(pathToFile);

        const size = stat.size;
        console.log({
            size
        });
        const atomicBalance = await bundlr.getLoadedBalance();
        console.log(`Node balance (atomic units) = ${atomicBalance}`);

        // Convert balance to standard
        const convertedBalance = bundlr.utils.fromAtomic(atomicBalance);
        console.log(`Node balance (converted) = ${convertedBalance}`);
        if (size > 0) {
            const price = await bundlr.getPrice(size);
            console.log({price});
            let fundOut = await bundlr.fund(price);
            console.log({fundOut});
            const  uploadFileOut
               = await bundlr.uploadFile(pathToFile);
            console.log({uploadFileOut});
            console.log(`${pathToFile} --> Uploaded to https://arweave.net/${uploadFileOut.id}`);
            console.log('End');
        }
    } catch (error) {
        console.error(error.stack);
        process.exit(1);
    }
}

main();