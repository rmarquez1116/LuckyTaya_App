'use client'
import MainLayout from "../layout/mainLayout";
import Legends from '../components/legends';
import CenterLabel from '../components/centerLabel';
import Calendar from '../components/calendar';
import React, { useEffect, useState } from "react";
import { getFightDetailsByEventId,  getVenueById } from "../actions/fight";
import { dataFilterByCurrentMonth } from "../lib/DataFilter";
import { isJsonEmpty } from "../lib/utils";
import SchedulePopUp from "../components/modal/schedulePopUp";
import Loading from "../components/loading";
import BalanceHeader from "../components/balanceHeader";
export default function ScheduleComponent({ currDate, data }) {
  const [filteredData, setFilteredData] = useState()
  const [fightDetails, setFightDetails] = useState({})
  const [isSchedulePopUpOpen, setIsSchedulePopUpOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDate, setCurrentDate] = useState(currDate)

  const onSelect = async (item) => {
    if (item) {
      setIsLoading(true)
      const response = await getFightDetailsByEventId(item.eventId)
      if (response) {
        setIsSchedulePopUpOpen(true)
        const venue = await getVenueById(item.venueId)
        const result = {
          event: item,
          venue,
          fights: response
        }
        setFightDetails(result)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const result = dataFilterByCurrentMonth(currentDate, data, 'eventDate')
    setFilteredData(result);
    setIsLoaded(true)
  }, [currentDate])

  const onDateChange = (e) => {
    setCurrentDate(e.target.value)
  }

  return (
    <React.Fragment>
      <BalanceHeader type={1} ></BalanceHeader>

      {isSchedulePopUpOpen && !isJsonEmpty(fightDetails) &&
        <SchedulePopUp data={fightDetails} onClose={() => setIsSchedulePopUpOpen(false)} />
      }

      <div className="w-full min-h-full p-8 pb-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center">

        <CenterLabel label="GAME SCHEDULE" />
        <br />
        <div className="p-5  max-w-md   card2 rounded-[20px] grid grid-cols-2 grid-rows-2 gap-4 w-full">
          <Legends></Legends>
        </div>
        <br />
        {!isLoaded || isLoading && <Loading />}

        <input onChange={onDateChange} className="text-center bg-transparent uppercase" value={currentDate} type="month" name="month_year" id="month_year" />
        <br />

        {isLoaded && <Calendar onSelect={onSelect} schedule={filteredData} currentDate={currentDate} />}
      </div>
    </React.Fragment>
  );
}
