import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MenuItem({ href, icon, label,key }) {
    return (<React.Fragment  key={`fragment-${key}`} >
        <div key={`divs-${key}`} className='cursor-pointer bg-gray rounded-[40px] p-3 mt-3 flex gap-8'>
            <Image  key={`image-${key}`}  alt='icon' className='h-[15px] self-center' src={icon}></Image>
            <Link  key={`link-${key}`} href={href}>
                <label className='cursor-pointer label-header1 font-thin' key={`label-${key}`}>
                    {label}
                </label>
            </Link>
        </div>
    </React.Fragment>
    )
}
