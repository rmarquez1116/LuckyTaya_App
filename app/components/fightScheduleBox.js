import Image from 'next/image'
import React from 'react'
import calendar from '../../public/images/calendar.png'
import { useRouter } from 'next/navigation'

function FightScheduleBox({ data }) {
    const router = useRouter();
    const formatDisplayDate = (date) => {
        var newDate = new Date(date);
        return newDate.toDateString();
    }
    return (
        <div  onClick={()=>router.push('/game')} className="cursor-pointer  flex flex-col justify-self-center card dark-gradient w-full max-w-sm p-6 mt-10 bg-white rounded-3xl shadow">
            <div className='flex justify-between'>
                <label>Fight Schedule</label>

                <button className="dark">• • •</button>
            </div>

            <label>Fight schedules may change anytime</label>
            <br />
            <div className="col-span-4">
                <div>
                    <label>{data.event.eventName}</label>
                </div>
                <div>
                    <label>{data.venue.venueName}</label>
                </div>
            </div>
            <br />
            <hr />
            <br />
            <div className='flex justify-between'>
                <div className='inline-flex gap-2 items-center'><Image alt="calendar" className="w-[20px] h-[20px]" src={calendar}></Image>  <label>{formatDisplayDate(data.event.eventDate)}</label></div>

                <button className="violet">Betting: {data.fightStatus.name}</button>
            </div>

        </div>
    )
}

export default FightScheduleBox