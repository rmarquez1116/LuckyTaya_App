"use client";
import Link from "next/link";
import CommonLayout from "../layout/commonLayout";
import Form from "../components/form";
import { login } from "../actions/auth";
import { useActionState } from "react";

const form = [
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
    label: "Password"
  },
]
export default function Login() {
  
  const [state, loginAction] = useActionState(login, undefined);
  return (
    <CommonLayout>
      <div className="flex flex-col card max-w-sm p-6 mt-10 bg-white rounded-3xl shadow">
        <label className="text-center">Login</label>
        <Form action={loginAction} state={state} fields={form} buttonText="Login"></Form>

        <br />
        <div className="flex flex-col gap-1">
          <Link className="text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href='/forgot-password'>Forgot your password?</Link>
          <label className="text-center">New to E-Billiards</label>
          <Link className="text-center underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href='/register'>Sign-up</Link>
          <label className="text-center">By continuing you agree to our User Agreement and Privacy Policy</label>

        </div>
      </div>
    </CommonLayout >
  );
}
