import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function MenuItem({ isEnabled, href, icon, label, key }) {

    const cursor = isEnabled ? "cursor-pointer" : (href == "/profile_menu" ? "cursor-pointer" : "cursor-not-allowed")
    const renderBody = () => {
        if (cursor == 'cursor-pointer') {
            return <Link key={`link-${key}`} href={href}>
                <label className={`${cursor} label-header1 font-thin`} key={`label-${key}`}>
                    {label}
                </label>
            </Link>
        } else
            return <label className={`${cursor} label-header1 font-thin`} key={`label-${key}`}>
                {label}
            </label>
    }

    return (<React.Fragment key={`fragment-${key}`} >
        <div key={`divs-${key}`} className={`${cursor} bg-gray rounded-[40px] p-3 mt-3 flex gap-8`}>
            <Image key={`image-${key}`} alt='icon' className='h-[15px] self-center' src={icon}></Image>
            {renderBody()}
        </div>
    </React.Fragment>
    )
}
