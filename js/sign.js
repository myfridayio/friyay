import web3 from '@solana/web3.js'
import fs from 'fs'
import nacl from 'tweetnacl'
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8'

const keyData = new Uint8Array(JSON.parse(fs.readFileSync('brand/keypair.json')))
console.log('got', keyData)

const keypair = web3.Keypair.fromSecretKey(keyData)
const { mintId } = JSON.parse(fs.readFileSync('license.json'))
const message = encodeUTF8(mintId)
console.log('Encrypted mintId', message)
const sig = nacl.sign(message, keypair.secretKey)
console.log('sig', sig)
const round = nacl.sign.open(sig, keypair.publicKey.toBytes())
console.log(round)
console.log(decodeUTF8(round))
