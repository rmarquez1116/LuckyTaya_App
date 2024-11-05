'use client'
import Link from "next/link";
import MainLayout from "../layout/mainLayout";
import Form from "../components/form";
import Image from "next/image";
import cashout from '../../public/images/cashout.png'
import dollar from '../../public/images/dollar.png'
import BalanceHeader from '../components/balanceHeader'
import Input from "../components/input";
import { useRouter } from 'next/navigation'

const denomination = [
  "100", "200", "300", "100", "2,000", "3,000", "10,000", "15,000", "20,000"
]
export default function CashOut() {
  const router = useRouter();
  return (
    <MainLayout>
      <BalanceHeader type={2}></BalanceHeader>
      <div className="flex justify-center align-center  p-6 mt-5">
        <div className="card max-w-md w-full gap-5 flex-col flex p-6 bg-white rounded-3xl shadow">
          <div className="inline-flex gap-3 items-center justify-center">
            <Image alt="cashout" src={cashout}></Image>
            <label className="text-center">Cashout</label>
          </div>
          <div className="bg-gray p-3 rounded-[20px] w-full">
            <div className="inline-flex gap-3 items-center justify-center">
              <Image alt="dollar" src={dollar}></Image>
              <label className="text-center">300</label>
            </div></div>
          <div>
            <label>Amount</label>
          </div>
          <Input type="text" id="amount" value=""></Input>
          <div className="grid grid-cols-3 grid-rows-3 gap-4  align-middle   place-items-center">
            {denomination.map((object, i) => {
              return <div  key={`denomination-${i}`}  className="amount-button text-center rounded-[20px] w-full p-3">{object}</div>
            })}
          </div>
<button onClick={()=>router.push('/payment/failed')} className="primary w-full">Confirmed</button>
       </div>
        <br />

      </div>
    </MainLayout >
  );
}
