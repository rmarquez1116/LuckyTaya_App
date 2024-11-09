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
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/User/Login`, request, {

            headers: {
                "Content-Type": "application/json",
            }
            , httpsAgent
        })
        if (response.status == 200) {

            const cookieStore = await cookies()
            var token = response.data.token;
            token = token.split('.')[1];
            token = atob(token)
            console.log(token, 'helloo')
            const expiration = new Date(token.exp * 1000)


            cookieStore.set("session", JSON.stringify(response.data), {
                httpOnly: true,
                secure: true,
                expires: expiration,
                sameSite: 'Strict'
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
    if (isSuccess) {
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



export async function getAccountDetails(fightId, amount, side) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/UserAccount/MyAccount`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        if (response.status == 200) {
            return response.data
        } else return null;
    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}
export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")
    if (!session) {
        logout()
    } else {
        return JSON.parse(session.value);
    }
}