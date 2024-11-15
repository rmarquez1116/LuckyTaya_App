"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import { Agent } from "https";
import { fetchData, saveData } from "../helpers/DB";

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

export async function register(prevState, formData) {
    var isSuccess = false;
    var responseData = null;
    const result = registerSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
    const request = result.data
    try {
        delete request.re_password;
        request['facebookAccount'] = "";
        request.referralCode = request.referralCode == "" ? 0 : request.referralCode
        const sabongRequest = {
            username: request.username,
            password: request.password,
            firstname: request.firstname,
            lastname: request.lastname,
            phoneNumber: request.phoneNumber,
            email: request.email,
            facebookAccount: "",
            referralCode: request.referralCode
        }
        const query = {username: {$eq : request.username}}
        const existingPlayer =await fetchData('taya_user', query)
        if(existingPlayer.length > 0){
            return {
                errors: {
                    username: ["Data already exists"],
                },
            };
        }
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/User/Register`, sabongRequest, {
            headers: {
                "Content-Type": "application/json",
            },
            httpsAgent
        })
        if (response.status >= 200 && response.status <= 300) {
            responseData = Object.assign({}, response.data)
            isSuccess = true
        } else {
            console.log(response)
            return {
                errors: {
                    referralCode: ["Can't Process your Request"],
                },
            };
        }
    } catch (error) {

        return {
            errors: {
                referralCode: ["Can't Process your request"],
            },
        };
    }
    if (isSuccess) {
        request.userId = responseData.userId;
        request.accountNumber = responseData.accountNumber
        saveData('taya_user', request)
        redirect("/login");
    }
    return {
        errors: {
            username: ["Invalid email or password"],
        },
    };
}
