import web3 from '@solana/web3.js'
import fs from 'fs'
import { encode } from 'base58-universal'
import nacl from 'tweetnacl'
import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64'
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8'
import './license.mjs'

const keyData = new Uint8Array(JSON.parse(fs.readFileSync('citizen/keypair.json')))
console.log('got', keyData)

const keypair = web3.Keypair.fromSecretKey(keyData)
console.log('keypair', keypair)
console.log('publicKey', keypair.publicKey)
console.log('publicKey b58', keypair.publicKey.toBase58())
console.log('publicKey b58', encode(keypair.publicKey.toBytes()))
console.log('secretKey b58', encode(keypair.secretKey))
console.log('secretKey b64', Buffer.from(keypair.secretKey).toString('base64'))
console.log('publicKey b64', keypair.publicKey.toBuffer().toString('base64'))
console.log('secretKey', keypair.secretKey)

//const messageString = 'Hello Friday'
const {mintId} = JSON.parse(fs.readFileSync('license.json'))
const message = encodeUTF8(mintId)
console.log('Encrypted mintId', message)
const sig = nacl.sign(message, keypair.secretKey)
console.log('sig', sig)
const round = nacl.sign.open(sig, keypair.publicKey.toBytes())
console.log(round)
console.log(decodeUTF8(round)) //decoding mintId from License NFT

//console.log(nacl.sign(nacl.util.decodeUTF8(message, keypair.secretKey)))