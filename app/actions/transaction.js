"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";

export async function getTransactionsByDate() {

    
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var dateFrom = new Date(y, m, 1).toISOString();
    var dateTo = new Date(y, m + 1, 0).toISOString();
    console.log({dateFrom,dateTo},'-----------transactiondate')
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {

        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/xAccountTransaction/GetTransByUserIdByDateV2?dateTimeFrom=${dateFrom}&dateTimeTo=${dateTo}`
 
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        // console.log(dateFrom,dateTo,url,response.data, 'hello');
        if (response.status == 200) {
            return response.data;
        } else return [];
    } catch (error) {
        console.log(error, 'Error')
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
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        if (response.status == 200) {
            return response.data;
        } else return [];
    } catch (error) {
        console.log(error, 'Error')
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

        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/xAccountTransaction/GetTransByUserIdByDateV2?dateTimeFrom=${dateFrom}&dateTime=${dateTo}`

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
            return response.data;
        } else return [];
    } catch (error) {
        console.log(error, 'Error')
        return [];
    }
}



export async function transferV2(request,token) {

    try {
        var url = `${process.env.BASE_URL}/api/v1/Account/transferV2?amount=${request.amount}&toAccountNumber=${request.accountNumber}`
 
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        if (response.status == 200) {
            return response.data;
        } else return null;
    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}