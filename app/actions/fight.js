"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";
import { isJsonEmpty } from "../lib/utils";

export async function getFightSchedule() {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        var types = await getSabongEventStatus();
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight`

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
            var responseWithStatus = response.data.map(item => ({
                ...item,
                statusDesc: getDataStatus(item, types)
            }))
            return responseWithStatus;
        } else return [];
    } catch (error) {
        console.log(error, 'Error')
        return [];
    }
}

const getDataStatus = (item, types) => {
    var a = types.find(x => x.code == item.fightStatusCode);
    if (!a) { return "" }
    return a.name;
}


export async function getSabongEventStatus() {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {

        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongEventStatus`

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
        return [];
    }
}



export async function getFightDetailsByFightId(fightId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight/WithDetails/V2/${fightId}`

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


async function getFightStatus(status) {
    const cookieStore = await cookies()
    if(status == 22)
        return {code :22, name :"Ended"}
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFightStatus/${status}`

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

export async function getLatestFight() {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight/GetLastFightNum`

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
            const { fightId, eventId, fightStatusCode } = response.data
            var statusDesc = await getFightStatus(fightStatusCode);
            // if (fightStatusCode == 10 || fightStatusCode == 11) {
                const fightDetails = await getFightDetailsByFightId(fightId)
                if (!isJsonEmpty(fightDetails))
                    return { ...fightDetails, fightStatus: statusDesc }
            // }
            return null;

        } else return null;
    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}


export async function placeABet(fightId, amount, side) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongBet/PlaceBet`
        const request = {
            fightId, amount : Number.parseFloat(amount), side
        }
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
            return response.data
        } else return null;
    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}