import Image from 'next/image';
import React from 'react'

import meron from '../../public/images/meron.png'
import wala from '../../public/images/wala.png'
import { isJsonEmpty } from '../lib/utils';

function MeronWala({ type, data }) {
    const img_button = type == 1 ? meron : wala;
    const getSafeData = (data, field) => {
        try {
            return data[field]
        } catch (error) {
            return "0"
        }
    }
    return (<div className="col card rounded-[20] text-center  p-3 mt-10 cursor-pointer">
        <Image alt='meronwala' className='m-auto mt-[-50px]' src={img_button}></Image>
        <br />
        <span className='label-header1'>

            {getSafeData(data, `s${type}a`)} <br />
        </span>
        Bet<br />
        
        {/* <div className="bg-dark-no-border p-1 rounded-[20px] border-transparent">
            Payout<br />
            {parseFloat(getSafeData(data, `s${type}o`)).toFixed(2)}
        </div> */}
    </div>
    )
}

export default MeronWala