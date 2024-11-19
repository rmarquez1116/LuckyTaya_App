'use server'
import { fetchData, saveData, updateData } from "../helpers/DB";
import { cookies } from "next/headers";
import { decrypt, encrypt } from "../helpers/Crypto";

export async function nominatePin(pin) {
    try {

        const cookieStore = await cookies()
        var session = cookieStore.get('session');

        session = JSON.parse(session.value);
        const user = (await fetchData('taya_user', { "userId": { $eq: session.userId } }))[0]
        console.log(user,'--------')
        if (user) {
            user.pin = encrypt(pin)
            await updateData('taya_user', { "userId": { $eq: session.userId } }, user);
        } else {
            var newUser = session;
            newUser.pin = (encrypt(pin))
            delete newUser.token;
            await saveData('taya_user', newUser)
        }
    } catch (error) {
        console.log(error, '----------')
    }
    return true;
}



export async function validateMpin(pin) {
  
       try {
        const cookieStore = await cookies()
        var session = cookieStore.get('session');

        session = JSON.parse(session.value);
        const user = (await fetchData('taya_user', { "userId": { $eq: session.userId } }))[0]

        if (user) {
            const verifyPin = decrypt(user.pin);
            return  1234 == pin
        } else {
            return false;
        }
       } catch (error) {
        return false
       }
}