"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";

export async function getTransactionsByDate(dateFrom, dateTo) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {

        console.log(session.value, 'hello2')
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/xAccountTransaction/GetTransByUserIdByDateV2?dateTimeFrom=${dateFrom}&dateTime=${dateTo}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        console.log(response, 'hello');
        if (response.status == 200) {
            return response.data;
        } else return [];
    } catch (error) {
        console.log(error, 'hello')
        return [];
    }
}

export async function cashIn(amount) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        const request = {
            amount,
            toAccountNumber: session.accountNumber
        }
        var url = `${process.env.BASE_URL}/api/v1/Account/cashIn`

        const response = await axios.post(url, request, {
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        console.log(response, 'hello');
        if (response.status == 200) {
            return response.data;
        } else return [];
    } catch (error) {
        console.log(error, 'hello')
        return [];
    }
}



export async function cashOut(dateFrom, dateTo) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {

        console.log(session.value, 'hello2')
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/xAccountTransaction/GetTransByUserIdByDateV2?dateTimeFrom=${dateFrom}&dateTime=${dateTo}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        console.log(response, 'hello');
        if (response.status == 200) {
            return response.data;
        } else return [];
    } catch (error) {
        console.log(error, 'hello')
        return [];
    }
}
