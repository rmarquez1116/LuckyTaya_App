'use client'
import MainLayout from "../layout/mainLayout";
import Image from "next/image";
import BalanceHeader from '../components/balanceHeader'
import bg from '../../public/images/game-bg.png'
import MeronWala from "../components/meronWala";
import BetModal from '../components/modal/betModal'

import { useEffect, useState } from "react";
import BetConfirmation from "../components/modal/betConfirmation";

export default function Game() {
    // const clientSocket = useSocketIoClient()
    // const isSocketConnected = useIsSocketConnected()
    // const userId = clientSocket?.userId

    // const [message, setMessage] = useState("")
    // const [messages, setMessages] = useState([])

    // useEffect(() => {
    //     if (!clientSocket) return
    //     const receiveMessageHandler = receivedMessage => {
    //         setMessages(prevMessages => [...prevMessages, receivedMessage])
    //         setMessage("")
    //     }
    //     clientSocket.subscribe("receiveMessage", receiveMessageHandler)
    // }, [clientSocket])

    // const sendMessage = () => {
    //     if (clientSocket && message.trim() !== "") {
    //         clientSocket.send("sendMessage", message.trim())
    //     }
    // }
    const [modalObject, setModalObject] = useState({
        isOpen : false,
        type : 2
    })

    const [modalConfirmObject, setModalConfirmObject] = useState({
        isOpen : true,
        type : 1
    })

    // useEffect(() => {
    //   first
    
    //   return () => {
    //     second
    //   }
    // }, [third])
    
    return (

        <MainLayout>
            <BalanceHeader type={2}></BalanceHeader>

            {modalConfirmObject.isOpen && <BetConfirmation type={modalConfirmObject.type} balance={10000}></BetConfirmation>}
            {modalObject.isOpen && <BetModal type={modalObject.type} balance={10000}></BetModal>}


            <div className="flex flex-col items-center gap-5 justify-center align-center  p-6 mt-5">
                <div className="rounded-[20px] card max-w-md  bg-center  p-5"
                    style={
                        {
                            backgroundImage: `url(${bg.src})`,
                            backgroundSize: '100% 100%'
                        }
                    }>
                    <div className="grid grid-cols-5 grid-rows-1 gap-4">
                        <div className="col-span-4">
                            <label>TALPAKAN E-BILLIARD (SET-A)

                                CAVITE COCK EARLY BIRD
                                ELIMS (SET-B) 420 TOTAL FIGHTS
                                SEPTEMBER 20, 2024
                            </label></div>
                    </div>
                </div>

                <div className="max-w-md w-full">
                    <video autoPlay={true} src={process.env.WEB_RTC}>

                    </video>
                    {/* <iframe className="relative h-full w-full"
                        src="https://www.youtube.com/embed/JYUyyAsdNhM?si=1POPimjWqOnHfKgQ?autoplay=1&cc_load_policy=1"
                        title="YouTube video player" frameborder="0"
                        allow="autoplay;encrypted-media;"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen></iframe> */}
                    <br />
                    <div className="grid grid-cols-5 grid-rows-1 gap-4">
                        <div className="col-span-2 card rounded-[10px] p-3  text-center">
                            <label> Betting Closed:</label>
                        </div>
                        <div className="col"></div>
                        <div className="col-span-2 card rounded-[10px] p-3 text-center">
                            <label> Fight#17</label>
                        </div>
                    </div>
                </div>
                <div className="max-w-md w-full">
                    <div className="grid grid-cols-2 grid-rows-1 gap-4">
                        <MeronWala type={1} />
                        <MeronWala type={2} />
                    </div>
                </div>
            </div>
          
        </MainLayout >
    );
}
