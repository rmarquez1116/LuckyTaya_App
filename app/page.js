'use client'
import MainLayout from "./layout/mainLayout";

import play from '../public/images/play.png';
import cashIn from '../public/images/cashin.png';
import cashOut from '../public/images/cashout.png';
import DashboardButton from "./components/dashboardButton";
import FightScheduleBox from "./components/fightScheduleBox";
import BalanceHeader from "./components/balanceHeader";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import { isJsonEmpty } from "./lib/utils";
import Loading from "./components/loading";
import { getLastFightDetailsByEvent, getLatestFight, getOpenOrClosedFightEvents } from "./actions/fight";
import Carousel from './components/carousel'
import { useWebSocketContext } from './context/webSocketContext';
import { getToken } from "./helpers/StringGenerator";
import Pin from './components/modal/pinModal'
import { getProfile, profile } from "./actions/profile";
import { nominatePin } from './actions/pin'
import SchedulePopUp from "./components/modal/schedulePopUp";

export default function Home() {
  const router = useRouter();
  const { messages } = useWebSocketContext();

  const [isLoaded, setIsLoaded] = useState(false)
  const [carouselItems, setCarouselItems] = useState([])
  const [hasPin, setHasPin] = useState(true)
  const [isSchedulePopUpOpen, setIsSchedulePopUpOpen] = useState(false)
  const [fightDetails, setFightDetails] = useState({})

  useEffect(() => {
    console.log(messages, 'socket Message')
    if (messages != null) {

      getData();
    }
  }, [messages])

  useEffect(() => {
    getData()
    return () => {
    }
  }, [])

  const onSelect = async (data) => {
    if (data) {
      const response = await getLastFightDetailsByEvent(data)
      if (response) {
        setIsSchedulePopUpOpen(true)
        setFightDetails(response)
      }
    }
  }

  const onNominatePin = async (e) => {
    await nominatePin(e)
    router.replace('/profile')
  }
  const getData = async () => {
    const response = await getOpenOrClosedFightEvents();

    const userProfile = await getProfile()
    if (userProfile) {
      if (!userProfile?.pin) {
        setHasPin(false)
      }
    }
    if (response) {
      const items = []
      for (let index = 0; index < response.length; index++) {
        const element = response[index];
        items.push(<FightScheduleBox data={element} onSelect={onSelect} />)
      }
      setCarouselItems(items)
    }
    setIsLoaded(true)
  }

  return (
    <MainLayout>
      <BalanceHeader type={1} ></BalanceHeader>
      {isLoaded && isSchedulePopUpOpen && !isJsonEmpty(fightDetails) &&
        <SchedulePopUp data={fightDetails} onClose={() => setIsSchedulePopUpOpen(false)} />
      }

      {isLoaded && <Pin title="Set Pin" isOpen={!hasPin} onClose={() => { }} onSubmit={(e) => onNominatePin(e)} />}
      <div className="className=' p-8 pb-20">
        <div className='flex min-w-md justify-center items-center'>

          <button onClick={() => router.push('/transaction_history')} className="w-full rounded-[20px] p-2  max-w-md dark-gradient">Transaction History   →</button>
        </div>
        <br />
        <div className='grid grid-cols-2 grid-rows-1 gap-4 text-center w-full'>

          <DashboardButton onClick={() => router.push('/game')} img={play} label="Play"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashin')} img={cashIn} label="Cash In"></DashboardButton>
          {/* <DashboardButton onClick={() => router.push('/cashout')} img={cashOut} label="Cash Out"></DashboardButton> */}
        </div>
        <br />

        {isLoaded && carouselItems.length > 0 &&
          <React.Fragment>
            {/* <FightScheduleBox data={data}></FightScheduleBox> */}
            <Carousel items={carouselItems} />
          </React.Fragment>
        }
        {!isLoaded && <Loading />}


      </div>
    </MainLayout>
  );
}
