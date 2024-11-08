"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import { Agent } from "https";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
const registerSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Invalid Username" })
        .trim(),
    password: z
        .string()
        .min(1, { message: "Invalid Password" })
        .trim(),
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
    referralCode: z.string().optional(),
    re_password: z.string(),

}).refine((data) => (data.password === data.re_password)
    && (data.password != "" && data.re_password != ""), {
    message: "Passwords don't match",
    path: ["re_password"], // path of error
});

export async function register(prevState, formData) {
    var isSuccess = false;
    const result = registerSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
    try {
        const request = result.data
        delete request.re_password;
        request['facebookAccount'] = "";
        request.referralCode = request.referralCode == "" ? 0 : request.referralCode
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/User/Register`, request, { httpsAgent })
        if (response.status >= 200 && response.status <=300) {

            const cookieStore = await cookies()
            cookieStore.set("session", JSON.stringify(response.data), {
                httpOnly: true,
                secure: true,
            });
            isSuccess = true
        }else{
            return {
                errors: {
                    referralCode: ["Can't Process your Request"],
                },
            };
        }
    } catch (error) {
        console.log(error, 'Error')

        return {
            errors: {
                referralCode: ["Can't Process your request"],
            },
        };
    }
    if (isSuccess) {
        redirect("/");
    }
    return {
        errors: {
            username: ["Invalid email or password"],
        },
    };
}
