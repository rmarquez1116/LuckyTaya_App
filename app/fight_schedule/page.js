'use client'
import Image from "next/image";
import MainLayout from "../layout/mainLayout";
import Legends from '../components/legends';
import CenterLabel from '../components/centerLabel';
import Calendar from '../components/calendar';
import { useEffect, useState } from "react";
import { getFightSchedule } from "../actions/fight";
import  { dataFilterByCurrentMonth } from "../lib/DataFilter";

export default function Home() {
  const [data, setData] = useState([])
  useEffect(() => {
    const getData = async ()=>{
      const response = await getFightSchedule();
      const result = dataFilterByCurrentMonth(response,'entryDateTime')
      setData(result);
      console.log(result,'hello999')
    }
    getData();
    
    return () => {
      
    }
  }, [])
  
  return (
    <MainLayout>
      <div className="w-full min-h-full p-8 pb-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center">

        <CenterLabel label="FIGHT SCHEDULE" />
        <br />
        <div className="p-5  max-w-md   card2 rounded-[20px] grid grid-cols-2 grid-rows-2 gap-4 w-full">
          <Legends></Legends>
        </div>
        <br />
        <Calendar schedule={data} currentDate={new Date()} />
      </div>
    </MainLayout>
  );
}
