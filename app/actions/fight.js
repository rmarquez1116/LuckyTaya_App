"use server";
import axios from "axios";
import { Agent } from "https";
import { cookies } from "next/headers";
import { isJsonEmpty } from "../lib/utils";
import { logout } from "./auth";
import { map } from "zod";
import { fetchData } from "@app/helpers/DB";

export async function getFightSchedule() {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);
        var types = await getSabongEventStatus();

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


export async function getFightDetailsByEventId(eventId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {

        const results = await getWinnerDetailsByEvent(eventId)

        const fights = await getFightWithDetailsByEventIdV2(eventId)

        const fightWithResult = (getFightResult(results, fights))

        return fightWithResult
    } catch (error) {
        console.log(error, '-----error-')

        if (error.status == 401) {
            logout()
        }
        return null;
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


export async function getOpenOrClosedEventsV2() {
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

        const data = []

        let events = response.data.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        events = events.filter(x => (new Date(x.eventDate)).toLocaleDateString() == (new Date()).toLocaleDateString())
        console.log(response.data,(new Date()).toLocaleDateString())
        for (let index = 0; index < events.length; index++) {
            const element = events[index];
            const venue = await getVenueById(element.venueId)
            const eventStatus = await getEventStatusById(element.eventStatusCode)
            data.push({
                event: element,
                venue: venue,
                eventStatus: eventStatus
            })
        }


        return data
    } catch (error) {
        console.log(error, 'hello')
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

        const data = []
        for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            const venue = await getVenueById(element.venueId)
            const eventStatus = await getEventStatusById(element.eventStatusCode)
            data.push({
                event: element,
                venue: venue,
                eventStatus: eventStatus
            })
        }


        return data
    } catch (error) {
        if (error.status == 401) {
            logout()
        }
        return null;
    }
}

export async function getOpenOrClosedEventsWithFightDetails() {
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

        let data = [];
        for (let index = 0; index < response.data.length; index++) {
            const element = response.data[index];
            const results = await getWinnerDetailsByEvent(element.eventId)

            const fights = await getFightWithDetailsByEventIdV2(element.eventId)

            const fightWithResult = (getFightResult(results, fights))
            element.fights = fightWithResult

            data.push(element)
        }
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
        console.log(error, 'error')
        if (error.status == 401) {
            logout()
        }
        return null;
    }
}

export async function getLatestFight() {
    const cookieStore = await cookies()
    let webRtc = process.env.NEXT_PUBLIC_WEB_RTC_URL;
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var fightEvents = await getOpenOrClosedEvents();
        var response;
        if (fightEvents) {
            var eventId = 0;

            const events = fightEvents.sort((a, b) => new Date(b.event.eventDate) - new Date(a.event.eventDate));

            const currentEvent = events.findIndex(x => (new Date(x.event.eventDate)).toLocaleDateString() == (new Date()).toLocaleDateString())

            if (currentEvent > -1) {
                eventId = events[currentEvent].event.eventId
                if (events[currentEvent].webRtcStream)
                    webRtc = events[currentEvent].webRtcStream
            } else {
                eventId = events[0].event.eventId;
                if (events[0].webRtcStream)
                    webRtc = events[0].webRtcStream
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
                // data = [...response.data].reverse();
                data = response.data;
                var selectedIndex = -1
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if (element.fightStatusCode == 11) {
                        selectedIndex = index
                        break;
                    } else if (element.fightStatusCode == 10) {
                        selectedIndex = index;
                        break;
                    }

                }
                if (selectedIndex > -1)
                    data = data[selectedIndex]
                else data = data[data.length - 1]
            }
            else data = response.data
            if (data) {

                const { fightId, eventId, fightStatusCode } = data
                var statusDesc = await getFightStatus(fightStatusCode);
                // if (fightStatusCode == 10 || fightStatusCode == 11) {
                const fightDetails = await getFightDetailsByFightId(fightId)
                if (!isJsonEmpty(fightDetails)) {
                    const eventDate = new Date(fightDetails.event.eventDate);
                    const currentDate = new Date();
                    // Normalize the dates by setting their time to midnight
                    eventDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00
                    currentDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00
                    const config = (await fetchData('config', { "code": { $eq: "CFG0001" } }))[0]

                    if (config.environment == 'develop' || eventDate.getTime() === currentDate.getTime()) {
                        return { ...fightDetails, fight: data, fightStatus: statusDesc, webRtc }
                    } else {
                        return null;
                    }
                }
                // }
            }
            return null;

        } else return null;


    } catch (error) {
        console.log(error, 'Error')
        return null;
    }
}

export async function getLatestFightV2(event) {
    const cookieStore = await cookies()
    let webRtc = process.env.NEXT_PUBLIC_WEB_RTC_URL;
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var response;
        if (event) {
            var url = `${process.env.BASE_URL}/api/v1/SabongFight/ByEventId/${event.eventId}`
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
                // data = [...response.data].reverse();
                data = response.data;
                var selectedIndex = -1
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if (element.fightStatusCode == 11) {
                        selectedIndex = index
                        break;
                    } else if (element.fightStatusCode == 10) {
                        selectedIndex = index;
                        break;
                    }

                }
                if (selectedIndex > -1)
                    data = data[selectedIndex]
                else data = data[data.length - 1]
            }
            else data = response.data
            if (data) {

                const { fightId, eventId, fightStatusCode } = data
                var statusDesc = await getFightStatus(fightStatusCode);
                // if (fightStatusCode == 10 || fightStatusCode == 11) {
                const fightDetails = await getFightDetailsByFightId(fightId)
                if (!isJsonEmpty(fightDetails)) {
                    const eventDate = new Date(fightDetails.event.eventDate);
                    const currentDate = new Date();
                    // Normalize the dates by setting their time to midnight
                    eventDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00
                    currentDate.setHours(0, 0, 0, 0); // Reset the time to 00:00:00
                    const config = (await fetchData('config', { "code": { $eq: "CFG0001" } }))[0]

                    if (config.environment == 'develop' || eventDate.getTime() === currentDate.getTime()) {
                        return { ...fightDetails, fight: data, fightStatus: statusDesc, webRtc }
                    } else {
                        return null;
                    }
                }
                // }
            }
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

async function getWinnerDetailsByEvent(eventId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);
        var url = `${process.env.BASE_URL}/api/v1/SabongFightResult/GetByEventId/${eventId}`

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
        return []
    }
}


async function getFightWithDetailsByEventIdV2(eventId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url = `${process.env.BASE_URL}/api/v1/SabongFight/WithDetailsByEventIdV2/${eventId}`

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

async function getFightResult(results, fight) {
    const data = fight.map((item) => {
        const result = results.find(x => x.fightId == item.fight.fightId)
        return {
            ...item,
            winnerResult: result
        }
    })
    return data;
}

export async function getVenueById(venueId) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url1 = `${process.env.BASE_URL}/api/v1/SabongVenue/${venueId}`
        const venue = await axios.get(url1, {
            headers: {
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        return venue.data

    } catch (error) {
        console.log(error, '---------------')
        return {}
    }
}


export async function getEventStatusById(status) {
    const cookieStore = await cookies()
    var session = cookieStore.get('app_session');
    if (!session) {
        return redirect('/login')
    }
    try {
        session = JSON.parse(session.value);

        var url1 = `${process.env.BASE_URL}/api/v1/SabongEventStatus/${status}`
        const stats = await axios.get(url1, {
            headers: {
                Authorization: `Bearer ${session.token}`,
                "Content-Type": "application/json",
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false
            })
        })
        return stats.data

    } catch (error) {
        console.log(error, '---------------')
        return {}
    }
}