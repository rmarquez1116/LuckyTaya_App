'use client';
import React, { useEffect, useState } from 'react'
import Day from './day';


function Calendar({ currentDate, schedule, onSelect }) {
    currentDate = new Date(currentDate);
    const [data, setData] = useState([])
    useEffect(() => {
        // console.log(schedule)
        setData(schedule)
        return () => {
        }
    }, [schedule])


    const currentMonthIndex = currentDate.getMonth();
    const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const label = `${currentDate.getFullYear()}-${currentDate.getMonth()+1}`

    function getDayClassName(date) {
        var fightDetail = [...data].reverse().find(x => (new Date(x.eventDate).toLocaleDateString() == date.toLocaleDateString()))
        if (!fightDetail)
            return 'default';
        switch (fightDetail.statusDesc) {
            case "Waiting":
                return "schedule";
            case "Cancelled":
            case "Closed":
            case "ClosedWithResult":
                return "finish";
            case "Open":
                return "current";
            default:
                return 'default';
        }
    }

    function onSelectData(date, color) {
        var fightDetail = [...data].reverse().filter(x => (new Date(x.eventDate).toLocaleDateString() == date.toLocaleDateString()))
        if (fightDetail) {
            fightDetail.color = color;
        }
        onSelect(fightDetail)
    }

    const dateBoxes = Array.from(
        { length: Math.ceil((daysInMonth + firstDayOfWeek) / 7) },
        (_, i) => i,
    ).map((week, i) => (
        Array.from({ length: 7 }, (_, i) => i).map((day) => {
            const date = week * 7 + day + 1 - firstDayOfWeek;
            const isCurrentMonth = currentDate.getMonth() === currentMonthIndex;
            const actualDate = new Date();
            const actualMonth = actualDate.getMonth();
            const isActualMonth = actualMonth === currentMonthIndex;
            const actualYear = actualDate.getFullYear();
            const isActualYear = actualYear === currentDate.getFullYear();
            const isToday = isActualMonth && isActualYear && currentDate.getDate() === date;

            let dateText;
            if (date < 1 || date > daysInMonth) {
                dateText = "";
            } else {
                dateText = date;
            }
            const dataDate = new Date(`${actualYear}/${actualMonth + 1}/${date}`);
            if (dateText == "") return <div key={`day-empty-${date}`}></div>;
            else return (<React.Fragment key={`day-${dateText}`}>
                <Day data={dataDate} onSelect={onSelectData} id={`dy-${dateText}`} color={getDayClassName(dataDate)} label={dateText} />
            </React.Fragment>
            );
        })
        // </div>
    ));



    return (
        <>
            {/* <CenterLabel label={label} /> */}
            <div className="card2 rounded-[20px] max-w-md  p-3  w-full text-center w-min-sm">

                <div className="grid grid-cols-7 grid-rows-1 gap-1">
                    <div >Su</div>
                    <div >Mo</div>
                    <div >Tu</div>
                    <div >We</div>
                    <div >Th</div>
                    <div >Fr</div>
                    <div >Sa</div>

                </div>
                <div className="grid grid-cols-7 grid-rows-1 gap-1  align-middle   place-items-center ">

                    {dateBoxes}

                </div>
            </div>
        </>
    )
}

export default Calendar