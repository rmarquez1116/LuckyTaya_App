'use server';
import crypto from 'crypto';
import fs from 'fs';

// Reading keys from files.
const privateKey = fs.readFileSync('./key/Private.key')
const publicKey = fs.readFileSync('./key/Public.key', 'utf8')
const sppublicKey = fs.readFileSync('./key/SP_Public.key', 'utf8')

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

export { sha256withRSAsign, sha256withRSAverify }