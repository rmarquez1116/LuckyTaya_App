"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";
import { isJsonEmpty } from "../lib/utils";

export async function getInitialBetDetails(fightId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/WsMessaging/GetBetRegister?fightId=${fightId}`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        if (response.status == 200) {
            try {
                return JSON.parse(response.data.jsonPacket)
            } catch (error) {
                return null
            }
        } else return [];
    } catch (error) {
        console.log(error, 'Error')
        return [];
    }
}

