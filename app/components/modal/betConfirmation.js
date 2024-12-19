import React from 'react'
import Input from '../input'
import dollar from '../../../public/images/dollar.png'
import tacoLeft from '../../../public/images/taco1.png'
import tacoRight from '../../../public/images/taco2.png'
import Image from 'next/image'
function BetConfirmation({ player, type, onClose, balance, amount }) {
    // type 1 Meron
    // type 2 wala

    const renderBody = () => {
        var className = type == 1 ? "meron" : "wala"
        var title = player
        return <div className="grid grid-cols-3 grid-rows-1 gap-4 items-center mx-[-23px]">
            <div>
                <Image alt="tacoLeft" src={tacoLeft}></Image>
            </div>
            <div className='text-center'>
                <div className={`${className}Color h-[110px] w-[110px] rounded-full m-auto label-header1`}>
                    <div className='h-full flex items-center'>
                        {title}

                    </div>
                </div>
            </div>
            <div className='justify-self-end'>
                <Image alt="tacoRight" src={tacoRight}></Image>
            </div>
        </div>

    }

    return (
        <div className='absolute justify-center  flex w-full h-full items-start overflow-hidden backdrop-blur   z-20'>
            <div className="text-center flex flex-col card max-w-sm gap-5 p-6 mt-10 bg-white rounded-3xl shadow">
                <div className="grid grid-cols-3 grid-rows-1 gap-4">
                    <div ></div>
                    <div className='text-center label-header1'>Confirm Bet</div>
                    <div className='text-right' onClick={() => onClose(false)}>X</div>
                </div>
                <Input disabled={true} readOnly={true} className='label-header1 text-center rounded-full bg-dark' value={amount}></Input>
                {/* <label>Payout: 168.00</label> */}
                {renderBody()}
                <div className="grid grid-cols-2 grid-rows-1 gap-4">
                    <div className='text-center'>

                        <button onClick={() => onClose(true)} className='w-full btn-confirm p-3 rounded-[10px]'>Confirmed</button>
                    </div>
                    <div className='text-center'>
                        <button onClick={() => onClose()} className='w-full btn-cancel p-3 rounded-[10px]'>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BetConfirmation