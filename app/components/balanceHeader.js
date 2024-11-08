'use client'
import React, { useEffect, useState } from 'react'
import dollar from '../../public/images/dollar.png'
import Image from 'next/image'
import avatar from '../../public/images/avatar/avatar1.png'
import { getAccountDetails, getSession } from '../actions/auth'

function BalanceHeader({ type }) {
    const [balance, setBalance] = useState("0")
    const getBal = async () => {
        const account = await getAccountDetails();
        setBalance((account.balance).toLocaleString())
    }
    useEffect(() => {
        getBal();
    }, [])

    if (type == 1)
        return (
            <div className='balance-header1'>
                <div className='inline-flex'>
                    <Image alt='dollar' className="w-[20px] h-[20px]" src={dollar}></Image>
                    {" "}{balance}</div>
                <label>Current Balance</label>
            </div>
        )
    else {
        return (
            <div className='balance-header2'>
                <div className='inline-flex gap-2'>
                    <label>Current Balance</label>
                    <Image alt='dollar' className="w-[20px] h-[20px]" src={dollar}></Image>
                    {" "}{balance}
                </div>
                <Image alt="avatar" className="w-[20px] h-[20px]" src={avatar}></Image>

            </div>
        )
    }
}

export default BalanceHeader