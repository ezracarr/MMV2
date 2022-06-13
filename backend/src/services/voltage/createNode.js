const axios = require('axios')
const crypto = require('crypto-js')

// HIDE THIS IN AN ENVIRONMENT VARIABLE BEFORE COMMITTING
let apiKey = "Checknotes"
let nodeName = "voltage-example"
let nodePassword = "Checknotes"

async function createNode() {
    console.log("Creating a node...")

    voltageHeaders = {
        'X-VOLTAGE-AUTH': apiKey,
    }

    // Create the Node
    creationBody = {
        network: "testnet",
        purchased_type: "ondemand",
        type: "standard",
        name: nodeName,
        settings: {
            alias: nodeName,
            autocompaction: false,
            autopilot: false,
            color: "#EF820D",
            grpc: true,
            keysend: true,
            rest: true,
            whitelist: [
              "1.2.3.4"
            ],
            wumbo: true
        }
    }
    response = await makeRequest('POST', 'https://api.voltage.cloud/node/create', creationBody, voltageHeaders)
    nodeId = response.node_id
    console.log("Created the node: "+nodeId)

    // Wait until the node is waiting_init
    do {
        statusBody = {
            node_id: nodeId
        }
        response = await makeRequest('POST', 'https://api.voltage.cloud/node', statusBody, voltageHeaders)
        nodeStatus = response.status
        nodeApi = response.api_endpoint
        console.log("Found node's status of "+nodeStatus)

        // Wait 5 seconds before checking again
        await new Promise(r => setTimeout(r, 5000))
    }
    while (nodeStatus !== "waiting_init")

    // Get a seed for the node
    response = await makeRequest('GET', 'https://' + nodeApi + ':8080/v1/genseed', {}, {})
    seedPhrase = response.cipher_seed_mnemonic
    console.log("Got seed phrase: "+seedPhrase)

    // Initialize the node
    console.log("Initializing wallet with a password: xxxxxxxxxxx")
    initBody = {
        wallet_password: Buffer.from(nodePassword).toString('base64'),
        cipher_seed_mnemonic: seedPhrase,
        stateless_init: true
    }
    response = await makeRequest('POST', 'https://'+nodeApi+':8080/v1/initwallet', initBody, {})
    nodeMacaroon = response.admin_macaroon
    console.log("Got Node's Macaroon: "+nodeMacaroon)

    // Encrypt the Macaroon and Seed
    encryptedSeed = crypto.AES.encrypt(
        Buffer.from(seedPhrase.join(",")).toString('base64'),
        nodePassword
    ).toString();

    encryptedMacaroon = crypto.AES.encrypt(
        nodeMacaroon,
        nodePassword
    ).toString();

    // Backup Seed and Macaroon
    let macBody = {
        node_id: nodeId,
        macaroon: encryptedMacaroon,
        name: "admin"
    }
    response = await makeRequest('POST', 'https://api.voltage.cloud/node/macaroon', macBody, voltageHeaders)
    console.log("Uploaded macaroon")

    let seedBackBody = {
        node_id: nodeId,
        seed: encryptedSeed
    }
    response = await makeRequest('POST', 'https://api.voltage.cloud/node/upload_seed', seedBackBody, voltageHeaders)
    console.log("Uploaded seed")

    console.log("Successfully created your node!")
}

function makeRequest(method, url, data, headers) {
    return new Promise(function (resolve, reject) {
        axios({
            method: method,
            url: url,
            headers: headers,
            data: data

        }).then(
            (response) => {
                var result = response.data
                resolve(result)
            },
            (error) => {
                console.log(error)
                reject(error)
            }
        );
    });
}

module.exports = {
    createNode: createNode 
}