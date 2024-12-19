import Image from 'next/image';
import React from 'react'

// import meron from '../../public/images/meron.png'
// import wala from '../../public/images/wala.png'
// import { isJsonEmpty } from '../lib/utils';

function MeronWala({player, type, data }) {
    const color = type == 1 ? "meronColor" : "walaColor";
    const title = type == 1 ? "Pula" : "Asul";
    const getSafeData = (data, field) => {
        try {
            return data[field]
        } catch (error) {
            return "0"
        }
    }
    return (<div className="col card rounded-[20] text-center  p-3 mt-10 cursor-pointer">
        <div className={`${color} rounded-full h-20 w-20 mt-[-40px] items-center  flex justify-center justify-self-center`}>
            {/* {title} */}
        </div>
        <br />
            <h1 className='text-base'>{player}</h1>
        <span className='label-header1'>
            {getSafeData(data, `s${type}a`)} <br />
        </span>
        Bet<br />

        <div className="bg-dark-no-border p-1 rounded-[20px] border-transparent">
            Payout<br />
            {parseFloat(getSafeData(data, `s${type}o`)).toFixed(2)}
        </div>
    </div>
    )
}

export default MeronWala