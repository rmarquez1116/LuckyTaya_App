'use server';
import crypto from 'crypto';
import fs from 'fs';

// Reading keys from files.
const privateKey = fs.readFileSync('./key/Private.key')
// const publicKey = fs.readFileSync('./Key/Public.key','utf8')
// const sppublicKey = fs.readFileSync('./Key/SP_Public.key','utf8')

const sha256withRSAsign = (stringtoencrypt = '')=> {
    const data = Buffer.from(stringtoencrypt)
    const signature = crypto.sign('RSA-SHA256', data, privateKey).toString("base64");
    console.log("Signing done", signature);

    return signature
}

// exports.sha256withRSAverify = (stringtoencrypt = '', signature = '') => {
//     const data = Buffer.from(stringtoencrypt)


//     const dt = Buffer.from(`{"msgId":"12341","mchId":"101570000003","notifyUrl":"http://localhost:8080/notify","deviceInfo":"One United Mapua","trxAmount":"555","currency":"PHP","service":"pay.starpay.repayment","timeStart":"20240513172537","timeExpire":"20240513192537"}`)
//     const verify = crypto.verify('RSA-SHA256', dt, sppublicKey, Buffer.from('YaVrEMLWAPF3csBJTD38I/uPJAizzeGtnkbUSdbHlsTN0Yu65Wl/N32bZbbrrPlFbm+VvmYmy/aIAsrBaNcSczOSptWDMisFrg6X8uhI/Ba7kRjsozoAP/wRLmrVfUOAlaapVf90DxAdyw22471S5WaJXzXUZi2BeBMamyaD1XLXh0/bNowaGLLFkWUlkNB+co3Ih2qxMp0SiOHNSJgOL7wI4eM2lW79PgS0ngpVge3yR02fQhgRNmmg1FsTmVoMo/b61tF8hU1Z8mo6LQgP1tzguJ4KAoZFGjfGkpflHqY3JlzDY+9KZqUks6JUj6oYmppePKVygIKiI9aMyh25og==', "base64"));
//     console.log("verfy done", verify);

//     return 'encryptedData.toString("base64");'
// }

export {sha256withRSAsign}