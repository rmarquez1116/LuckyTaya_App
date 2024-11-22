"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";
import { isJsonEmpty } from "../lib/utils";
import { logout } from "./auth";

export async function getFightSchedule() {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        var types = await getSabongEventStatus();
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongEvent/V2`

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
        } else if (response.status == 401) {
            logout()
        } return [];
    } catch (error) {
        console.log(error, 'Error')
        return [];
    }
}

const getDataStatus = (item, types) => {
    var a = types.find(x => x.code == item.eventStatusCode);
    if (!a) { return "" }
    return a.name;
}


export async function getSabongEventStatus() {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
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
    var session = cookieStore.get('app_session');
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




export async function getLastFightDetailsByEvent(eventId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight/GetLastFightNum/${eventId}`

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
            if (response.data) {
                var fightDetails = await getFightDetailsByFightId(response.data.fightId)
                return fightDetails
            }
            return null
        } else return null;
    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}



async function getFightStatus(status) {
    const cookieStore = await cookies()
    if (status == 22)
        return { code: 22, name: "Ended" }
    var session = cookieStore.get('app_session');
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
        if (error.status == 401) {
            logout()
        }
        return null;
    }
}


export async function getOpenOrClosedEvents() {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongEvent/V2/EventWithStatusOpen`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })

       
        return response.data
    } catch (error) {
        if (error.status == 401) {
            logout()
        }
        return null;
    }
}

export async function getOpenOrClosedFightEvents() {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight/V3/FightWithStatusOpenOrClosed`

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })

        console.log(response, '-statutts')
        if (response.status == 200) {

            const items = [];
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                const { fightId, eventId, fightStatusCode } = element
                var statusDesc = await getFightStatus(element.fight.fightStatusCode);
                element.fightStatus = statusDesc;
                items.push(element)
            }
            return items

        } else if (response.status == 401) {
            logout()
        } return null;
    } catch (error) {
        console.log(error,'hello')
        if (error.status == 401) {
            logout()
        }
        return null;
    }
}

export async function getLatestFight() {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var fightEvents = await getOpenOrClosedEvents();
        console.log(fightEvents,'----------')
        var response;
        if (fightEvents) {
            var eventId = 0;

            const events = fightEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

            const currentEvent = events.findIndex(x => (new Date(x.eventDate)).toLocaleDateString() == (new Date()).toLocaleDateString())

            if (currentEvent > -1) {
                eventId = events[currentEvent].eventId
            } else {
                eventId = events[0].eventId;
            }


            var url = `${process.env.BASE_URL}/api/v1/SabongFight/ByEventId/${eventId}`

            response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${session.token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: new Agent({
                    rejectUnauthorized: false
                })
            })
        }
        else {
            var url = `${process.env.BASE_URL}/api/v1/SabongFight/GetLastFightNum`

            response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${session.token}`,
                    "Content-Type": "application/json",
                },
                httpsAgent: new Agent({
                    rejectUnauthorized: false
                })
            })
        }
        if (response.status == 200) {
            var data;
            if (response.data instanceof Array) {
                data = [...response.data].reverse();
                var selectedIndex = -1
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if (element.fightStatusCode == 11) {
                        selectedIndex = index
                        break;
                    }else if (element.fightStatusCode == 10){
                        selectedIndex = index;
                        break;
                    }
                }
                if (selectedIndex > -1)
                    data = data[selectedIndex]
                else data = data[data.length - 1]
            }
            else data = response.data

            const { fightId, eventId, fightStatusCode } = data
            var statusDesc = await getFightStatus(fightStatusCode);
            // if (fightStatusCode == 10 || fightStatusCode == 11) {
            const fightDetails = await getFightDetailsByFightId(fightId)
            if (!isJsonEmpty(fightDetails))
                return { ...fightDetails, fight: data, fightStatus: statusDesc }
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
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongBet/PlaceBet`
        const request = {
            fightId, amount: Number.parseFloat(amount), side
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


export async function getEventTrend(eventId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFightResult/Trending/${eventId}`

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
                return response.data
            } catch (error) {
                return null
            }
        } else if (response.status == 401) {
            logout()
        }
        return null
    } catch (error) {
        console.log(error, 'Error')
        return [];
    }
}