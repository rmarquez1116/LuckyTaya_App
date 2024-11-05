import React from 'react'
import Input from '../input'
import dollar from '../../../public/images/dollar.png'
import tacoLeft from '../../../public/images/taco1.png'
import tacoRight from '../../../public/images/taco2.png'
import Image from 'next/image'
const denomination = [
    "100", "200", "300", "100", "2,000", "3,000", "10,000", "15,000", "20,000"
]
function BetConfirmation({ type, onClose, balance }) {
    // type 1 Meron
    // type 2 wala

    const renderBody = () => {
        var className = type == 1 ? "meron" : "wala"
        var title = type == 1 ? "Meron" : "Wala"
        return <div className="grid grid-cols-3 grid-rows-1 gap-4 items-center mx-[-23px]">
            <div>
                <Image src={tacoLeft}></Image>
            </div>
            <div className='text-center'>
                <div className={`${className}Color h-20 w-20 rounded-full m-auto leading-[80px]`}>
                    {title}
                </div>
            </div>
            <div className='justify-self-end'>
                <Image src={tacoRight}></Image>
            </div>
        </div>

    }

    return (
        <div className='absolute justify-center items-center flex w-full h-full overflow-hidden backdrop-blur'>
            <div className="text-center flex flex-col card max-w-sm gap-5 p-6 mt-10 bg-white rounded-3xl shadow">
                <div className="grid grid-cols-3 grid-rows-1 gap-4">
                    <div ></div>
                    <div className='text-center'>Confirm Bet</div>
                    <div className='text-right'>X</div>
                </div>
                <Input className='text-center rounded-full bg-dark' value="100"></Input>
                <label>Payout: 168.00</label>
                {renderBody()}
                <div className="grid grid-cols-2 grid-rows-1 gap-4">
                    <div className='text-center'>

                        <button className='w-full btn-confirm p-3 rounded-[10px]'>Confirmed</button>
                    </div>
                    <div className='text-center'>
                        <button className='w-full btn-cancel p-3 rounded-[10px]'>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BetConfirmation