'use client'
import MainLayout from "../layout/mainLayout";
import BalanceHeader from '../components/balanceHeader'
import bg from '../../public/images/game-bg.png'
import MeronWala from "../components/meronWala";
import EventsModal from "../components/modal/eventsModal";
import BetModal from '../components/modal/betModal'

import React, { memo, useEffect, useRef, useState } from "react";
import BetConfirmation from "../components/modal/betConfirmation";
import Loading from "../components/loading";
import { getBetDetailsByPlayer, getEventDetailsDB, getEventTrend, getFightDetailsByEventId, getLatestFightV2, getOpenOrClosedEventsV2, placeABet } from "../actions/fight";
import { isJsonEmpty } from "../lib/utils";
import Alert from "../components/alert";
import { getInitialBetDetails } from "../actions/wsApi";
import WinnerModal from "../components/modal/winnerModal";
import { getToken } from "../helpers/StringGenerator";
import { useWebSocketContext } from '../context/webSocketContext';
import Trend from '../components/trend'
import ThreeManScore from '../components/threeManScore'
import SchedulePopUp from "../components/modal/schedulePopUp";
import Tabs from '../components/tab'
import Regla from '../components/regla'
import axios from "axios";
import { formatMoneyV2 } from "@app/helpers/Common";


function Game() {
    const { socket, messages, closeBet } = useWebSocketContext();

    const [betDetails, setBetDetails] = useState({
        fId: 0,
        s0c: 0,
        s0a: 0,
        s0o: 0,
        s1c: 0,
        s1a: 0,
        s1o: 0
    })

    const [betDetailsByPlayer, setBetDetailsByPlayer] = useState({
        s0Total: 0,
        s1Total: 0
    })


    // const [isShowPin, setIsShowPin] = useState(false)
    const [isSchedulePopUpOpen, setIsSchedulePopUpOpen] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [eventList, setEventList] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isEventListOpen, setIsEventListOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState(null)
    const [amountToBet, setAmountToBet] = useState({ type: 1, amount: 0 })
    const [modalObject, setModalObject] = useState({
        isOpen: false,
        type: 1
    })
    const iframeRef = useRef(null);
    const [feedConfig, setFeedConfig] = useState({
        isShowFeed: false,
        feedUrl: ""
    })

    const reloadIframe = () => {
        // Get the iframe element and reload it by resetting its src
        const iframe = iframeRef.current;
        if (iframe) {
            const src = iframe.src;
            iframe.src = ''; // Temporarily set the src to empty
            iframe.src = src; // Reset the src to the original URL
        }
    };

    const getFeedConfig = async () => {
        try {
            const response = await axios.get('/api/feed_config',)
            const { data } = response;
            const { details } = data
            setFeedConfig({
                isShowFeed: details.isShowFeed,
                feedUrl: details.feedUrl
            })
        } catch (error) {

            console.log(error, 'feed')
        }
    }

    useEffect(() => {
        if (closeBet) {
            getData()
        }
    }, [closeBet])

    const getBetDetailsPlayer = async () => {
        if (!isJsonEmpty(data))
            try {
                const betDetPlayers = await getBetDetailsByPlayer(data.fight.fightId)
                setBetDetailsByPlayer(betDetPlayers)
            } catch (error) {

            }
    }
    useEffect(() => {
        getBetDetailsPlayer()
    }, [betDetails])


    const [randomText, setRandomText] = useState("1234")
    const [trends, setTrends] = useState([])
    const [bettingEndedResult, setBettingEndedResult] = useState({
        winnerSide: -1,
        isOpen: false
    })
    const [showTrend, setShowTrend] = useState(false)

    const getFightSchedules = async (event) => {
        const response = await getFightDetailsByEventId(event.event.eventId)
        if (response) {
            const result = {
                ...event,
                fights: response
            }
            setSchedules(result)
        }
    }
    const getData = async (data = null) => {
        try {
            if (!data)
                data = selectedEvent;
            const details = await getEventDetailsDB(data.eventId)
            const response = await getLatestFightV2(data);
            if (response) {
                setData({ ...response, ...details });
                getFightSchedules(response)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoaded(true);
            reloadIframe()
        }
    }

    const [alert, setAlert] = useState({ hasTimer: false, timeout: 5000, isOpen: false, message: "", type: "success" })
    const [modalConfirmObject, setModalConfirmObject] = useState({
        isOpen: false,
        type: 1
    })
    const getBetDetails = async () => {
        const initialBetDetails = await getInitialBetDetails(data.fight.fightId);
        setBetDetails(initialBetDetails);

        const eventTrend = await getEventTrend(data.event.eventId);
        setTrends(eventTrend)
        setRandomText(getToken(4))
    }
    useEffect(() => {

        if (data) {
            getBetDetails();
            setShowTrend(data.fightStatus.name != "Open")
        }
    }, [data])



    useEffect(() => {
        try {
            // console.log({ messages }, 'socket Message')
            if (messages != null && !isJsonEmpty(data)) {
                const parseMessage = JSON.parse(messages)
                const betDetail = JSON.parse(parseMessage.jsonPacket)
                switch (parseMessage.PacketType) {
                    case 5:
                        try {
                            const betAmount = JSON.parse(parseMessage.jsonPacket)
                            const details = Object.assign({}, betDetails)
                            if (betAmount.Side == 1) {
                                details.s1a = Number.parseInt(details.s1a) + Number.parseInt(betAmount.Amount)
                            } else if (betAmount.Side == 0) {
                                details.s0a = Number.parseInt(details.s0a) + Number.parseInt(betAmount.Amount)
                            }
                            setBetDetails(details)
                            getBetDetails()
                        } catch (error) {
                            console.log(error, 'errooo')
                        }
                        break;

                    case 10:
                        if (data.fight.fightId == parseMessage.FightId &&
                            data.event.eventId == parseMessage.EventId) {
                            setBetDetails(betDetail)
                        }
                        break;
                    // last call
                    case 22:
                        setAlert({ hasTimer: true, timeout: 60000, isOpen: true, type: "info", message: "Last Call !!!" })
                        break;
                    // result

                    case 30:
                        setBettingEndedResult({ winnerSide: -1, isOpen: true })
                        break;
                    case 50:
                        const betResult = JSON.parse(parseMessage.jsonPacket)
                        setBettingEndedResult({ winnerSide: betResult.WinSide, isOpen: true })
                        if (betResult.WinSide == betResult.YourSide) {

                        } else {

                        }
                        break;
                    case 200:
                        getFeedConfig();
                        break;
                    default:
                        getData();
                        break;
                }

            }
        } catch (error) {

        }
    }, [messages])

    const getEventLists = async () => {
        console.log('here2')
        const result = await getOpenOrClosedEventsV2();
        setEventList(result);
        console.log('here3', result)
        if (result) {
            if (result.length > 1) {
                setIsEventListOpen(true);
            } else if (result.length == 1) {
                setSelectedEvent(result[0].event)
                setIsEventListOpen(false);
                getData(result[0].event);
            }
        }

        setIsLoaded(true);
    }

    const onSelectFromEventList = (data) => {
        setSelectedEvent(data.event)
        setIsEventListOpen(false);
        getData(data.event);
    }
    useEffect(() => {

        console.log('here')
        try {

            getEventLists();
            getFeedConfig();
        } catch (error) {
            console.log('here5', error.message)
        }
        return () => {
            setData(null)
            setIsLoaded(false);
        }

    }, [])


    const setAmountBet = (type, amount) => {
        setAmountToBet({ type, amount })
    }

    const formatDisplayDate = (date) => {
        var newDate = new Date(date);
        return newDate.toDateString();
    }
    const onWinnerModalClose = () => {
        getData();
        setBettingEndedResult({ isOpen: false, winnerSide: bettingEndedResult.winnerSide })
    }


    const openBetting = (type) => {
        if (!isJsonEmpty(data) && data.fightStatus.name == "Open")
            setModalObject({ isOpen: true, type })
    }
    const closeBetting = (isForCompletion = false) => {
        if (isForCompletion) {
            setModalConfirmObject({ isOpen: true, type: modalObject.type })
        }
        setModalObject({ isOpen: false, type: modalObject.type })
    }

    const closeConfirmation = async (isForCompletion = false) => {
        setModalConfirmObject({ isOpen: false, type: modalConfirmObject.type })
        if (isForCompletion) {
            // setIsShowPin(true)
            placeBet()
        }
    }

    const onCloseAlert = () => {
        setAlert({ hasTimer: false, timeout: 3000, isOpen: false, type: "", message: "" })

    }


    // const onValidatePin = async (pin) => {
    //     const result = await validateMpin(pin);

    //     if (result == true) {
    //         setIsShowPin(false);

    //         placeBet()
    //     } else {
    //         setAlert({ hasTimer: false, timeout: 3000, isOpen: true, type: "error", message: "Invalid Pin" })
    //     }
    // }
    const placeBet = async () => {
        var response = await placeABet(data.fight.fightId, amountToBet.amount.replaceAll(',', ''), amountToBet.type)
        if (response) {
            setModalObject({ isOpen: false, type: modalObject.type })

            setModalConfirmObject({ isOpen: false, type: modalConfirmObject.type })

            setModalConfirmObject({ isOpen: false, type: modalConfirmObject.type })
        } else {
            setAlert({ hasTimer: false, timeout: 5000, isOpen: true, type: "error", message: "Can not place a bet. Please check your balance" })
        }
    }
    const renderModals = () => {
        if (!isJsonEmpty(data)) {
            return <>
                {modalConfirmObject.isOpen &&
                    <BetConfirmation
                        player={getPlayer(modalConfirmObject.type)}
                        type={modalConfirmObject.type}
                        balance={10000}
                        amount={amountToBet.amount}
                        onClose={(isForCompletion) => closeConfirmation(isForCompletion)}>
                    </BetConfirmation>}
                {modalObject.isOpen && <BetModal player={getPlayer(modalObject.type)} setAmountToBet={setAmountBet} data={data} type={modalObject.type} balance={10000} onClose={closeBetting}></BetModal>}

            </>
        } else return <></>
    }

    const getPlayer = (side) => {
        if (data) {
            const player = data.fightDetails.find(x => x.side == side);
            if (player) {
                return `${player.owner} ${player.breed}`
            }
        }
        return ""
    }

    const getSafeData = (data, field) => {
        try {
            return data[field]
        } catch (error) {
            return 0;
        }
    }
    const getTotalBet = () => {
        return getSafeData(betDetails, 's0a') + getSafeData(betDetails, 's1a')
    }

    return (
        <MainLayout>
            {/* {isShowPin && <PinV2 title="Enter Pin" isOpen={isShowPin} onClose={() => { setIsShowPin(false) }} onSubmit={(e) => onValidatePin(e)} />} */}

            {isLoaded && <BalanceHeader type={2} forceUpdate={randomText}></BalanceHeader>}
            {isLoaded && alert.isOpen && <Alert timeout={alert.timeout} hasTimer={alert.hasTimer} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}
            {renderModals()}
            {isEventListOpen &&
                <EventsModal onSelect={onSelectFromEventList} data={eventList}></EventsModal>
            }
            {isLoaded && bettingEndedResult.isOpen &&
                !isJsonEmpty(data) &&
                <WinnerModal onClose={onWinnerModalClose} winnerSide={bettingEndedResult.winnerSide} data={data.fightDetails}></WinnerModal>
            }

            {isLoaded && isSchedulePopUpOpen && !isJsonEmpty(data) &&
                <SchedulePopUp data={schedules} onClose={() => setIsSchedulePopUpOpen(false)} />
            }

            {isLoaded && !isJsonEmpty(data) && !feedConfig.isShowFeed &&
                <div className="flex overflow-auto flex-col items-center gap-3 justify-center align-center  p-2">

                    <div className="rounded-[20px] card max-w-md  bg-center  p-5 w-full"
                        style={
                            {
                                backgroundImage: `url(${bg.src})`,
                                backgroundSize: '100% 100%'
                            }
                        }>
                        <div className="grid grid-cols-4 grid-rows-1 gap-4">
                            <div className="col-span-4 uppercase label-header1">
                                <div className="flex justify-between font-bold">
                                    <label>{data.event.eventName}</label>
                                    <label className="bg-dark px-2">{data.venue.venueName}</label>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-1 gap-4 justify-between">
                                    <label>{formatDisplayDate(data.event.eventDate)}</label>

                                    <label onClick={() => setIsSchedulePopUpOpen(true)} className="text-right underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer">See Game Schedule</label>
                                </div>

                            </div>
                        </div>
                    </div>
                    {eventList && eventList.length > 1 &&
                        <label onClick={() => setIsEventListOpen(true)}
                            className="text-right underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer">
                            See Other Events
                        </label>
                    }
                    <div className="max-w-md w-full h-[30vh]">

                        <iframe className="relative h-full w-full z-0"
                            ref={iframeRef}
                            // src="https://www.youtube.com/embed/4AbXp05VWoQ?si=zzaGMvrDOSoP9tBb?autoplay=1&cc_load_policy=1"
                            src={data.webRtc}
                            title="Lucky Taya" frameBorder="0"
                            allow="autoplay;encrypted-media;"
                            allowFullScreen
                        ></iframe>
                        <div className="grid grid-cols-4 grid-rows-1 gap-4 mt-2">
                            <div className="col-span-2 card rounded-[10px] p-1  text-center">
                                <label> Status : {data.fightStatus.name}</label>
                            </div>
                            {/* <div className="col"></div> */}
                            <div className="col-span-2 card rounded-[10px] p-1 text-center">
                                <label> Game# {data.fight.fightNum}</label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="bg-dark col-span-2 card rounded-[10px] w-full p-1 text-center">
                        <label> Total Bet : {formatMoneyV2(getTotalBet())}</label>
                    </div>
                    {/* <br /> */}
                    <div className="max-w-md w-full">
                        <div className="grid grid-cols-2 grid-rows-1 gap-4">
                            <div onClick={() => openBetting(1)}>
                                <MeronWala dataByPlayer={betDetailsByPlayer} player={getPlayer(1)} type={1} data={betDetails} />
                            </div>
                            <div onClick={() => openBetting(0)}>
                                <MeronWala dataByPlayer={betDetailsByPlayer} player={getPlayer(0)} type={0} data={betDetails} />
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!isJsonEmpty(data) && data?.gameType == 4 && <ThreeManScore data={data}></ThreeManScore>}
                    {!isJsonEmpty(data) && data?.gameType != 4 && <Tabs tabs={
                        [
                            { name: 'Trend', content: <Trend data={data.fightDetails} items={trends} /> },
                            { name: 'Reglahan', content: <Regla data={data.fightDetails} items={trends} /> },
                        ]
                    }></Tabs>}
                </div>
            }
            {isLoaded && isJsonEmpty(data) && (!feedConfig.isShowFeed || !feedConfig.feedUrl) && <React.Fragment>
                <div className="w-full flex  justify-center">

                    <div className="flex flex-col justify-center card max-w-sm p-6 m-10 bg-white rounded-3xl shadow">

                        <h1 className="text-3xl text-center">No event scheduled today.</h1>
                        <h1 className="text-l text-center">Please visit us again later or refresh the page to see if events are now available</h1>
                    </div>
                </div>
            </React.Fragment>}

            {feedConfig.feedUrl && feedConfig.isShowFeed && <React.Fragment>
                <div className="flex overflow-auto flex-col items-center gap-3 justify-center align-center  p-6">

                    <div className="max-w-md w-full h-[30vh]">
                        <iframe className="relative h-full w-full z-0"
                            src={feedConfig.feedUrl}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>

                        </iframe>
                    </div>
                </div>
            </React.Fragment>}
            {!isLoaded && <Loading />}

        </MainLayout >
    );
}

export default memo(Game)
