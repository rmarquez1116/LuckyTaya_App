'use client'
import MainLayout from "../layout/mainLayout";
import BalanceHeader from '../components/balanceHeader'
import bg from '../../public/images/game-bg.png'
import MeronWala from "../components/meronWala";
import BetModal from '../components/modal/betModal'

import React, { memo, useEffect, useState } from "react";
import BetConfirmation from "../components/modal/betConfirmation";
import Loading from "../components/loading";
import { getEventTrend, getFightDetailsByEventId, getLatestFight, placeABet } from "../actions/fight";
import { isJsonEmpty } from "../lib/utils";
import Alert from "../components/alert";
import { getInitialBetDetails } from "../actions/wsApi";
import WinnerModal from "../components/modal/winnerModal";
import { getToken } from "../helpers/StringGenerator";
import { useWebSocketContext } from '../context/webSocketContext';
import Trend from '../components/trend'
import SchedulePopUp from "../components/modal/schedulePopUp";

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

    // const [isShowPin, setIsShowPin] = useState(false)
    const [isSchedulePopUpOpen, setIsSchedulePopUpOpen] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState(null)
    const [amountToBet, setAmountToBet] = useState({ type: 1, amount: 0 })
    const [modalObject, setModalObject] = useState({
        isOpen: false,
        type: 1
    })

    useEffect(() => {
        if (closeBet) {
            getData()
        }
    }, [closeBet])


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
    const getData = async () => {
        try {
            const response = await getLatestFight();
            if (response) {
                setData(response);
                getFightSchedules(response)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoaded(true);
        }
    }

    const [alert, setAlert] = useState({ hasTimer: false, timeout: 5000, isOpen: false, message: "", type: "success" })
    const [modalConfirmObject, setModalConfirmObject] = useState({
        isOpen: false,
        type: 1
    })

    useEffect(() => {
        const getBetDetails = async () => {
            const initialBetDetails = await getInitialBetDetails(data.fight.fightId);
            setBetDetails(initialBetDetails);

            const eventTrend = await getEventTrend(data.event.eventId);
            setTrends(eventTrend)
            setRandomText(getToken(4))
        }
        if (data) {
            getBetDetails();
            setShowTrend(data.fightStatus.name != "Open")
        }
    }, [data])



    useEffect(() => {
        try {
            console.log(messages,'Websocket fromGame')
            // console.log({ messages, data }, 'socket Message')
            if (messages != null && !isJsonEmpty(data)) {
                const parseMessage = JSON.parse(messages)
                const betDetail = JSON.parse(parseMessage.jsonPacket)

                switch (parseMessage.PacketType) {
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
                    case 50:
                        const betResult = JSON.parse(parseMessage.jsonPacket)
                        setBettingEndedResult({ winnerSide: betResult.WinSide, isOpen: true })
                        if (betResult.WinSide == betResult.YourSide) {

                        } else {

                        }
                        break;
                    default:
                        getData();
                        break;
                }

            }
        } catch (error) {

        }
    }, [messages])


    useEffect(() => {

        getData();
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
                        type={modalConfirmObject.type}
                        balance={10000}
                        amount={amountToBet.amount}
                        onClose={(isForCompletion) => closeConfirmation(isForCompletion)}>
                    </BetConfirmation>}
                {modalObject.isOpen && <BetModal setAmountToBet={setAmountBet} data={data} type={modalObject.type} balance={10000} onClose={closeBetting}></BetModal>}

            </>
        } else return <></>
    }

    const getPlayer = (side)=>{
        if(data){
            const player = data.fightDetails.find(x=>x.side == side);
            if(player){
                return `${player.owner} ${player.breed}`
            }
        }
        return ""
    }

    return (
        <MainLayout>
            {/* {isShowPin && <PinV2 title="Enter Pin" isOpen={isShowPin} onClose={() => { setIsShowPin(false) }} onSubmit={(e) => onValidatePin(e)} />} */}

            {isLoaded && <BalanceHeader type={2} forceUpdate={randomText}></BalanceHeader>}
            {isLoaded && alert.isOpen && <Alert timeout={alert.timeout} hasTimer={alert.hasTimer} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}
            {renderModals()}
            {isLoaded && bettingEndedResult.isOpen &&
                !isJsonEmpty(data) &&
                <WinnerModal onClose={onWinnerModalClose} winnerSide={bettingEndedResult.winnerSide} data={data.fightDetails}></WinnerModal>
            }

            {isLoaded && isSchedulePopUpOpen && !isJsonEmpty(data) &&
                <SchedulePopUp data={schedules} onClose={() => setIsSchedulePopUpOpen(false)} />
            }

            {isLoaded && !isJsonEmpty(data) &&
                <div className="flex overflow-auto flex-col items-center gap-5 justify-center align-center  p-6">
                    <div className="rounded-[20px] card max-w-md  bg-center  p-5 w-full"
                        style={
                            {
                                backgroundImage: `url(${bg.src})`,
                                backgroundSize: '100% 100%'
                            }
                        }>
                        <div className="grid grid-cols-4 grid-rows-1 gap-4">
                            <div className="col-span-4 uppercase label-header1">
                                <div>
                                    <label>{data.event.eventName}</label>
                                </div>
                                <div>
                                    <label>{data.venue.venueName}</label>
                                </div>
                                <div className="grid grid-cols-2 grid-rows-1 gap-4 justify-between">
                                    <label>{formatDisplayDate(data.event.eventDate)}</label>

                                    <label onClick={() => setIsSchedulePopUpOpen(true)} className="text-right underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer">See Game Schedule</label>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="max-w-md w-full h-[30vh]">

                        <iframe className="relative h-full w-full z-0"
                            // src="https://www.youtube.com/embed/4AbXp05VWoQ?si=zzaGMvrDOSoP9tBb?autoplay=1&cc_load_policy=1"
                            src={data.webRtc}
                            title="Lucky Taya" frameBorder="0"
                            allow="autoplay;encrypted-media;"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen></iframe>
                        <br />
                        <div className="grid grid-cols-5 grid-rows-1 gap-4">
                            <div className="col-span-2 card rounded-[10px] p-3  text-center">
                                <label> Status : {data.fightStatus.name}</label>
                            </div>
                            <div className="col"></div>
                            <div className="col-span-2 card rounded-[10px] p-3 text-center">
                                <label> Game# {data.fight.fightNum}</label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    {showTrend && !isJsonEmpty(data) && <Trend data={data.fightDetails} items={trends} />}
                    {!showTrend && <div className="max-w-md w-full">
                        <div className="grid grid-cols-2 grid-rows-1 gap-4">
                            <div onClick={() => openBetting(1)}>
                                <MeronWala player={getPlayer(1)} type={1} data={betDetails} />
                            </div>
                            <div onClick={() => openBetting(0)}>
                                <MeronWala player={getPlayer(0)} type={0} data={betDetails} />
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            }
            {isLoaded && isJsonEmpty(data) && <React.Fragment>
                <div className="w-full flex  justify-center">

                    <div className="flex flex-col justify-center card max-w-sm p-6 m-10 bg-white rounded-3xl shadow">

                        <h1 className="text-3xl text-center">No event scheduled today.</h1>
                    </div>
                </div>
            </React.Fragment>}
            {!isLoaded && <Loading />}

        </MainLayout >
    );
}

export default memo(Game)
