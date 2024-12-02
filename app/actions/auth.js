"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import axios from "axios";
import { Agent } from "https";
import { redirect } from "next/navigation";
import { forgotPasswordSchema, loginSchema } from "../forms/schema";


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
            const expiration = new Date(token.exp * 1000)
            
            cookieStore.set("app_session", JSON.stringify(response.data), {
                httpOnly: true,
                secure: process.env.NEXT_PUBLIC_PRODUCTION_ENV == 'production',
                expires: expiration,
                sameSite: 'Strict'
            });
            isSuccess = true
            return true;
        }
    } catch (e) {
        console.log(e,'----')
        const errorMessages = e.response.data.error
        var errorMesssagees = ''
        if (errorMessages) {
            if (errorMessagees['Not found']) {
                errorMesssagees = errorMessages['Not found'][0]
            } else if (errorMessages['Bad request']) {
                errorMesssagees = errorMessages['Bad request'][0]
            } else if (errorMessages['Unexpexted Error']) {
                errorMesssagees = errorMessages['Unexpexted Error'][0]
            } else {
                errorMesssagees = 'Login Failed'
            }
        }
        else {
                errorMesssagees = 'Login Failed'
        }
        return {
            errors: {
                username: [errorMesssagees],
            },
        };
    }
    return {
        errors: {
            username: ["Invalid email or password"],
        },
    };
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("app_session");
    redirect('/login')
}



export async function getAccountDetails(fightId, amount, side) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
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
        } else if (response.status == 401){
            logout()
        };
    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}
export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get("app_session")
    if (!session) {
        logout()
    } else {
        return JSON.parse(session.value);
    }
}


export async function forgotPassword(prevState, formData) {
    var isSuccess = false;
    const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }
    const { username } = result.data;
    const request = { username };
    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
    try {
        const response = await axios.get(`${process.env.BASE_URL}/api/v1/User/ForgotPassword/V2?username=${request.username}`, {

            headers: {
                "Content-Type": "application/json",
            }
            , httpsAgent
        })
        if (response.status == 200) {

            return true;
        }
    } catch (e) {
        console.log(e,'----')
        const errorMessages = e.response.data.error
        var errorMesssagees = ''
        if (errorMessages) {
            if (errorMessagees['Not found']) {
                errorMesssagees = errorMessages['Not found'][0]
            } else if (errorMessages['Bad request']) {
                errorMesssagees = errorMessages['Bad request'][0]
            } else if (errorMessages['Unexpexted Error']) {
                errorMesssagees = errorMessages['Unexpexted Error'][0]
            } else {
                errorMesssagees = 'Oops, Something went wrong'
            }
        }
        else {
                errorMesssagees = 'Oops, Something went wrong'
        }
        return {
            errors: {
                username: [errorMesssagees],
            },
        };
    }
    return {
        errors: {
            username: ["Invalid UserName"],
        },
    };
}
