import React from 'react'
import calendar from '../../../public/images/calendar.png'
import clock from '../../../public/images/clock.png'
import Image from 'next/image'
import Tables from '../tables'
function SchedulePopUp({ data, onClose }) {

    const getMeronWalaName = (fightDetails,side) =>{
        if(fightDetails){
            const item =fightDetails.find(x=>x.side == side);
            if(item){
                return `${item.owner} ${item.breed}`
            }
        }
        return ""
    }
    const getWinnerDescription = (result)=>{
        if(result){
            return result.winSide == 1 ? "Meron Wins" : result.winSide == 0 ? "Wala Wins" : "Cancelled"
        }
        return ""
    }
    const tableFight = data.fights.map((item) => {
        
        return {
            fightNumber: item.fight.fightNum,
            player1: getMeronWalaName(item.fightDetails,1),
            player2: getMeronWalaName(item.fightDetails,0),
            winner : getWinnerDescription(item.winnerResult)
        }

    })
    
    const formatDisplayDate = (date) => {
        var newDate = new Date(date);
        return newDate.toDateString();
    }
    const formatDisplayTime = (date) => {
        var newDate = new Date(date).toLocaleTimeString();

        return newDate.substring(0, newDate.length - 6) + " " + newDate.slice(8);
    }
    return (
        <div className='z-10 absolute flex justify-center items-center flex w-full overflow-hidden backdrop-blur'>
            <div className="flex overflow-auto flex-col items-center  w-full max-w-sm card gap-3 p-6 bg-white rounded-3xl shadow">
                <div className="grid grid-cols-7 w-full grid-rows-1 gap-4  p-3  ">
                    <div className='flex justify-start font-black  cursor-pointer' onClick={onClose}>&lt;</div>
                    <div className="col-span-5">
                        <div>
                            <label className='label-header1'>{data.event.eventName}</label>
                        </div>
                        <div>
                            <label className='label-header1'>{data.venue.venueName}</label>
                        </div>
                    </div>
                    <div className='flex justify-end text-red text-[20px] font-black cursor-pointer label-header1' onClick={onClose}>X</div>

                </div>
                {/* <div className={`h-2 w-full ${data.color}`}></div> */}
                <div className="grid grid-cols-2 grid-rows-1 gap-4 p-3 rounded-[20px]">
                    <div className='inline-flex gap-2 items-center'><Image alt="calendar" className="w-[20px] h-[20px]" src={calendar}></Image>  <label>{formatDisplayDate(data.event.eventDate)}</label></div>
                    <div className='inline-flex gap-2 items-center justify-end'><Image alt="time" className="w-[20px] h-[20px]" src={clock}></Image>  <label>{formatDisplayTime(data.event.eventDate)}</label></div>

                </div>
                <Tables
                    primaryId="id"
                    headers={[
                        {
                            key: 'fightNumber',
                            label: 'Game #',
                        }, {
                            key: 'player1',
                            label: 'Pula'
                        }, {
                            key: 'player2',
                            label: 'Asul'
                        }, {
                            key: 'winner',
                            label: 'Result'
                        },
                    ]}
                    items={tableFight}
                    isCentered={false}
                />
            </div>
        </div>
    )
}


export default SchedulePopUp