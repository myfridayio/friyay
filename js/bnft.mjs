import { program } from 'commander'
import { exec as execSync } from 'child_process'
import fs, { readdirSync, rename } from 'fs'
import path, { resolve } from 'path'
import ora from 'ora'
import spinners from 'cli-spinners'
import web3 from '@solana/web3.js'
import QRCode from 'qrcode'
import sharp from 'sharp'
import * as readline from 'readline'

const ASSETS_DIR = './assets/NFT2'
const HELMET_IMAGE = './helmet.png'
const QR_IMAGE = './assets/QR2/0.png'
const STEPZEN_API_KEY = "saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685"
const _dirname = "./"


const keyPath = (publicKey) => `${publicKey}.keypair.json`

const VERIFY_ASSETS_COMMAND = "ts-node ./packages/cli/src/candy-machine-v2-cli.ts verify_assets"

const uploadCommand = (keyPath) => `ts-node ./packages/cli/src/candy-machine-v2-cli.ts upload -rcm -e devnet -k ${keyPath} -cp ./packages/cli/example-candy-machine-upload-config.json -c example ${ASSETS_DIR}`
const collectCommand = (keyPath) => `ts-node ./packages/cli/src/candy-machine-v2-cli.ts set_collection -e devnet -k ${keyPath} -c example`
const verifyUploadCommand = (keyPath) => `ts-node ./packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ${keyPath} -c example`
const mintCommand = (keyPath) => `ts-node ./packages/cli/src/candy-machine-v2-cli.ts mint_one_token -e devnet -k ${keyPath} -c example`


const exec = async (command) => {
    return new Promise((resolve, reject) => {
        execSync(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error)
            }
            resolve(stdout)
        })
    })
}

const getpublicKey = (userId) => {
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise (resolve => r1.question(userId, ans => {
        r1.close();
        resolve(ans);
        console.log(ans)
    }))
}

// const getprivateKey = (userId) => {
//     const r2 = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     return new Promise (resolve => (r2.questions(userId, ans => {
//         r2.close();
//         resolve(ans);
//         console.log(ans)
//     })))
// }

//const userId = getpublicKey();

const question = await getpublicKey("What is your Public Key? ");
// const questions = await getprivateKey("What is your Private Key? ");

const files = fs.readdirSync(_dirname)
for (const file of files) {
    if (file.endsWith('.keypair.json')) {
        fs.renameSync(file, `${question}.keypair.json`)
        // fs.writeFile(`${question}.keypair.json`, questions)
        //console.log(file)
    }
}

//const keyPath = question

const getMintId = async (txId) => {
    const solana = new web3.Connection("https://yolo-cool-silence.solana-devnet.discover.quiknode.pro/8a2c88416f21d62a416c6a237638f530d45b6a84/");
    //const txId = "26Wpe4UQgyvsP1t5qG8LS6DEnyjcWF2mM4rtPqH4ufndEvpNPRafCd6okvQv2Kk1mw8xryE6Pk1R66NryLsjKw17"
    const info = await solana.getTransaction(txId)
    const { meta: { postTokenBalances } } = info
    return postTokenBalances[0].mint
}

const getVerifyUrl = (userId) => {
    const encode = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    const query = `{getHistoryById(id: "${userId}") { KanyeSpotify FollowsKanye JeenYuhs userId } }`
    return 'https://saopedro.stepzen.net/api/orange-bee/__graphql?query=' + encode(query);
}

// const generateQRCode = async (verificationUrl) => {
//     return new Promise((resolve, reject) => {
//         QRCode.toFile(QR_IMAGE, verificationUrl, (error) => {
//             if (error) {
//                 return reject(error)
//             }
//             return resolve()
//         })
//     })
// }

const generateAssetJSON = (verificationUrl) => {
    const manifest = {
        name: "BNFT",
        symbol: '',
        file: "0.png",
        image: "0.png",
        properties: {
            files: [{ uri: "0.png", type: "image/png" }],
            category: "image",
            verificationUrl,
            creators: [
                {
                    address: "CV6uQbknPdCVPQunQHqosyvdHJeTuq3629VJdzs8AYjV",
                    //address: question,
                    share: 100
                }
            ]
        },
        description: '',
        seller_fee_basis_points: 500,
        attributes: [],
        collection: {}
    }
    const jsonPath = path.join(ASSETS_DIR, '0.json')
    fs.writeFileSync(jsonPath, JSON.stringify(manifest, null, 2))
}

// const generateAssetImage = async (verificationUrl) => {
//     await generateQRCode(verificationUrl)
//     const imagePath = path.join(ASSETS_DIR, '0.png')
//     const size = 800
//     const overlaySize = Math.max(200, size / 4)
//     const offset = size - overlaySize - 20

//     const qr = await sharp(QR_IMAGE).resize(overlaySize, overlaySize).toBuffer()

//     await sharp(HELMET_IMAGE)
//     .resize(size, size)
//     .composite([
//         { input: qr, top: offset, left: offset }
//     ])
//     .toFile(imagePath)
    
    // images(KANYE_IMAGE)
    //     .size(size)
    //     .draw(images(QR_IMAGE).size(overlaySize), size - overlaySize - 20, size - overlaySize - 20)
    //     .save(imagePath, { quality: 50 })
// }

const generateAssets = async (verificationUrl) => {
    generateAssetJSON(verificationUrl)
    //await generateAssetImage(verificationUrl)
}

const isTrueFan = async (userId) => {
    const verifyUrl = getVerifyUrl(userId)
    const command = `curl --no-progress-meter -H "Authorization: apikey ${STEPZEN_API_KEY}" ${verifyUrl}`
    return exec(command)
        .then(output => {
            const json = JSON.parse(output)
            if (!json.data || !json.data.getHistoryById) {
                return false
            }
            const { data: { getHistoryById: { KanyeSpotify, JeenYuhs, FollowsKanye } } } = json
            return KanyeSpotify && JeenYuhs && FollowsKanye
        })
}

const run = async (opts) => {
    //const { id: userId } = opts
    const userId = question
    console.log('Evaluating', userId, 'for BNFT...')
    const qualifies = await isTrueFan(userId)
    if (!qualifies) {
        console.log('Ooooh, so sorry, no BNFT for you')
        return
    }
    console.log('--=| User qualifies! |=--')
    const verificationUrl = getVerifyUrl(userId)

    const spinWhile = async (promise, text, after) => {
        const spinner = ora({ text, spinner: spinners.point, color: 'red' }).start()
        await promise
        spinner.succeed(after)
    }

    const kp = keyPath(userId)
    await spinWhile(getpublicKey, 'Getting wallet ID')
    await spinWhile(generateAssets(verificationUrl), 'Assembling Assets for BNFT', 'Assembled Assets for BNFT')
    await spinWhile(exec(`${VERIFY_ASSETS_COMMAND} ${ASSETS_DIR}`), 'Verify assets (1/5)')
    await spinWhile(exec(uploadCommand(kp)), 'Upload assets (2/5)')
    await spinWhile(exec(collectCommand(kp)), 'Set collection (3/5)')
    await spinWhile(exec(verifyUploadCommand(kp)), 'Verify upload (4/5)')
    let txId = null
    const mint = async () => {
        const output = await exec(mintCommand(kp))
        // console.log(output)
        const regex = /mint_one_token finished ([A-Za-z0-9]+)/g
        txId = regex.exec(output)[1]
    }
    await spinWhile(mint(), 'Mint BNFT (5/5)')
    console.log('Transaction ID', txId)
    const mintId = await getMintId(txId)
    console.log('Mint Key', mintId)
    const results = { txId, mintId }
    fs.writeFileSync('./badge.json', JSON.stringify(results))
    console.log(`https://explorer.solana.com/address/${mintId}?cluster=devnet`)
}


program
    //.requiredOption('-i, --id <userId>', 'the ID of the user')
    .action(run)

await program.parseAsync()