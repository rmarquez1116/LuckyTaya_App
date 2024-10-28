import Image from 'next/image';
import React from 'react'

import meron from '../../public/images/meron.png'
import wala from '../../public/images/wala.png'

function MeronWala({type}) {
    const img_button = type == 1 ? meron : wala;
    return (<div className="col card rounded-[20] text-center  p-3 mt-10">
        <Image alt='meronwala' className='m-auto mt-[-50px]' src={img_button}></Image>
        <br/>
        1,000,000 <br />
        Bet<br />
        1
        <div className="bg-dark-no-border p-1 rounded-[20px] border-transparent">
            Payout<br />
            100,000
        </div>
    </div>
    )
}

export default MeronWala