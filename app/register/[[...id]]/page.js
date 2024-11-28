'use client'
import CommonLayout from "@layout/commonLayout";
import { useActionState, useEffect, useState } from "react";
import Input from "@components/input";
import Image from "next/image";
import otp from '@public/images/otp.png'
import otpVerify from '@public/images/otp_verify.png';
import Terms from '@components/modal/terms'
import { register } from "@actions/account";
import dynamic from "next/dynamic";
import Alert from "@components/alert";
import { usePathname } from 'next/navigation';

const Form = dynamic(() => import('@components/form'), { ssr: false })

const form = [

  {
    type: "separator",
    label: "Profile Details"
  },
  // {
  //   id: "referralCode",
  //   type: "text",
  //   value: "",
  //   label: "Referral"
  // },

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
    id: "birthdate",
    type: "date",
    value: "",
    label: "Birthdate"
  },
  {
    type: "separator",
    label: "Account Details"
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
  const pathname = usePathname();
  const id = pathname.split('/').filter(Boolean);

  const [step, setStep] = useState(1);
  const [isShowModal, setIsShowModal] = useState(false)
  const [alert, setAlert] = useState({ timeout: 3000, isOpen: false, message: "", type: "success" })

  const [state, registerAction] = useActionState(register, undefined);

  useEffect(() => {
    console.log(id)

    if (id.length > 1) {
      let indexToInsert = 1;
      form.splice(indexToInsert, 0,
        {
          id: "agentReferralCode",
          type: "text",
          value: id[1],
          label: "Referral Code",
          isReadonly: true
        });
    }

    if (state && state.errors) {

      var error = state.errors
      if (error.hasOwnProperty('alert')) {
        setAlert({ timeout: 5000, isOpen: true, type: "error", message: error.alert[0] })

      }
    }
  }, [state])

  const body = () => {
    if (step == 1) {
      return <div className="flex flex-col card  w-10/12 max-w-sm p-6 mt-10 bg-white rounded-3xl shadow">
        <Form hasBackButton={true} action={registerAction} state={state} fields={form} buttonText="Register!"></Form>
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
  const onCloseAlert = () => {
    setAlert({ timeout: 3000, isOpen: false, type: "", message: "" })

  }
  return (
    <CommonLayout>

      {alert.isOpen && <Alert timeout={alert.timeout} onClose={onCloseAlert} title="Lucky Taya" message={alert.message} type={alert.type}></Alert>}


      {body()}

      {isShowModal && <Terms onClose={() => closeModal()}></Terms>}
    </CommonLayout >
  );
}
