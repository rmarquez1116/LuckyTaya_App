import React from 'react'
import calendar from '../../../public/images/calendar.png'
import clock from '../../../public/images/clock.png'
import FighterDetail from '../fighterDetails'
import Image from 'next/image'
import player1 from '../../../public/images/player1.png'
function SchedulePopUp({ data ,onClose}) {
    const renderDetails = () => {
        return <div className="grid grid-cols-1 bg-dark-no-border rounded-[10] p-3 w-full">
            {data.fightDetails.map((item) => {
                item.picture = player1
                return <FighterDetail type={2} data={item}></FighterDetail>
            })}
        </div>
    }
    const formatDisplayDate = (date) => {
        var newDate = new Date(date);
        return newDate.toDateString();
    }
    const formatDisplayTime = (date) => {
        var newDate = new Date(date).toLocaleTimeString();
       
        return newDate.substring(0, newDate.length - 6) + " " +newDate.slice(8);
    }
    return (
        <div className='absolute flex justify-center items-center flex w-full overflow-hidden backdrop-blur'>
            <div className="flex flex-col items-center  w-full max-w-sm card gap-3 p-6 bg-white rounded-3xl shadow">
                <div className="grid grid-cols-6 w-full grid-rows-1 gap-4  p-3  ">
                    <div className='flex items-center' onClick={onClose}>&lt;</div>
                    <div className="col-span-5">
                        <div>
                            <label>{data.event.eventName}</label>
                        </div>
                        <div>
                            <label>{data.venue.venueName}</label>
                        </div>
                    </div>
                </div>
                <div className={`h-2 w-full ${data.color}`}></div>
                <div className="grid grid-cols-2 grid-rows-1 gap-4 p-3 rounded-[20px]">
                    <div className='inline-flex gap-2 items-center'><Image alt="calendar" className="w-[20px] h-[20px]" src={calendar}></Image>  <label>{formatDisplayDate(data.event.eventDate)}</label></div>
                    <div className='inline-flex gap-2 items-center justify-end'><Image alt="time" className="w-[20px] h-[20px]" src={clock}></Image>  <label>{formatDisplayTime(data.event.eventDate)}</label></div>

                </div>
                {renderDetails()}

            </div>
        </div>
    )
}


export default SchedulePopUp