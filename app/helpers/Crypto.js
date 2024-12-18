'use server';
import crypto from 'crypto';
import fs from 'fs';
// Reading keys from files.
const privateKey = fs.readFileSync('./key/Private.key')
const publicKey = fs.readFileSync('./key/Public.key', 'utf8')
const sppublicKey = fs.readFileSync('./key/SP_Public.key', 'utf8')
const SECRET_PASSKEY = process.env.SECRET_PASSKEY;
const CryptoJS = require("crypto-js");

const sha256withRSAsign = (stringtoencrypt = '') => {
    const data = Buffer.from(stringtoencrypt)
    const signature = crypto.sign('RSA-SHA256', data, privateKey).toString("base64");
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
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(SECRET_PASSKEY), iv); // AES-256-CBC
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Return both the IV and encrypted data (since the IV is needed for decryption)
    return { iv: iv.toString('hex'), encryptedData: encrypted };
}

const decrypt = (pin) => {
    const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(SECRET_PASSKEY), Buffer.from(pin.iv, 'hex'));
    let decrypted = decipher.update(pin.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export { sha256withRSAsign, sha256withRSAverify, encrypt, decrypt }