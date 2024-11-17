'use server';
import crypto from 'crypto';
import fs from 'fs';
// Reading keys from files.
const privateKey = fs.readFileSync('./key/Private.key')
const publicKey = fs.readFileSync('./key/Public.key', 'utf8')
const sppublicKey = fs.readFileSync('./key/SP_Public.key', 'utf8')
const SECRET_PASSKEY = process.env.SECRET_PASSKEY;
const AES = require('crypto-js/aes')

const sha256withRSAsign = (stringtoencrypt = '') => {
    const data = Buffer.from(stringtoencrypt)
    const signature = crypto.sign('RSA-SHA256', data, privateKey).toString("base64");
    console.log("Signing done", signature);

    return signature
}

const sha256withRSAverify = (stringtoencrypt = '', signature = '') => {
    const data = Buffer.from(stringtoencrypt)

    const verify = crypto.verify(
        'RSA-SHA256',
        data,
        sppublicKey,
        Buffer.from(signature, 'base64')
    );
    // console.log(stringtoencrypt)
    return verify
}



const encrypt = (message) => {
    return AES.encrypt(message, SECRET_PASSKEY).toString()
}

const decrypt = (encryptedMessage) => {
    const bytes = AES.decrypt(encryptedMessage, SECRET_PASSKEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

export { sha256withRSAsign, sha256withRSAverify,encrypt,decrypt }