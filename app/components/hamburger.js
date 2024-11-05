import React from 'react'

export default function Hamburger({toggle}) {
    return (
        <button onClick={toggle} className="relative group no-bg">
            <div className="relative flex overflow-hidden items-center justify-center  w-[30px] h-[30px] transform transition-all duration-200 shadow-md">
                <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden group-focus:-translate-x-1.5 group-focus:rotate-180">
                    <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:rotate-[42deg] group-focus:w-2/3 delay-150"></div>
                    <div className="bg-white h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10"></div>
                    <div className="bg-white h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:-rotate-[42deg] group-focus:w-2/3 delay-150"></div>
                </div>
            </div>
        </button>
    )
}
