"use server";

import { z } from "zod";
import { fetchData, saveData, updateData } from "../helpers/DB";
import { cookies } from "next/headers";

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
    return { success: true };

}



export async function getProfile() {

    const cookieStore = await cookies()
    var session = cookieStore.get('session');

    session = JSON.parse(session.value);
    const user = (await fetchData('taya_user', { "userId": { $eq: session.userId } }))[0]

    return user;
}
