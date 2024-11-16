'use client'
import Image from "next/image";
import cashout from '../../public/images/cashout.png'
import dollar from '../../public/images/dollar.png'
import BalanceHeader from '../components/balanceHeader'
import Input from "../components/input";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { formatMoney } from "../helpers/Common";
const denomination = [
    "100", "200", "300", "100", "2,000", "3,000", "10,000", "15,000", "20,000"
]
export default function CashOutComponent({ banks, config }) {
    const [amount, setAmount] = useState('');

    const router = useRouter();
    const [total, setTotal] = useState(0)
    const [fee, setFee] = useState(0)
    const getFee = (isForDisplay) => {
        if (config) {
            if (config.type == 1) {
                return config.convenienceStatic
            } else {
                if (isForDisplay) {
                    return `${config.conveniencePercentage * 100}%`
                }
                return config.conveniencePercentage
            }
        }
    }
    useEffect(() => {
        if (amount) {
            const parseAmount = parseFloat(amount.replaceAll(',', ''))
            const parseFee = getFee(false);
            console.log({ amount, parseAmount, parseFee })
            if (config.type == 1) {
                setFee(parseFee)
                setTotal(formatMoney(parseAmount + parseFee))
            } else {
                setFee(parseAmount * parseFee)
                setTotal(formatMoney(parseAmount + (parseAmount * parseFee)))
            }
        }
    }, [amount])

    const dropdown = banks.map(function (item) {
        return {
            label: item.bankName,
            value: item.bankCode
        }
    })



    return (
        <React.Fragment>
            <BalanceHeader type={2}></BalanceHeader>
            <div className="flex justify-center align-center  p-6 mt-5">
                <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
                    <div className="inline-flex gap-3 items-center justify-center">
                        <Image className="w-auto" alt="cashin" src={cashout}></Image>
                        <label className="text-center label-header1">Cash-Out</label>
                    </div>
                    <div className="bg-gray p-3 rounded-[20px] w-full">
                        <div className="inline-flex gap-3 items-center justify-center">
                            <Image alt="dollar" src={dollar}></Image>
                            <label className="text-center">{total}</label>
                        </div></div>
                    <div className="grid grid-cols-2 grid-rows-1 gap-4">
                        <label>Amount</label>
                        <label className="text-right">Fee : {getFee(true)}
                        </label>
                    </div>
                    <Input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.value)}></Input>
                    <div className="grid grid-cols-3 grid-rows-3 gap-4  align-middle   place-items-center">
                        {denomination.map((object, i) => {
                            return <div onClick={() => setAmount(object)} key={`denomination-${i}`} className="amount-button text-center rounded-[20px] w-full p-3">{object}</div>
                        })}
                    </div>
                    <Select placeholder="  Select Bank" options={dropdown}
                        classNamePrefix="drop-down"
                    />
                    <label>Account Name</label>

                    <Input type="text" id="account_name" ></Input>
                    <label>Account Number</label>

                    <Input type="text" id="account_number" ></Input>

                    <button className="primary w-full" onClick={()=> router.push('/payment/failed')}>Confirmed</button>
                </div>
                <br />

            </div>
        </React.Fragment >
    );
}