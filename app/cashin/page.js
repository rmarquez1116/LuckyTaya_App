'use client'
import MainLayout from "../layout/mainLayout";
import Image from "next/image";
import cashin from '../../public/images/cashin.png'
import dollar from '../../public/images/dollar.png'
import BalanceHeader from '../components/balanceHeader'
import Input from "../components/input";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import Repayment from "../actions/payment";
import { formatDate } from "../lib/DataFilter";
import QrCode from "../components/modal/qrCode";

const denomination = [
  "100", "200", "300", "100", "2,000", "3,000", "10,000", "15,000", "20,000"
]
export default function CashIn() {
  const [amount, setAmount] = useState('');
  const [isShowQr, setIsShowQr] = useState(false);
  const [qrData, setQrData] = useState('')
 
  const onCashIn = async () => {
    var date = new Date();
    var expireDate = new Date();
    expireDate.setHours(expireDate.getHours()+ 2)

    const data = {
      trxAmount: `${(Number.parseFloat(amount)).toFixed(2)}`.replaceAll(",","").replace(".",""),
      timeStart: formatDate(date.toISOString()),
      timeExpire: formatDate(expireDate.toISOString())

    }
    var payment = await Repayment(data);
    if(payment.response.code == "200"){
      setIsShowQr(true)
      setQrData(payment.response.codeUrl)
    }
    console.log({data,payment},'StarpayHello')
  }
  const router = useRouter();
  return (
    <MainLayout>
      <BalanceHeader type={2}></BalanceHeader>
      {isShowQr && <QrCode data={qrData} onClose={()=>setIsShowQr(false)}/>}
      <div className="flex justify-center align-center  p-6 mt-5">
        <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
          <div className="inline-flex gap-3 items-center justify-center">
            <Image alt="cashin" src={cashin}></Image>
            <label className="text-center">CashIn</label>
          </div>
          <div className="bg-gray p-3 rounded-[20px] w-full">
            <div className="inline-flex gap-3 items-center justify-center">
              <Image alt="dollar" src={dollar}></Image>
              <label className="text-center">300</label>
            </div></div>
          <div>
            <label>Amount</label>
          </div>
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
    </MainLayout >
  );
}