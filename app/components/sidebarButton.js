import Image from 'next/image'
import React from 'react'

function SidebarButton({img,label}) {
    return (
        <div>
            <div className='rounded-[10px] sidebar-button h-[80px] flex justify-center items-center'>
                <Image alt='sidebar' src={img}></Image>
            </div>
            <label>{label}</label>
        </div>
    )
}

export default SidebarButton