'use client'
import MainLayout from "../layout/mainLayout";
import Legends from '../components/legends';
import CenterLabel from '../components/centerLabel';
import Calendar from '../components/calendar';
import { useEffect, useState } from "react";
import { getFightDetailsByEventId, getFightDetailsByFightId, getFightSchedule, getLastFightDetailsByEvent, getVenueById } from "../actions/fight";
import { dataFilterByCurrentMonth } from "../lib/DataFilter";
import { isJsonEmpty } from "../lib/utils";
import SchedulePopUp from "../components/modal/schedulePopUp";
import Loading from "../components/loading";

export default function Home() {
  const [data, setData] = useState([])
  const [fightDetails, setFightDetails] = useState({})
  const [isSchedulePopUpOpen, setIsSchedulePopUpOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSelect = async (data) => {
    if (data) {
      setIsLoading(true)
      const response = await getFightDetailsByEventId(data.eventId)
      if (response) {
        setIsSchedulePopUpOpen(true)
        const venue = await getVenueById(data.venueId)
        const result = {
          event : data,
          venue,
          fights : response
        }
        setFightDetails(result)
      }
    }
    setIsLoading(false)
  }
  useEffect(() => {
    const getData = async () => {
      const response = await getFightSchedule();
      const result = dataFilterByCurrentMonth(response, 'eventDate')
      
      setData(result);
      setIsLoaded(true)
    }
    getData();

    return () => {

    }
  }, [])

  return (
    <MainLayout>
      {isSchedulePopUpOpen && !isJsonEmpty(fightDetails) &&
        <SchedulePopUp data={fightDetails} onClose={() => setIsSchedulePopUpOpen(false)} />
      }

      <div className="w-full min-h-full p-8 pb-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center">

        <CenterLabel label="FIGHT SCHEDULE" />
        <br />
        <div className="p-5  max-w-md   card2 rounded-[20px] grid grid-cols-2 grid-rows-2 gap-4 w-full">
          <Legends></Legends>
        </div>
        <br />
        {!isLoaded || isLoading && <Loading />}
        {isLoaded && !isJsonEmpty(data) && <Calendar onSelect={onSelect} schedule={data} currentDate={new Date()} />}
      </div>
    </MainLayout>
  );
}
