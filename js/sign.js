import web3 from '@solana/web3.js'
import fs from 'fs'
import nacl from 'tweetnacl'
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8'
import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64'

const keyData = new Uint8Array(JSON.parse(fs.readFileSync('brand/keypair.json')))

const keypair = web3.Keypair.fromSecretKey(keyData)
const { mintId } = JSON.parse(fs.readFileSync('license.json'))
const message = encodeUTF8(mintId)
const rawSignature = nacl.sign(message, keypair.secretKey)
const signature = encodeBase64(rawSignature)
const bearerToken = `${mintId}:${signature}`
console.log(`Bearer Token ${bearerToken}`)
fs.writeFileSync('./bearer.token', bearerToken)

// const round = nacl.sign.open(sig, keypair.publicKey.toBytes())
// console.log(round)
// if (true) {

// }
// console.log(decodeUTF8(round))
