import { formatMoneyV2 } from '@app/helpers/Common';
import Image from 'next/image';
import React from 'react'

// import meron from '../../public/images/meron.png'
// import wala from '../../public/images/wala.png'
// import { isJsonEmpty } from '../lib/utils';

function MeronWala({dataByPlayer, player, type, data }) {
    const color = type == 1 ? "meronColor" : "walaColor";
    const title = type == 1 ? "Pula" : "Asul";
    const getSafeData = (data, field) => {
        try {
            return data[field]
        } catch (error) {
            return "0.00"
        }
    }

    const calculateOddPercentage = (data) => {

        const numerator = parseFloat(getSafeData(data, `s${type}a`))
        const denominator = parseFloat(getSafeData(data, 's1a')) + parseFloat(getSafeData(data, 's0a'))

        if (numerator === 0 || denominator === 0) {
            return '0 %'
        }

        return `${((numerator / denominator) * 100).toFixed(0)} %`
    }




    return (<React.Fragment>
        <div className="col card rounded-[20] text-center  p-3 mt-8 cursor-pointer">
            <div className={`${color} rounded-full h-20 w-20 mt-[-40px] items-center  flex justify-center justify-self-center`}>
                {/* {title} */}

                {calculateOddPercentage(data)}
            </div>
            {/* <br /> */}
            <h1 className='text-base'>{player}</h1>

           Total Bet : {formatMoneyV2(getSafeData(data, `s${type}a`))} <br />
            <span className='label-header1'>
            </span>

            <div className="bg-dark-no-border mt-2 p-1 rounded-[20px] border-transparent">
                Payout<br />
                {formatMoneyV2(getSafeData(data, `s${type}o`))}
            </div>
        </div>
        <div className='bg-dark text-center mt-2'>My Bet : {formatMoneyV2(getSafeData(dataByPlayer, `s${type}Total`))} </div>
    </React.Fragment>
    )
}

export default MeronWala