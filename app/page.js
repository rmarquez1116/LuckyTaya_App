'use client'
import MainLayout from "./layout/mainLayout";

import play from '../public/images/play.png';
import cashIn from '../public/images/cashin.png';
import cashOut from '../public/images/cashout.png';
import DashboardButton from "./components/dashboardButton";
import FightScheduleBox from "./components/fightScheduleBox";
import BalanceHeader from "./components/balanceHeader";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { isJsonEmpty } from "./lib/utils";
import Loading from "./components/loading";
import { getLatestFight } from "./actions/fight";
import useSocket from "./hooks/useSocket";
export default function Home() {
  const router = useRouter();
  const {socket,messages} = useSocket();
  const [isLoaded, setIsLoaded] = useState(false)
  const [data, setData] = useState({})
 
  useEffect(() => {
    console.log(messages, 'hellosocket')
    if (messages != null && !isJsonEmpty(data)) {
        const parseMessage = JSON.parse(messages)
        switch (parseMessage.PacketType) {
            // for betting updates
            case 10:
                break;
            // last call
            case 22:
                 break;
            // result
            case 50:  
                break;
            default:
                getData();
                break;
        }

    }
}, [messages])

useEffect(() => {
}, [data,isLoaded])

  useEffect(() => {
    getData()
    return () => {
    }
  }, [])
  
  const getData = async () => {
    const response = await getLatestFight();
    setData(response)
    setIsLoaded(true)
  }



  return (
    <MainLayout>
      <BalanceHeader type={1}></BalanceHeader>
      <div className="className=' p-8 pb-20">
        <div className='flex min-w-md justify-center items-center'>

          <button  onClick={() => router.push('/transaction_history')} className="w-full rounded-[20px] p-2  max-w-md dark-gradient">Transaction History   →</button>
        </div>
        <br />
        <div className='grid grid-cols-3 grid-rows-1 gap-4 text-center w-full'>

          <DashboardButton onClick={() => router.push('/game')} img={play} label="Play"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashin')} img={cashIn} label="Cash In"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashout')} img={cashOut} label="Cash Out"></DashboardButton>
        </div>
        {isLoaded && !isJsonEmpty(data) &&
          <FightScheduleBox data={data}></FightScheduleBox>
        }
        {!isLoaded && <Loading/>}


      </div>
    </MainLayout>
  );
}
