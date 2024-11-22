'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import cashin from '../../public/images/cashin.png'
// import dollar from '../../public/images/dollar.png'
import BalanceHeader from '../components/balanceHeader'
import Input from "../components/input";
import { useRouter } from 'next/navigation'
import Repayment from "../actions/payment";
import QrCode from "../components/modal/qrCode";
import { formatMoney, formatMoneyV2 } from '../helpers/Common'
import { validateMpin } from "../actions/pin";
import PinV2 from "../components/modal/pinModalV2";

const denomination = [
    "100", "200", "300", "1,000", "2,000", "3,000", "10,000", "15,000", "20,000"
]


export default function CashIn({ config }) {
    const [amount, setAmount] = useState(0);
    const [isShowQr, setIsShowQr] = useState(false);
    const [qrData, setQrData] = useState('')
    const [total, setTotal] = useState(0)
    const [fee, setFee] = useState(0)
    const [isShowPin, setIsShowPin] = useState(false)
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
            if (config.type == 1) {
                setFee(parseFee)
                setTotal(formatMoney(parseAmount + parseFee))
            } else {
                setFee(parseAmount * parseFee)
                setTotal(formatMoney(parseAmount + (parseAmount * parseFee)))
            }
        }
    }, [amount])

    const onValidatePin = async (pin) => {
        const result = await validateMpin(pin);

        if (result == true) {
            setIsShowPin(false);
            var payment = await Repayment({
                trxAmount: `${(Number.parseFloat(total)).toFixed(2)}`.replaceAll(",", "").replace(".", ""),
                fee: fee
            });
            if (payment.response.code == "200") {
                setIsShowQr(true)
                setQrData(payment.response.codeUrl)
            }
        } else {
            alert("Invalid Pin")
        }
    }

    const onCashIn = async () => {
        setIsShowPin(true);
    }
    const router = useRouter();
    const onQrClose = () => {
        setIsShowQr(false)
        router.replace('/')
    }
    const onAmountChange = (e) => {
        const value = e.target.value.replace(',','')
        if (/^\d*(\.\d*)?$/.test(value)) {
            setAmount(value)
        }
    }
    return (
        <React.Fragment>

            <BalanceHeader type={2}></BalanceHeader>
            {isShowPin && <PinV2 title="Set Pin" isOpen={isShowPin} onClose={() => { setIsShowPin(false) }} onSubmit={(e) => onValidatePin(e)} />}

            {isShowQr && <QrCode data={qrData} onClose={() => onQrClose()} />}
            <div className="flex justify-center align-center  p-6 mt-5">
                <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
                    <div className="inline-flex gap-3 items-center justify-center">
                        <Image className="w-auto" alt="cashin" src={cashin}></Image>
                        <label className="text-center label-header1">Cash-In</label>
                    </div>
                    <div className="bg-gray p-3 rounded-[20px] w-full">
                        <div className=" grid grid-cols-2 grid-rows-2 gap-4">
                            <label>Amount : </label>
                            <label className='text-right bg-dark p-2'>
                                {formatMoneyV2(amount)}
                            </label>
                            <label>Fee :</label>
                            <label className="text-right px-2 ">{formatMoneyV2(fee)}</label>
                        </div>
                        {/* <div className="inline-flex gap-3 items-center justify-center">
                               <label className="text-center">{total}</label>
                        </div> */}

                    </div>

                    <div className="grid grid-cols-3 items-center grid-rows-1 gap-1">
                        <label className="col-span-2">Total amount to be charge :</label>
                        <input readOnly className="px-2 text-[18px] transparent-input font-bold text-right" type="text" id="amount" value={`${formatMoneyV2(total)}`} onChange={(e) => onAmountChange(e)}></input>

                    </div>
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