'use client'
import MainLayout from "../layout/mainLayout";
import BalanceHeader from '../components/balanceHeader'
import bg from '../../public/images/game-bg.png'
import MeronWala from "../components/meronWala";
import BetModal from '../components/modal/betModal'

import { memo, useEffect, useState } from "react";
import BetConfirmation from "../components/modal/betConfirmation";
import Loading from "../components/loading";
import { getLatestFight, placeABet } from "../actions/fight";
import { isJsonEmpty } from "../lib/utils";
import useSocket from "../hooks/useSocket";
import Alert from "../components/alert";
import { getInitialBetDetails } from "../actions/wsApi";
import WinnerModal from "../components/modal/winnerModal";

function Game() {

    const { messages } = useSocket();
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
    const [bettingEndedResult, setBettingEndedResult] = useState({
        winnerSide: 0,
        isOpen: false
    })

    const getData = async () => {
        const response = await getLatestFight();
        if (response) {
            setData(response);
            const initialBetDetails = await getInitialBetDetails(response.fight.fightId);
            setBetDetails(initialBetDetails)
        }
        setIsLoaded(true)
    }

    const [alert, setAlert] = useState({ timeout: 3000, isOpen: false, message: "", type: "success" })
    const [modalConfirmObject, setModalConfirmObject] = useState({
        isOpen: false,
        type: 1
    })



    useEffect(() => {
        console.log(messages, 'hellosocket')
        if (messages != null && !isJsonEmpty(data)) {
            const parseMessage = JSON.parse(messages)
            switch (parseMessage.PacketType) {
                // for betting updates
                case 10:
                    if (data.fight.fightId == parseMessage.FightId &&
                        data.event.eventId == parseMessage.EventId) {
                        setBetDetails(JSON.parse(parseMessage.jsonPacket))
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
    }, [messages])


    useEffect(() => {

        getData();
        return () => {
            setData(null)
            setIsLoaded(false);
        }
    }, [data])


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
            <BalanceHeader type={2}></BalanceHeader>
            {alert.isOpen && <Alert timeout={alert.timeout} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}
            {renderModals()}
            {bettingEndedResult.isOpen &&
                !isJsonEmpty(data) &&
                <WinnerModal onClose={onWinnerModalClose} winnerSide={bettingEndedResult.winnerSide} data={data.fightDetails}></WinnerModal>
            }

            {isLoaded && !isJsonEmpty(data) &&
                <div className="flex flex-col items-center gap-5 justify-center align-center  p-6 mt-5">
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

                    <div className="max-w-md w-full">

                        {/* <WatchParty url="ws://161.49.111.13:3333/app/test-input-stream?transport=tcp"></WatchParty> */}
                        {/* <video autoPlay={true} src={process.env.WEB_RTC}>

</video> */}
                        {/* <iframe className="relative h-full w-full"
                        src="https://www.youtube.com/embed/JYUyyAsdNhM?si=1POPimjWqOnHfKgQ?autoplay=1&cc_load_policy=1"
                        title="YouTube video player" frameborder="0"
                        allow="autoplay;encrypted-media;"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen></iframe> */}
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
                    <div className="max-w-md w-full">
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
                    </div>
                </div>
            }
            {!isLoaded && <Loading />}

        </MainLayout >
    );
}

export default memo(Game)
