"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";
import { fetchData } from "../helpers/DB";

export async function getTransactionsByDate({ dateFrom, dateTo, isBettingHistory }) {


    // const now = new Date();

    // const dateFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    // const dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

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
            const data = processTransaction(response.data, dateFrom, dateTo, session.accountNumber, isBettingHistory)

            return data;
        } else if (response.status == 401) {
            logout()
        } return [];
    } catch (error) {
        if (error.status == 401) {
            logout()
        }
        return [];
    }
}

async function processTransaction(serverData, dateFrom, dateTo, accountNumber, isBettingHistory) {
    const query = {
        $and: [{
            $or: [{ accountNumber: { $eq: accountNumber } },
            { accountNumber: { $eq: accountNumber.toString() } }
            ]
        },
        {
            transactionDate: { $gte: dateFrom, $lte: dateTo },
        },
        {
            status: { $eq: "Completed" }
        }
        ]
    }

    const dbData = await fetchData('qr_transactions', query)
    const processedDataFromDB = []
    if (!isBettingHistory)
        for (let index = 0; index < dbData.length; index++) {
            const element = dbData[index];
            if (element.masterToFee)
                processedDataFromDB.push({ ...element.masterToFee, transactionType: "Fee", transCategoryDesc: "Out" })
            if (element.masterToPlayer)
                processedDataFromDB.push({ ...element.masterToPlayer, transactionType: "Transfer", transCategoryDesc: "In" })
            if (element.agentToAgentPlayer)
                processedDataFromDB.push({ ...element.agentToAgentPlayer, transactionType: "Transfer", transCategoryDesc: "In" })
            if (element.agentToFee)
                processedDataFromDB.push({ ...element.agentToFee, transactionType: "Fee", transCategoryDesc: "Out" })
        }

    if (isBettingHistory)
        serverData = serverData.filter(x => x.transactionDesc != 'Transfer')
    let mergedArray = ([...serverData, ...processedDataFromDB])
        .reduce((acc, current) => {
            // Check if the id already exists in the accumulator
            if (!acc.some(item => item.transactionNumber === current.transactionNumber)) {
                acc.push(current);
            }
            return acc;
        }, [])
        .sort((a, b) => new Date(b.transactionDateTime) - new Date(a.transactionDateTime));


    mergedArray = mergedArray.map((e) => {
        return {
            ...e,
            fromFullName: `${e.fromFirstname} ${e.fromLastname}`,
            toFullName: `${e.toFirstname} ${e.toLastname}`
        }
    })

    return mergedArray
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



export async function transferV2(request, token) {

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