'use client'
import MainLayout from "./layout/mainLayout";

import play from '../public/images/play.png';
import cashIn from '../public/images/cashin.png';
import cashOut from '../public/images/cashout.png';
import DashboardButton from "./components/dashboardButton";
import FightScheduleBox from "./components/fightScheduleBox";
import BalanceHeader from "./components/balanceHeader";
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter();
  return (
    <MainLayout>
      <BalanceHeader type={1}></BalanceHeader>
      <div className="className=' p-8 pb-20">
        <div className='flex min-w-md justify-center items-center'>

          <button className="w-full rounded-[20px] p-2  max-w-md dark-gradient">Transaction History   →</button>
        </div>
        <br />
        <div className='grid grid-cols-3 grid-rows-1 gap-4 text-center w-full'>

          <DashboardButton onClick={() => router.push('/game')} img={play} label="Play"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashin')} img={cashIn} label="Cash In"></DashboardButton>
          <DashboardButton onClick={() => router.push('/cashout')} img={cashOut} label="Cash Out"></DashboardButton>
        </div>
        
        <FightScheduleBox></FightScheduleBox>


      </div>
    </MainLayout>
  );
}
