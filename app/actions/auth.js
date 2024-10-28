"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import { Agent } from "https";

const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Invalid Username" })
        .trim(),
    password: z
        .string()
        .min(1, { message: "Invalid Password" })
        .trim(),
});

export async function login(prevState, formData) {
    var isSuccess = false;
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }
    const { username, password } = result.data;
    const request = { username, password };
    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
    try {
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/User/Login`, request, { httpsAgent })
        if (response.status == 200) {

            const cookieStore = await cookies()
            cookieStore.set("session", JSON.stringify(response.data), {
                httpOnly: true,
                secure: true,
            });
            isSuccess = true
        }
    } catch (error) {
        return {
            errors: {
                username: ["Invalid email or password"],
            },
        };
    }
    if(isSuccess){
        redirect("/");
    }
    return {
        errors: {
            username: ["Invalid email or password"],
        },
    };
}

export async function logout() {

    await cookies().delete("session");
    redirect("/login");
}

export async function getSession(){
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if(!session){
        logout()
    }else{
        return JSON.parse(session.value);
    }
}