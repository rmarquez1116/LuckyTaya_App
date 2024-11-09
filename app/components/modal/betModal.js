import React, { useState,useEffect } from 'react'
import Input from '../input'
import dollar from '../../../public/images/dollar.png'
import Image from 'next/image'
const denomination = [
    "100", "200", "300", "100", "2,000", "3,000", "10,000", "15,000", "20,000"
]
function BetModal({ type, onClose, balance,data,setAmountToBet }) {
    // type 1 Meron
    // type 2 wala
    const [amount, setAmount] = useState(0)
    useEffect(() => {
        setAmountToBet(type,amount)
      return () => {
        // setAmount(0)
      }
    }, [amount])
    
    const setTheAmount = (e)=>{
        setAmount(e.value)
    }

    const renderDemonimation = () => {
        return <>
            <Input placeholder="Enter Amount:" type="text" id="amount" value={amount} onChange={setTheAmount}></Input>
            <div className="grid grid-cols-3 grid-rows-3 gap-4  align-middle   place-items-center">
                {denomination.map((object, i) => {
                    return <div onClick={() => setAmount(object)} key={`denomination-${i}`} className="amount-button text-center rounded-[20px] w-full p-3">{object}</div>
                })}
            </div></>
    }

    const renderDescription = () => {
        return <div className="grid grid-cols-3 grid-rows-1 gap-4">

            <div className='p-2 rounded-[10] default w-full col-span-2 inline-flex gap-2 text-center font-bold label-header1'>
                <Image alt="dollar" src={dollar}></Image>
                {balance}
            </div>
            <div className='p-2 rounded-[10] default text-center'>Fight# {data.fight.fightNum}</div>


        </div>
    }
    const renderBody = () => {
        if (type == 1)
            return <>

                <div className="grid grid-cols-3 grid-rows-1 gap-4">
                    <div ></div>
                    <div className='inline-flex gap-2 text-center label-header1'><div className='meronColor rounded-full h-5 w-5'></div>Meron</div>
                    <div className='text-right' onClick={()=>onClose(false)}>X</div>


                </div>
                {renderDescription()}
                {renderDemonimation()}
                <button onClick={()=>onClose(true)} className='p-2 meronColor rounded-[20] w-full'>PLACE BET ON MERON</button>

            </>
        else return <>
            <div className="grid grid-cols-3 grid-rows-1 gap-4">
                    <div ></div>
                    <div className='inline-flex gap-2 text-center  label-header1'><div className='walaColor rounded-full h-5 w-5'></div>Wala</div>
                    <div className='text-right' onClick={()=>onClose(false)}>X</div>


                </div>
                {renderDescription()}
                {renderDemonimation()}
                <button onClick={()=>onClose(true)} className='p-2 walaColor rounded-[20] w-full'>PLACE BET ON WALA</button>


        </>
    }

    return (
        <div className='absolute justify-center  flex w-full overflow-hidden backdrop-blur'>
            <div className="flex flex-col card max-w-sm gap-5 p-6 mt-10 bg-white rounded-3xl shadow">


                {renderBody()}

            </div>
        </div>
    )
}

export default BetModal