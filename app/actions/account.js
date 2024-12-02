"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axios from "axios";
import { Agent } from "https";
import { fetchData, saveData } from "../helpers/DB";
import { calculateAge } from "../lib/utils";
import { changePasswordSchema,registerSchema } from "../forms/schema";


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
        request['referralCode'] = 0;
        // request.referralCode = request.referralCode == "" ? 0 : request.referralCode
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
        const query = { username: { $eq: request.username } }
        const existingPlayer = await fetchData('taya_user', query)
        if (existingPlayer.length > 0) {
            return {
                errors: {
                    alert: ["Data already exists"],
                },
            };
        }
        const age = calculateAge(request.birthdate)
        if(age <18){
            return {
                errors: {
                    alert: ["Can't proceed with registration. You must be 18 years old and above"],
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
            return {
                errors: {
                    alert: ["Can't Process your Request"],
                },
            };
        }
    } catch (e) {
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
                errorMesssagees = 'Oops! something went wrong'
            }
        }
        else {
            errorMesssagees = 'Oops! something went wrong'
        }
        return {
            errors: {
                alert: [errorMesssagees],
            },
        };
    }
    if (isSuccess) {
        request.userId = responseData.userId;
        request.accountNumber = responseData.accountNumber
        await saveData('taya_user', request)

        await processLogin({ username: request.username, password: request.password })
        redirect("/");
    }
    return {
        errors: {
            username: ["Invalid email or password"],
        },
    };
}



async function processLogin(request) {
    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
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
        return true;
    }
    return false;
}


export async function changePassword(prevState, formData) {
    var isSuccess = false;
    var responseData = null;
    const result = changePasswordSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const httpsAgent = new Agent({
        rejectUnauthorized: false
    })
    const request = result.data
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);
        delete request.password;
        console.log(request,'hello-')
        const response = await axios.post(`${process.env.BASE_URL}/api/v1/User/ChangePassword/V3`, request, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`,
            },
            httpsAgent
        })
        if (response.status >= 200 && response.status <= 300) {
            return {success :true}
        } else {
            return {
                errors: {
                    alert: ["Can't Process your Request"],
                },
            };
        }
    } catch (e) {
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
                errorMesssagees = 'Oops! something went wrong'
            }
        }
        else {
            errorMesssagees = 'Oops! something went wrong'
        }
        return {
            errors: {
                alert: [errorMesssagees],
            },
        };
    }
    return {
        errors: {
            username: ["Invalid email or password"],
        },
    };
}