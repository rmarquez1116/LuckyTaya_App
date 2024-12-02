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
import ConfirmationModal from "../components/confirmationModal";
import { denomination } from '../lib/denomination';
import Loading from "../components/loading";



export default function RequestFund({ config }) {
    const [amount, setAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false)

    const [alert, setAlert] = useState({
        isShow: false,
        message: "Invalid Pin",
        isOkayOnly: true,
        onConfirm: () => { }
    })



    const onRequestFund = async () => {
        setIsLoading(true)
        var payment = await Repayment({
            amount: `${(Number.parseFloat(amount.replaceAll(",", ""))).toFixed(2)}`.replaceAll(",", ""),
        });
        setIsLoading(false)
        var message = "Please try again."
        if (payment) {
           message = "Request successfully submitted."
        } 

        setAlert({
            isShow: true,
            message: message,
            isOkayOnly: true,
            onConfirm: onConfirm
        })
    }

    const onConfirm = () => {
        setAlert({
            isShow: false,
            message: "Invalid Pin",
            isOkayOnly: true
        })
        setAmount(0)
    }

    return (
        <React.Fragment>

            <BalanceHeader type={2}></BalanceHeader>
            <ConfirmationModal
                isOpen={alert.isShow}
                isOkOnly={alert.isOkayOnly}
                onConfirm={alert.onConfirm}
                message={alert.message}
            ></ConfirmationModal>
            <div className="flex justify-center align-center  p-6 mt-5">
                <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
                    <div className="inline-flex gap-3 items-center justify-center">
                        <Image className="w-auto" alt="cashin" src={cashin}></Image>
                        <label className="text-center label-header1">Request Fund</label>
                    </div>
                    <div className="bg-gray p-3 rounded-[20px] w-full">
                        <div className=" grid grid-cols-2 grid-rows-1 gap-4 items-center">
                            <label>Amount : </label>
                            <label className='text-right bg-dark p-2'>
                                {formatMoneyV2(amount)}
                            </label>
                          </div>
                    </div>

                    <div className="grid grid-cols-3 grid-rows-3 gap-4  align-middle   place-items-center">
                        {denomination.map((object, i) => {
                            return <div onClick={() => setAmount(object)} key={`denomination-${i}`} className="amount-button text-center rounded-[20px] w-full p-3">{object}</div>
                        })}
                    </div>
                    <button onClick={() => onRequestFund()} className="primary w-full">Confirmed</button>
                </div>
                <br />
                {isLoading && <Loading/>}
            </div>
        </React.Fragment>
    );
}