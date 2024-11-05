"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";

export async function getFightSchedule() {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        var types = await getSabongEventStatus();
        console.log(session.value, 'hello2')
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        if (response.status == 200) {
            var responseWithStatus = response.data.map(item =>({
                ...item,
                statusDesc : getDataStatus(item,types)
            }))
            return responseWithStatus;
        } else return [];
    } catch (error) {
        console.log(error, 'hello')
        return [];
    }
}

const getDataStatus = (item,types)=>{
    var a = types.find(x=>x.code == item.fightStatusCode);
    if(!a){return ""}
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
                Authorization: `Bearer ${session.token}`
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
