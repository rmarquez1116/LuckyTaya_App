"use server";

import { z } from "zod";
import { fetchData, saveData, updateData } from "../helpers/DB";
import { cookies } from "next/headers";
import { encrypt } from "../helpers/Crypto";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const profileSchema = z.object({

    phoneNumber: z.string().regex(phoneRegex, 'Invalid Mobile Number'),
    email: z.string().email({ message: "Invalid email address" }).trim(),

    firstname: z
        .string()
        .min(1, { message: "Invalid First Name" })
        .trim(),

    lastname: z
        .string()
        .min(1, { message: "Invalid Last Name" })
        .trim(),

    birthdate: z.string(),
    region: z.string(),
    province: z.string(),
    city: z.string(),
    barangay: z.string(),

}).refine((data) => (data.password === data.re_password)
    && (data.password != "" && data.re_password != ""), {
    message: "Passwords don't match",
    path: ["re_password"], // path of error
});


const pinSchema = z.object({

    pin: z
        .string()
        .min(6, { message: "Pin should be 6 characters" })
        .max(6, { message: "Pin should be 6 characters" })
        .trim(),

}).refine((data) => (data.pin === data.re_pin)
    && (data.pin != "" && data.re_pin != ""), {
    message: "Pin don't match",
    path: ["re_pin"], // path of error
});


export async function profile(prevState, formData) {
    const result = profileSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const request = result.data

    const cookieStore = await cookies()
    var session = cookieStore.get('session');

    session = JSON.parse(session.value);

    const updateResult = await updateData('taya_user', { 'userId': { $eq: session.userId } }, request);
    console.log({ updateResult, request })
    return { success: true };

}



export async function getProfile() {

    const cookieStore = await cookies()
    var session = cookieStore.get('session');

    session = JSON.parse(session.value);
    const user = (await fetchData('taya_user', { "userId": { $eq: session.userId } }))[0]
    if (!user) {
        const user1 = Object.assign({}, session);
        delete user1.token
        return user1
    }
    return user;
}



export async function nominatePin(pin) {
    try {

        const cookieStore = await cookies()
        var session = cookieStore.get('session');

        session = JSON.parse(session.value);
        const user = (await fetchData('taya_user', { "userId": { $eq: session.userId } }))[0]
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
