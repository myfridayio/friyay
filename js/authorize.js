import web3 from '@solana/web3.js'
import fs from 'fs'
import nacl from 'tweetnacl'
import { decode as decodeUTF8, encode as encodeUTF8 } from '@stablelib/utf8'
import { decode as decodeBase64, encode as encodeBase64 } from '@stablelib/base64'

const token = fs.readFileSync('bearer.token').toString()

const keyData = new Uint8Array(JSON.parse(fs.readFileSync('brand/keypair.json')))

const keypair = web3.Keypair.fromSecretKey(keyData)

const [ mintId, signature ] = token.split(':')

const rawSignature = decodeBase64(signature)
const decrypted = decodeUTF8(nacl.sign.open(rawSignature, keypair.publicKey.toBytes()))
if (decrypted === mintId) {
    console.log('VALID AUTHORIZATION TOKEN')
} else {
    console.log(decrypted, '!=')
    console.log('INVALID AUTHORIZATION TOKEN')
}
