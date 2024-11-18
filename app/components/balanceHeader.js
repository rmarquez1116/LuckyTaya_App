'use client'
import React, { useEffect, useState } from 'react'
import dollar from '../../public/images/dollar.png'
import Image from 'next/image'
import avatar from '../../public/images/avatar/avatar1.png'
import { getAccountDetails, getSession } from '../actions/auth'

function BalanceHeader({ type, forceUpdate }) {
    const [balance, setBalance] = useState("0")
    const [isLoaded, setIsLoaded] = useState(false)
    const getBal = async () => {
        const account = await getAccountDetails();
        if (account)
            setBalance((account.balance).toLocaleString())
        setIsLoaded(true)
    }
    useEffect(() => {

        getBal();
    }, [type, forceUpdate])
    if (isLoaded)
        if (type == 1)
            return (
                <div className='balance-header1'>
                    <div className='inline-flex gap-2 label-header1 bold items-center font-bold'>
                        <Image alt='dollar' className="w-[20px] h-[20px]" src={dollar}></Image>
                        {" "}{balance}</div>
                    <label>Current Balance</label>
                </div>
            )
        else {
            return (
                <div className='balance-header2'>
                    <div className='inline-flex gap-2 items-center'>
                        <label>Current Balance</label>
                        <Image alt='dollar' className="w-[20px] h-[20px]" src={dollar}></Image>
                        <label className=' font-bold label-header1'>
                            {balance}
                        </label>
                    </div>
                    <Image alt="avatar" className="w-[20px] h-[20px]" src={avatar}></Image>

                </div>
            )
        }
    else return <></>
}

export default BalanceHeader