"use client";
import Link from "next/link";
import CommonLayout from "../layout/commonLayout";
import { forgotPassword, login } from "../actions/auth";
import { useActionState, useEffect } from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
const Form = dynamic(()=>import('../components/form'),{ssr : false})
const form = [
  {
    id: "username",
    type: "text",
    value: "",
    label: "Username"
  },
]
export default function ForgotPassword() {
  
  const [state, forgotPasswordAction] = useActionState(forgotPassword, undefined);
  useEffect (() => {
    if(state == true){
      redirect('/login')
    }
  }, [state])
  
  return (
    <CommonLayout>
      <div className="flex flex-col card max-w-sm p-6 m-10 bg-white rounded-3xl shadow">
        <label className="label-header1 text-center">Forgot Password</label>
        <Form hasBackButton={true} action={forgotPasswordAction} state={state} fields={form} buttonText="Submit"></Form>
      </div>
    </CommonLayout >
  );
}
