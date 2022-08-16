
import { program } from 'commander'
import { exec as execSync } from 'child_process'
import images from 'images'
import fs from 'fs'
import path from 'path'
import ora from 'ora'
import spinners from 'cli-spinners'

const ASSETS_DIR = './assets/NFT2'
const QR_IMAGE = './assets/NFT2/0.png'
const STEPZEN_API_KEY = "saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685"
const KEY_PATH = '~/.config/solana/id.json'


const VERIFY_ASSETS_COMMAND = "ts-node ./packages/cli/src/candy-machine-v2-cli.ts verify_assets"
const UPLOAD_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts upload -rcm -e devnet -k ${KEY_PATH} -cp ./packages/cli/example-candy-machine-upload-config.json -c example`
const COLLECT_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts set_collection -e devnet -k ${KEY_PATH} -c example`
const VERIFY_UPLOAD_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts verify_upload -e devnet -k ${KEY_PATH} -c example`
const MINT_COMMAND = `ts-node ./packages/cli/src/candy-machine-v2-cli.ts mint_one_token -e devnet -k ${KEY_PATH} -c example`
const {mintId} = JSON.parse(fs.readFileSync('badge.json'))

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

const getVerifyUrl = (userId) => {
    const encode = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    const query = `{getHistoryById(id: "${userId}") { KanyeSpotify FollowsKanye JeenYuhs userId } }`
    return 'https://saopedro.stepzen.net/api/orange-bee/__graphql?query=' + encode(query);
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
            mintId,
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

//  const generateAssetImage = async (verificationUrl) => {
//      await generateQRCode(verificationUrl)
//      const imagePath = path.join(ASSETS_DIR, '1.png')
// }

   const generateAssets = async (verificationUrl) => {
       generateAssetJSON(verificationUrl)
       //await generateAssetImage(verificationUrl, mintId)
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
    console.log('Assembling Assets for License NFT...')
    const qualifies = await isTrueYeezy(userId)
    if (!qualifies) {
        console.log('Ooooh, so sorry, no NFT for you')
        return
    }
    console.log('--=| User qualifies! |=--')
    const verificationUrl = getVerifyUrl(userId)

    console.log('Generating Assets...')
    generateAssets(verificationUrl)

    const spinWhile = async (promise, text) => {
        const spinner = ora({ text, spinner: spinners.point, color: 'red' }).start()
        await promise
        spinner.succeed()
    }

    await spinWhile(exec(`${VERIFY_ASSETS_COMMAND} ${ASSETS_DIR}`), 'Verify assets (1/5)')
    await spinWhile(exec(`${UPLOAD_COMMAND} ${ASSETS_DIR}`), 'Upload assets (2/5)')
    await spinWhile(exec(COLLECT_COMMAND), 'Set collection (3/5)')
    await spinWhile(exec(VERIFY_UPLOAD_COMMAND), 'Verify upload (4/5)')
    let nftKey = null
    const mint = async () => {
        const output = await exec(MINT_COMMAND)
        //console.log(output)
        const regex = /mint_one_token finished ([A-Za-z0-9]+)/g
        nftKey = regex.exec(output)[1]
    }
    await spinWhile(mint(), 'Minting License NFT (4/5)', 'Minted License (4/5)')
    console.log('NFT Key', nftKey)
    //exec(`open https://explorer.solana.com/address/${mintId}?cluster=devnet`)
}

program
    .requiredOption('-i, --id <userId>', 'the ID of the user')
    .action(run)

await program.parseAsync()