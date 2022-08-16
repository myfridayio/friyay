
import { program } from 'commander'
import { exec as execSync } from 'child_process'
import images from 'images'
import fs from 'fs'
import path from 'path'

const ASSETS_DIR = './assets/NFT1'
const KANYE_IMAGE = './kanye.png'
const QR_IMAGE = './qr.png'
const STEPZEN_API_KEY = "saopedro::stepzen.net+1000::5c45e0f566f813a29c8d7846ed6b860bbec36a4eb91b1cabb42c681ddb25c685"


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

const generateQRCode = async (verificationUrl) => {
    const command = `qrencode -s 9 -l H -o ${QR_IMAGE} ${verificationUrl}`
    await exec(command)
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

    console.log('Generating Assets...')
    generateAssets(verificationUrl)

    console.log('Verifying assets (1/5)')
    await exec('yarn candy:verifyAssets')
    console.log('Uploading assets (2/5)')
    await exec('yarn candy:upload -rcm')
    console.log('Setting collection (3/5)')
    await exec('yarn candy:collect')
    console.log('Verifying upload (4/5)')
    await exec('yarn candy:verifyUpload')
    console.log('Minting Badge NFT (5/5)')
    const output = await exec('yarn candy:mintOne')
    const regex = /mint_one_token finished ([A-Za-z0-9]+)/g
    const nftKey = regex.exec(output)[1]
    console.log('NFT generated with key', nftKey)
}

program
    .requiredOption('-i, --id <userId>', 'the ID of the user')
    .action(run)

await program.parseAsync()