import React from 'react'

import bg from '../../../public/images/game-bg.png'

function EventsModal({ data, onSelect }) {
    return (
        <React.Fragment>
            <div className='z-50 absolute flex justify-center items-start flex w-full p-6 h-full overflow-hidden backdrop-blur'>
                <div className="flex flex-col items-center  h-[70%] w-full max-w-sm card gap-5 p-5 bg-white rounded-3xl shadow">
                    <h1 className='text-xl'>Select Event</h1>
                    <div className='flex flex-col items-center gap-5 overflow-auto w-full'>
                        {data.map((item, index) => {
                            return <EventDetails key={`event-${index}`} onSelect={onSelect} data={item} />
                        })}

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

function EventDetails({ data, onSelect }) {
    const formatDisplayDate = (date) => {
        var newDate = new Date(date);
        return newDate.toDateString();
    }

    return <React.Fragment>
        <div onClick={() => onSelect(data)} className="rounded-[20px] card max-w-md  bg-center cursor-pointer p-5 w-full"
            style={
                {
                    backgroundImage: `url(${bg.src})`,
                    backgroundSize: '100% 100%'
                }
            }>
            <div className="cursor-pointer grid grid-cols-4 grid-rows-1 gap-2">
                <div className="col-span-4 uppercase label-header">
                    <div>
                        <label>{data.event.eventName}</label>
                    </div>
                    <div>
                        <label>{data.venue.venueName}</label>
                    </div>
                    <div>
                        <label>{formatDisplayDate(data.event.eventDate)}</label>
                    </div>

                </div>
            </div>
        </div>
    </React.Fragment>
}

export default EventsModal