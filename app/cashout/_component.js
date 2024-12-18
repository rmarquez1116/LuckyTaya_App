'use client'
import Image from "next/image";
import cashout from '../../public/images/cashout.png'
// import dollar from '../../public/images/dollar.png'
import BalanceHeader from '../components/balanceHeader'
import Input from "../components/input";
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { formatMoney, formatMoneyV2 } from "../helpers/Common";
import { denomination } from '../lib/denomination';
import Alert from "../components/alert";
import Loading from "../components/loading";
import axios from "axios";
export default function CashOutComponent({ config }) {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const [total, setTotal] = useState(0)
    const [formData, setFormData] = useState({
        accountNumber: "",
        accountName: ""
    })
    const [alert, setAlert] = useState({ hasTimer: false, timeout: 3000, isOpen: false, message: "testing", type: "success" })

    useEffect(() => {
        if (amount) {
            setTotal(amount)
        }
    }, [amount])

    // const dropdown = banks.map(function (item) {
    //     return {
    //         label: item.bankName,
    //         value: item.bankCode
    //     }
    // })
    const formatAmount = (value) => {
        const numericValue = value.replace(/[^0-9.]/g, '');

        const [integerPart, decimalPart] = numericValue.split('.');
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        const formattedAmount = decimalPart
            ? `${formattedIntegerPart}.${decimalPart.substring(0, 2)}` // Limit decimal to 2 digits
            : formattedIntegerPart;

        return formattedAmount;
    };


    // const onBlur = ()=>{
    //     const parseAmount = parseFloat(amount.replaceAll(',', ''))
    //     setTotal(parseAmount)
    // }
    const onAmountChange = (e) => {
        const formattedValue = formatAmount(e.target.value);
        setTotal(formattedValue);
    };


    const onAccountNameChange = (e) => {
        const value = e.target.value
        updateField("accountName", value)
    }

    const onAccountNumberChange = (e) => {
        const value = e.target.value
        updateField("accountNumber", value)

    }

    const updateField = (field, value) => {
        setFormData((prevProfile) => ({
            ...prevProfile,
            [field]: value,
        }));
    };

    const onCashOut = async () => {

        if (!total) {
            setAlert({
                isOpen: true,
                isAnimating: false,
                timeout: 5000,
                isShow: true,
                message: "Please Enter Amount",
                type: "error"
            });
            return
        }

        if (!formData.accountName) {
            setAlert({
                isOpen: true,
                isAnimating: false,
                timeout: 5000,
                isShow: true,
                message: "Please Enter Account Name",
                type: "error"
            });
            return
        }
        if (!formData.accountNumber) {
            setAlert({
                isOpen: true,
                isAnimating: false,
                timeout: 5000,
                isShow: true,
                message: "Please Enter Account Number",
                type: "error"
            });
            return
        }

        const request = {
            trxAmount: Number.parseFloat(total.replaceAll(",", "")).toFixed(2),
            accountName: formData.accountName,
            accountNumber: formData.accountNumber
        }
        try {
            setIsLoading(true)
            const response = await axios.post('/api/cashout', request, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status != 200) {
                setAlert({
                    isOpen: true,
                    isAnimating: false,
                    timeout: 5000,
                    isShow: true,
                    message: "Can not process your request. Please check your balance",
                    type: "error"
                });
                return 0
            }
            setTotal(0);
            setFormData({
                accountName: "",
                accountNumber: ""
            })
            setAlert({
                isOpen: true,
                isAnimating: false,
                timeout: 5000,
                isShow: true,
                message: "Cashout is successful. Please wait a moment while we process your request",
                type: "success"
            });
        } catch (error) {
            console.error("Error cashout:", error);
            setAlert({
                isOpen: true,
                isAnimating: false,
                timeout: 5000,
                isShow: true,
                message: "Can not process your request. Please check your balance",
                type: "error"
            });
        }

        setIsLoading(false);
    }

    const onCloseAlert = (hasTimer) => {
        setAlert({ timeout: 3000, isOpen: false, type: "", message: "", hasTimer: false, })
    }
    return (
        <React.Fragment>
            {!isLoading &&
                <BalanceHeader type={2}></BalanceHeader>}
            {isLoading && <Loading></Loading>}
            {alert.isOpen && <Alert isAnimating={false} timeout={alert.timeout} hasTimer={alert.hasTimer} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}

            <div className="flex justify-center align-center  p-6 mt-5">
                <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
                    <div className="inline-flex gap-3 items-center justify-center">
                        <Image className="w-auto" alt="cashin" src={cashout}></Image>
                        <label className="text-center label-header1">Cash-Out</label>
                    </div>
                    <div className="bg-gray p-3 rounded-[20px] w-full">
                        <div className=" grid grid-cols-2 grid-rows-1 gap-4">
                            <label>Amount : </label>
                            <input className="text-right bg-dark p-2" type="text" id="amount" value={total} onChange={(e) => onAmountChange(e)}></input>

                            {/* <label className='text-right bg-dark p-2'>
                                {formatMoneyV2(amount)}
                            </label>
                            <label>Fee :</label>
                            <label className="text-right px-2 ">{formatMoneyV2(fee)}</label> */}
                        </div>
                    </div>

                    {/* <div className="grid grid-cols-3 items-center grid-rows-1 gap-1">
                        <label className="col-span-2">Total amount to be charge :</label>
                        <input className="px-2 text-[18px] transparent-input font-bold text-right" type="text" id="amount" value={`${formatMoneyV2(total)}`} onChange={(e) => onAmountChange(e)}></input>

                    </div> */}
                    <div className="grid grid-cols-3 grid-rows-3 gap-4  align-middle   place-items-center">
                        {denomination.map((object, i) => {
                            return <div onClick={() => setAmount(object)} key={`denomination-${i}`} className="amount-button text-center rounded-[20px] w-full p-3">{object}</div>
                        })}
                    </div>
                    {/* <Select placeholder="  Select Bank" options={dropdown}
                        classNamePrefix="drop-down"
                    /> */}

                    <div className='separator'>GCash</div>
                    <label>Recipient Name</label>

                    <Input value={formData.accountName} onChange={onAccountNameChange} type="text" id="account_name" ></Input>
                    <label>Mobile Number</label>

                    <Input value={formData.accountNumber} onChange={onAccountNumberChange} type="text" id="account_number" ></Input>

                    <button onClick={() => onCashOut()} className="primary w-full">Confirmed</button>

                </div>
                <br />

            </div>
        </React.Fragment >
    );
}