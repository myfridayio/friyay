
import { program } from 'commander'
import { exec as execSync } from 'child_process'
import images from 'images'
import fs from 'fs'
import path from 'path'
import ora from 'ora'
import spinners from 'cli-spinners'
import web3 from '@solana/web3.js'
import QRCode from 'qrcode'

const ASSETS_DIR = './assets/NFT1'
const KANYE_IMAGE = './kanye.png'
const QR_IMAGE = './assets/NFT2/0.png'
const STEPZEN_API_KEY = "saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685"
const KEY_PATH = '~/.config/solana/id.json'

const VERIFY_ASSETS_COMMAND = "ts-node ./packages/cli/src/candy-machine-v2-cli.ts verify_assets"
const UPLOAD_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts upload -rcm -e devnet -k ${KEY_PATH} -cp ./packages/cli/example-candy-machine-upload-config.json -c example`
const COLLECT_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts set_collection -e devnet -k ${KEY_PATH} -c example`
const VERIFY_UPLOAD_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ${KEY_PATH} -c example`
const MINT_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts mint_one_token -e devnet -k ${KEY_PATH} -c example`

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

const generateQRCode = async (verificationUrl) => {
    return new Promise((resolve, reject) => {
        QRCode.toFile(QR_IMAGE, verificationUrl, (error) => {
            if (error) {
                return reject(error)
            }
            return resolve()
        })
    })
}

const generateAssetJSON = (verificationUrl) => {
    const manifest = {
        name: "1",
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

const generateAssetImage = async (verificationUrl) => {
    await generateQRCode(verificationUrl)
    const imagePath = path.join(ASSETS_DIR, '0.png')
    const size = 800
    const overlaySize = Math.max(200, size / 4)
    images(KANYE_IMAGE)
        .size(size)
        .draw(images(QR_IMAGE).size(overlaySize), size - overlaySize - 20, size - overlaySize - 20)
        .save(imagePath, { quality: 50 })
}

const generateAssets = async (verificationUrl) => {
    generateAssetJSON(verificationUrl)
    await generateAssetImage(verificationUrl)
}

const isTrueYeezy = async (userId) => {
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
    const { id: userId } = opts
    console.log('Evaluating', userId, 'for Yeeziness...')
    const qualifies = await isTrueYeezy(userId)
    if (!qualifies) {
        console.log('Ooooh, so sorry, no NFT for you')
        return
    }
    console.log('--=| User qualifies! |=--')
    const verificationUrl = getVerifyUrl(userId)

    const spinWhile = async (promise, text, after) => {
        const spinner = ora({ text, spinner: spinners.point, color: 'red' }).start()
        await promise
        spinner.succeed(after)
    }

    await spinWhile(generateAssets(verificationUrl), 'Assembling Assets for True Yeezy NFT', 'Assembled Assets for True Yeezy NFT')

    await spinWhile(exec(`${VERIFY_ASSETS_COMMAND} ${ASSETS_DIR}`), 'Verify assets (1/5)')
    await spinWhile(exec(`${UPLOAD_COMMAND} ${ASSETS_DIR}`), 'Upload assets (2/5)')
    await spinWhile(exec(COLLECT_COMMAND), 'Set collection (3/5)')
    await spinWhile(exec(VERIFY_UPLOAD_COMMAND), 'Verify upload (4/5)')
    let txId = null
    const mint = async () => {
        const output = await exec(MINT_COMMAND)
        // console.log(output)
        const regex = /mint_one_token finished ([A-Za-z0-9]+)/g
        txId = regex.exec(output)[1]
    }
    await spinWhile(mint(), 'Mint Badge NFT (5/5)')
    console.log('Transaction ID', txId)
    const mintId = await getMintId(txId)
    console.log('Mint Key', mintId)
    const results = { txId, mintId }
    fs.writeFileSync('./badge.json', JSON.stringify(results))
    // exec(`open https://explorer.solana.com/address/${mintId}?cluster=devnet`)
}

program
    .requiredOption('-i, --id <userId>', 'the ID of the user')
    .action(run)

await program.parseAsync()