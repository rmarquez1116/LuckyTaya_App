import Image from 'next/image'
import React from 'react'

function DashboardButton({ img, label,onClick }) {
    return (
        <div className='rounded-[20px] sidebar-button p-2' onClick={onClick}>
            <div className='h-[60px]  flex flex-row justify-center items-center'>
                <Image alt="dashboardbutton" src={img}></Image>
            </div>
            <label>{label}</label>
        </div>
    )
}

export default DashboardButton