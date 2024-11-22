'use client'
import MainLayout from "../layout/mainLayout";
import BalanceHeader from '../components/balanceHeader'
import bg from '../../public/images/game-bg.png'
import MeronWala from "../components/meronWala";
import BetModal from '../components/modal/betModal'

import { memo, useEffect, useState } from "react";
import BetConfirmation from "../components/modal/betConfirmation";
import Loading from "../components/loading";
import { getEventTrend, getLatestFight, placeABet } from "../actions/fight";
import { isJsonEmpty } from "../lib/utils";
import Alert from "../components/alert";
import { getInitialBetDetails } from "../actions/wsApi";
import WinnerModal from "../components/modal/winnerModal";
import { getToken } from "../helpers/StringGenerator";
import { useWebSocketContext } from '../context/webSocketContext';
import Trend from '../components/trend'

function Game() {
    const { socket, messages } = useWebSocketContext();

    const [betDetails, setBetDetails] = useState({
        fId: 0,
        s0c: 0,
        s0a: 0,
        s0o: 0,
        s1c: 0,
        s1a: 0,
        s1o: 0
    })

    const [isLoaded, setIsLoaded] = useState(false)
    const [data, setData] = useState(null)
    const [amountToBet, setAmountToBet] = useState({ type: 1, amount: 0 })
    const [modalObject, setModalObject] = useState({
        isOpen: false,
        type: 1
    })
    const [randomText, setRandomText] = useState("1234")
    const [trends, setTrends] = useState([])
    const [bettingEndedResult, setBettingEndedResult] = useState({
        winnerSide: -1,
        isOpen: false
    })
    const [showTrend, setShowTrend] = useState(false)

    const getData = async () => {
        try {
            const response = await getLatestFight();
            if (response) {
                setData(response);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoaded(true);
        }
    }

    const [alert, setAlert] = useState({ timeout: 3000, isOpen: false, message: "", type: "success" })
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
            console.log({ messages, data }, 'socket Message')
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
                        setAlert({ timeout: 5000, isOpen: true, type: "info", message: "Last Call !!!" })
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

            var response = await placeABet(data.fight.fightId, amountToBet.amount, amountToBet.type)
            if (response) {
                setModalObject({ isOpen: false, type: modalObject.type })

                setModalConfirmObject({ isOpen: false, type: modalConfirmObject.type })

                setModalConfirmObject({ isOpen: false, type: modalConfirmObject.type })
            } else {
                setAlert({ timeout: 3000, isOpen: true, type: "error", message: "Can not place a bet as of the moment" })
            }
        }
    }

    const onCloseAlert = () => {
        setAlert({ timeout: 3000, isOpen: false, type: "", message: "" })

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

    return (
        <MainLayout>
            {isLoaded && <BalanceHeader type={2} forceUpdate={randomText}></BalanceHeader>}
            {isLoaded && alert.isOpen && <Alert timeout={alert.timeout} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}
            {renderModals()}
            {isLoaded && bettingEndedResult.isOpen &&
                !isJsonEmpty(data) &&
                <WinnerModal onClose={onWinnerModalClose} winnerSide={bettingEndedResult.winnerSide} data={data.fightDetails}></WinnerModal>
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
                        <div className="grid grid-cols-5 grid-rows-1 gap-4">
                            <div className="col-span-4 uppercase label-header1">
                                <div>
                                    <label>{data.event.eventName}</label>
                                </div>
                                <div>
                                    <label>{data.venue.venueName}</label>
                                </div>
                                <div>
                                    <label>{formatDisplayDate(data.event.eventDate)}</label>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="max-w-md w-full h-[30vh]">

                        <iframe className="relative h-full w-full z-0"
                            // src="https://www.youtube.com/embed/4AbXp05VWoQ?si=zzaGMvrDOSoP9tBb?autoplay=1&cc_load_policy=1"
                            src="http://161.49.111.13/#%7B%22playerOption%22%3A%7B%22autoStart%22%3Atrue%2C%22autoFallback%22%3Atrue%2C%22mute%22%3Afalse%2C%22sources%22%3A%5B%7B%22type%22%3A%22webrtc%22%2C%22file%22%3A%22ws%3A%2F%2F161.49.111.13%3A3333%2Fapp%2Ftest-input-stream%3Ftransport%3Dtcp%22%7D%5D%2C%22expandFullScreenUI%22%3Atrue%7D%2C%22demoOption%22%3A%7B%22autoReload%22%3Atrue%2C%22autoReloadInterval%22%3A2000%7D%7D"
                            title="Lucky Taya" frameBorder="0"
                            allow="autoplay;encrypted-media;"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen></iframe>
                        <br />  
                        <div className="grid grid-cols-5 grid-rows-1 gap-4">
                            <div className="col-span-2 card rounded-[10px] p-3  text-center">
                                <label> Betting {data.fightStatus.name}:</label>
                            </div>
                            <div className="col"></div>
                            <div className="col-span-2 card rounded-[10px] p-3 text-center">
                                <label> Fight# {data.fight.fightNum}</label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    {showTrend && <Trend items={trends} />}
                    {!showTrend && <div className="max-w-md w-full">
                        <div className="grid grid-cols-2 grid-rows-1 gap-4">
                            <div onClick={() => openBetting(1)}>
                                <MeronWala type={1} data={betDetails} />
                            </div>
                            <div onClick={() => openBetting(0)}>
                                <MeronWala type={0} data={betDetails} />
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            }
            {!isLoaded && <Loading />}

        </MainLayout >
    );
}

export default memo(Game)
