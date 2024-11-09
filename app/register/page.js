'use client'
import CommonLayout from "../layout/commonLayout";
import { useActionState, useState } from "react";
import Input from "../components/input";
import Image from "next/image";
import otp from '../../public/images/otp.png'
import otpVerify from '../../public/images/otp_verify.png';
import Terms from '../components/modal/terms'
import { register } from "../actions/account";
import dynamic from "next/dynamic";

const Form = dynamic(()=>import('../components/form'),{ssr : false})
// const form = [
//   {
//     id: "referral",
//     type: "text",
//     value: "",
//     label: "Referral"
//   },
//   {
//     id: "mobile_number",
//     type: "text",
//     value: "",
//     label: "Mobile Number"
//   },
//   {
//     id: "password",
//     type: "password",
//     value: "",
//     label: "Create Password"
//   },
//   {
//     id: "re_password",
//     type: "password",
//     value: "",
//     label: "Re-enter your Password"
//   },
//   {
//     id: "username",
//     type: "text",
//     value: "",
//     label: "Username"
//   },
//   {
//     id: "birthdate",
//     type: "date",
//     value: "",
//     label: "Birthdate"
//   },
//   {
//     id: "region",
//     type: "text",
//     value: "",
//     label: "Region"
//   },
//   {
//     id: "province",
//     type: "text",
//     value: "",
//     label: "Province"
//   },
//   {
//     id: "city",
//     type: "text",
//     value: "",
//     label: "City / Municipality"
//   },
//   {
//     id: "barangay",
//     type: "text",
//     value: "",
//     label: "Barangay"
//   },
// ]


const form = [
  {
    id: "referralCode",
    type: "text",
    value: "",
    label: "Referral"
  },
  {
    id: "firstname",
    type: "text",
    value: "",
    label: "First Name"
  },
  {
    id: "lastname",
    type: "text",
    value: "",
    label: "Last Name"
  },
  {
    id: "phoneNumber",
    type: "text",
    value: "",
    label: "Mobile Number"
  },
  {
    id: "email",
    type: "email",
    value: "",
    label: "Email"
  },
  {
    id: "username",
    type: "text",
    value: "",
    label: "Username"
  },
  {
    id: "password",
    type: "password",
    value: "",
    label: "Create Password"
  },
  {
    id: "re_password",
    type: "password",
    value: "",
    label: "Re-enter your Password"
  },

]
export default function Register() {
  const [step, setStep] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false)

  const [state, registerAction] = useActionState(register, undefined);

  const body = () => {
    if (step == 1) {
      return <div className="flex flex-col card w-10/12 max-w-md p-6 mt-10 bg-white rounded-3xl shadow">
        <Form action={registerAction} state={state} fields={form} buttonText="Register!"></Form>
      </div>
    }
    else if (step == 2) {
      return <div className="flex items-center flex-col gap-5 card w-10/12 max-w-md p-10 mt-10 bg-white rounded-3xl shadow">
        <label className="text-center">Verification</label>
        <Image alt='otp' className="text-center" src={otp}></Image>
        <label className="text-center">We wil send you a ONE TIME PASSWORD (OTP) on your mobile number</label>


        <label className="text-center">Mobile Number</label>
        <Input className="w-full" type="text" id="mobileNumber" name="number" value="" />
        <button onClick={() => setStep(3)} className="primary w-full">Accept</button>
      </div>
    } else {
      return <div className="flex items-center  flex-col gap-5 card w-10/12 max-w-md p-10 mt-10 bg-white rounded-3xl shadow">
        <label className="text-center">Verification</label>
        <Image alt='verify' className="text-center" src={otpVerify}></Image>
        <label className="text-center">You will get a ONE TIME PASSWORD via SMS</label>


        <label className="text-center">Enter One Time Password</label>
        <Input className="w-full" type="text" id="mobileNumber" name="number" value="" />
        <button onClick={() => setIsShowModal(true)} className="primary w-full">Accept</button>
        <label className="text-center">Didn&apos;t receive the verification OTP?</label>
        <label className="text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href='/sign-up'>Resend Again</label>

      </div>
    }
  }
  const closeModal = () => {
    setIsShowModal(false);
    setStep(1);
  }
  return (
    <CommonLayout>
      {body()}

      {isShowModal && <Terms onClose={() => closeModal()}></Terms>}
    </CommonLayout >
  );
}
