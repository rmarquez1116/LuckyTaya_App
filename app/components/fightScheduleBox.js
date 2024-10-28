import Image from 'next/image'
import React from 'react'
import calendar from '../../public/images/calendar.png'

function FightScheduleBox() {
    return (
        <div className="flex flex-col card dark-gradient max-w-sm p-6 mt-10 bg-white rounded-3xl shadow">
            <div className='flex justify-between'>
                <label>Fight Schedule</label>
                
                <button className="dark">• • •</button>
            </div>
            
            <label>Fight schedules may change anytime</label>
            <br />
            <label>TALPAKAN E-BILLIARD (SET-A) CAVITE PLAYER EARLY BIRD ELIMS (SET-B) 420 TOTAL FIGHTS</label>
            <br/>
           <hr/>
           <br/>
           <div className='flex justify-between'>
                <div className='inline-flex'><Image alt="calendar" className="w-[20px] h-[20px]" src={calendar}></Image>{" "}SEPTEMBER 20,2024</div>
                
                <button className="violet">Ongoing Event</button>
            </div>
            
        </div>
    )
}

export default FightScheduleBox