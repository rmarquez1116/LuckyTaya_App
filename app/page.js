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
import { getLatestFight, getOpenOrClosedFightEvents } from "./actions/fight";
import useSocket from "./hooks/useSocket";
import Carousel from './components/carousel'
import { getToken } from "./helpers/StringGenerator";
export default function Home() {
  const router = useRouter();
  const { socket, messages } = useSocket();
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState({})
  const [carouselItems, setCarouselItems] = useState([])

  useEffect(() => {
    console.log(messages, 'hellosocket')
    if (messages != null) {
      getData();
    }
  }, [messages])

  useEffect(() => {
  }, [data])

  useEffect(() => {
    getData()
    return () => {
    }
  }, [])

  const getData = async () => {
    const response = await getOpenOrClosedFightEvents();
    console.log(response, 'hello')
    if (response) {
      const items = []
      for (let index = 0; index < response.length; index++) {
        const element = response[index];
        items.push(<FightScheduleBox data={element} />)
      }
      setCarouselItems(items)
    }
    setData(getToken(4))
    setIsLoaded(true)
  }

  return (
    <MainLayout>
      <BalanceHeader type={1} forceUpdate={data}></BalanceHeader>
      <div className="className=' p-8 pb-20">
        <div className='flex min-w-md justify-center items-center'>

          <button onClick={() => router.push('/transaction_history')} className="w-full rounded-[20px] p-2  max-w-md dark-gradient">Transaction History   →</button>
        </div>
        <br />
        <div className='grid grid-cols-3 grid-rows-1 gap-4 text-center w-full'>

          <DashboardButton onClick={() => router.push('/game')} img={play} label="Play"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashin')} img={cashIn} label="Cash In"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashout')} img={cashOut} label="Cash Out"></DashboardButton>
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
