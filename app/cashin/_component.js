'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import cashin from '../../public/images/cashin.png'
import dollar from '../../public/images/dollar.png'
import BalanceHeader from '../components/balanceHeader'
import Input from "../components/input";
import { useRouter } from 'next/navigation'
import Repayment from "../actions/payment";
import QrCode from "../components/modal/qrCode";
import { formatMoney } from '../helpers/Common'

const denomination = [
    "100", "200", "300", "1,000", "2,000", "3,000", "10,000", "15,000", "20,000"
]


export default function CashIn({ config }) {
    const [amount, setAmount] = useState('');
    const [isShowQr, setIsShowQr] = useState(false);
    const [qrData, setQrData] = useState('')
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


    const onCashIn = async () => {
        var payment = await Repayment({
            trxAmount: `${(Number.parseFloat(total)).toFixed(2)}`.replaceAll(",", "").replace(".", ""),
            fee: fee
        });
        if (payment.response.code == "200") {
            setIsShowQr(true)
            setQrData(payment.response.codeUrl)
        }
    }
    const router = useRouter();
    return (
        <React.Fragment>

            <BalanceHeader type={2}></BalanceHeader>
            {isShowQr && <QrCode data={qrData} onClose={() => setIsShowQr(false)} />}
            <div className="flex justify-center align-center  p-6 mt-5">
                <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
                    <div className="inline-flex gap-3 items-center justify-center">
                        <Image className="w-auto" alt="cashin" src={cashin}></Image>
                        <label className="text-center label-header1">Cash-In</label>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-1 gap-4">
                        <label>Amount</label>
                        <label className="text-right">Fee : {getFee(true)}
                        </label>
                    </div>
                    <div className="bg-gray p-3 rounded-[20px] w-full">
                        <div className="inline-flex gap-3 items-center justify-center">
                            <Image alt="dollar" src={dollar}></Image>
                            <label className="text-center">{total}</label>
                        </div></div>



                    <Input type="text" id="amount" value={amount} onChange={(e) => setAmount(e.value)}></Input>
                    <div className="grid grid-cols-3 grid-rows-3 gap-4  align-middle   place-items-center">
                        {denomination.map((object, i) => {
                            return <div onClick={() => setAmount(object)} key={`denomination-${i}`} className="amount-button text-center rounded-[20px] w-full p-3">{object}</div>
                        })}
                    </div>
                    <button onClick={() => onCashIn()} className="primary w-full">Confirmed</button>
                </div>
                <br />

            </div>
        </React.Fragment>
    );
}